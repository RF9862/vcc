import { Types } from "mongoose";

import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  try {
    const {
      type,
      remark,
      page = 1,
      limit = 10,
      all,
      startDate,
      endDate,
    } = req.query;
    const query = { userId: req.user.id };
    if (type) {
      const types = Array.isArray(type) ? type : [type];
      query.type = { $in: types };
    }

    if (remark) {
      query.remark = { $regex: remark, $options: "i" };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    if (all === "true") {
      const orders = await Order.find(query).sort({ createdAt: -1 });
      res.json(orders);
    } else {
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 }, // Optional: Sort by creation date in descending order
      };

      const orders = await Order.paginate(query, options);
      res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  const { orderId } = req.query;
  try {
    const result = await Order.aggregate([
      { $match: { _id: Types.ObjectId.createFromHexString(orderId) } },
      {
        $lookup: {
          from: "cards",
          localField: "cardId",
          foreignField: "_id",
          as: "cardDetails",
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "transactionId",
          foreignField: "_id",
          as: "transactionDetails",
        },
      },
      {
        $project: {
          userId: 1,
          cardId: 1,
          transactionId: 1,
          changeAmount: 1,
          balAfterChange: 1,
          remark: 1,
          type: 1,
          cardDetails: { $arrayElemAt: ["$cardDetails", 0] },
          transactionDetails: { $arrayElemAt: ["$transactionDetails", 0] },
        },
      },
    ]);

    res.status(200).json(result?.[0]);
  } catch (error) {
    console.error("Error fetching order with details:", error);
    res.status(400).json(error);
  }
};
