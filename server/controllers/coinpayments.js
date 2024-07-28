import crypto from "crypto";
import qs from "querystring";

import client from "../config/coinpayments.js";
import {
  COINPAYMENT_IPN_SECRET,
  COINPAYMENT_MERCHANT_ID,
} from "../config/index.js";
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const coin = "USDT.TRC20";

// Create a new transaction
export const createTransaction = async (req, res) => {
  const { email, id } = req.user;
  const { amount } = req.body;
  try {
    const options = {
      currency1: "USD", // The original currency (e.g., USD)
      currency2: coin, // The cryptocurrency to be used
      amount: amount, // The amount in the original currency
      buyer_email: email, // The buyer's email
      custom: id,
    };

    const result = await client.createTransaction(options);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get top-up history
export const getTopUpHistory = async (req, res) => {
  const userId = req.user.id;
  const {
    page = 1,
    limit = 10,
    search = "",
    type,
    status,
    currency,
    startDate,
    endDate,
  } = req.query;

  try {
    const query = { userId };

    if (type) {
      query.type = type;
    }
    if (status) {
      query.status = status;
    }
    if (currency) {
      query.currency = currency;
    }
    if (search) {
      query.$or = [
        { txnId: { $regex: search, $options: "i" } },
        { sendTx: { $regex: search, $options: "i" } },
        { amount: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.timestamp = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.timestamp = {
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find(query)
      .skip(((page > 0 ? page : 1) - 1) * limit)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 }); // Sorting by most recent

    const count = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get balance
export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.balance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Request withdrawal
export const requestWithdrawal = async (req, res) => {
  const { amount, address } = req.body;
  const user = await User.findById(req.user.id);
  if (user.balance < amount) {
    return res.status(500).json({ error: "Insufficient Balance!" });
  }

  try {
    const options = {
      amount,
      currency: coin,
      address,
      note: req.user.id,
    };

    const result = await client.createWithdrawal(options);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const handleDeposit = async (ipnData) => {
  if (ipnData.status === "100") {
    // Deposit confirmed
    const user = await User.findById(ipnData.custom);
    if (user) {
      user.balance = (user.balance ?? 0) + parseFloat(ipnData.net);
      await user.save();

      const transaction = new Transaction({
        userId: user._id,
        txnId: ipnData.txn_id,
        sendTx: ipnData.send_tx ?? "",
        amount: parseFloat(ipnData.net),
        currency: ipnData.currency2,
        type: "deposit",
        status: "confirmed",
      });

      await transaction.save();

      await Order.create({
        userId: user._id,
        transactionId: transaction.id,
        changeAmount: parseFloat(ipnData.net),
        balAfterChange: user.balance,
        type: "deposit",
      });
    }
  }
};

const handleWithdrawal = async (ipnData) => {
  if (ipnData.status === "2") {
    // Withdrawal complete
    const user = await User.findById(ipnData.note);
    if (user) {
      user.balance -= parseFloat(ipnData.amount);
      await user.save();

      const transaction = new Transaction({
        userId: user._id,
        txnId: ipnData.txn_id,
        amount: parseFloat(ipnData.amount),
        currency: ipnData.currency,
        type: "withdrawal",
        status: "confirmed",
        sendTx: ipnData.send_tx ?? "",
      });

      await transaction.save();

      await Order.create({
        userId: user._id,
        transactionId: transaction.id,
        changeAmount: parseFloat(ipnData.amount),
        balAfterChange: user.balance,
        type: "withdrawal",
      });
    }
  }
};

// Request withdrawal
export const handleIPN = async (req, res) => {
  const ipnSecret = COINPAYMENT_IPN_SECRET;
  const merchantId = COINPAYMENT_MERCHANT_ID;

  const hmac = req.headers["hmac"];
  const ipnData = req.body;

  // Check for HMAC header
  if (!hmac) {
    return res.status(400).send("No HMAC signature sent");
  }

  // Check for merchant ID in the body
  const merchant = ipnData.merchant;
  if (!merchant) {
    return res.status(400).send("No Merchant ID passed");
  }

  // Validate merchant ID
  if (merchant !== merchantId) {
    return res.status(400).send("Invalid Merchant ID");
  }

  // Verify the HMAC signature
  const paramString = qs.stringify(ipnData).replace(/%20/g, `+`);
  const calculatedHmac = crypto
    .createHmac("sha512", ipnSecret)
    .update(paramString)
    .digest("hex");

  if (calculatedHmac !== hmac) {
    return res.status(400).send("HMAC verification failed");
  }

  // Handle IPN data
  try {
    if (ipnData.ipn_type === "api") {
      await handleDeposit(ipnData);
    } else if (ipnData.ipn_type === "withdrawal") {
      await handleWithdrawal(ipnData);
    }

    res.status(200).send("IPN received");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing IPN");
  }
};
