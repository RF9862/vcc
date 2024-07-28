import crypto from "crypto";

import axios from "axios";

import {
  VCC_AGENCY_APP_SECRET_KEY,
  VCC_AGENCY_APP_USER,
} from "../config/index.js";
import Card from "../models/Card.js";
import Order from "../models/Order.js";
import Setting from "../models/Setting.js";
import User from "../models/User.js";

function generateSign(params) {
  const sortedKeys = Object.keys(params).sort();

  let formattedString = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  formattedString = formattedString.replace(/\+/g, "%20");
  const stringSignTemp = `${formattedString}&key=${VCC_AGENCY_APP_SECRET_KEY}`;

  const md5Hash = crypto
    .createHash("md5")
    .update(stringSignTemp)
    .digest("hex")
    .toUpperCase();

  return md5Hash;
}

async function sendRequest(apiUrl, type, args) {
  const params = {
    ...args,
    userSerial: VCC_AGENCY_APP_USER,
    timeStamp: Date.now(),
  };

  const sign = generateSign(params);
  params.sign = sign;

  const url = `http://api.vcc.agency/bank_card/${apiUrl}`;
  console.log(url, type, params);

  try {
    const response =
      type === "get"
        ? await axios.get(url, { params })
        : await axios.post(url, params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

function getErrorMessageFromAPI(error) {
  let errMsg;
  switch (error.response.data.code) {
    case 20002:
      if (error.response.data.msg === "最少充值金额大于10 USD") {
        errMsg === "Minimum deposit amount is greater than 10 USD";
      } else {
        errMsg =
          "This card cannot be activated. Please contact online customer service for processing.";
      }
      break;
    case 10006:
      errMsg =
        "The object does not exist. The credit card to be activated does not exist. Please contact the administrator.";
      break;
    case 20001:
      errMsg = "Insufficient balance.";
      break;
    case 40005:
      errMsg = "Signature error.";
      break;

    default:
      errMsg = "Server error!";
      break;
  }
  return errMsg;
}

async function getCardOpeningDetails(orderId) {
  const requestData = { orderId };
  const responseData = await sendRequest("open_detail", "post", requestData);
  return responseData.content;
}

export const getMyCards = async (req, res) => {
  try {
    const data = await sendRequest("my_cards", "get");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const openCard = async (req, res) => {
  const { cardBin, amount, remark } = req.body;
  const userId = req.user.id;
  const user = await User.findById(userId);
  const setting = await Setting.findOne();
  const { newCardFee, topupFee: rechargeCardFee } = setting;

  if (user.balance < newCardFee + amount * (1 + rechargeCardFee)) {
    return res.status(500).json({ error: "Insufficient Balance" });
  }

  try {
    const requestData = { cardBin, amount, ...(remark ? { remark } : {}) };
    const responseData = await sendRequest("open_card", "post", requestData);

    if (responseData.code === 0 && responseData.content) {
      const cardOpeningDetails = await getCardOpeningDetails(
        responseData.content.id
      );
      const data = await sendRequest("my_cards", "get");
      const card = data.content.find(
        ({ id }) => id === cardOpeningDetails.userBankCardId
      );

      if (!card) {
        return res.status(500).json({ error: "We couldn't open new card." });
      }

      const changeAmount = (newCardFee + amount * (1 + rechargeCardFee)) * -1;
      user.balance += changeAmount;
      await user.save();

      const newCard = new Card({
        userId,
        cardId: cardOpeningDetails.userBankCardId,
        organization: card.organization,
        state: cardOpeningDetails.state,
        number: card.number,
        expiryDate: card.expiryDate,
        cvv: card.cvv,
        remark: cardOpeningDetails.remark,
        cardBalance: card.cardBalance,
        adapterSign: card.adapterSign,
        addressMv: card.addressMv ?? {
          lastName: "Hettinger",
          firstName: "Edgar",
          address: "2381 Zanker Rd Ste 110",
          continent: "THAT",
          city: "San Jose",
          postCode: 95131,
        },
        special: card.special,
        bankCardId: card.bankCardId,
      });

      await newCard.save();

      await Order.create({
        userId,
        cardId: newCard.id,
        changeAmount,
        balAfterChange: user.balance,
        remark: card.remark,
        type: "new_card",
      });
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: getErrorMessageFromAPI(error) });
  }
};

export const getCardDetails = async (req, res) => {
  const { id } = req.query;

  try {
    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rechargeCreditCard = async (req, res) => {
  const { id, amount } = req.body;
  const user = await User.findById(req.user.id);
  const setting = await Setting.findOne();
  const { topupFee: rechargeCardFee } = setting;

  if (user.balance < amount * (1 + rechargeCardFee)) {
    return res.status(500).json({ error: "Insufficient Balance" });
  }

  try {
    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const requestData = { bankCardId: card.cardId, amount };
    const responseData = await sendRequest("recharge", "post", requestData);

    if (responseData.code === 0) {
      const changeAmount = -1 * amount * (1 + rechargeCardFee);
      user.balance += changeAmount;
      await user.save();

      const cardDetails = responseData.content.bankCard;
      card.cardBalance = cardDetails.cardBalance;
      await card.save();

      await Order.create({
        userId: user.id,
        cardId: card.id,
        changeAmount,
        balAfterChange: user.balance,
        remark: card.remark,
        type: "recharge",
      });
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: getErrorMessageFromAPI(error) });
  }
};

export const getCards = async (req, res) => {
  try {
    const { status, number, page = 1, limit = 10 } = req.query;

    const query = { userId: req.user.id };
    if (status) {
      query.state = status;
    }

    if (number) {
      query.number = { $regex: number, $options: "i" };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Optional: Sort by creation date in descending order
    };

    const cards = await Card.paginate(query, options);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const terminateCard = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  try {
    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (card.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    card.state = -20; // Assuming -20 is the state for terminated
    await card.save();

    res.json({ message: "Card terminated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
