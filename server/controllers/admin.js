import Order from "../models/Order.js";
import Setting from "../models/Setting.js";
import User from "../models/User.js";

export const setFee = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    const { newCardFee, topupFee } = req.body;
    if (newCardFee) {
      setting.newCardFee = newCardFee;
    }
    if (topupFee) {
      setting.topupFee = topupFee;
    }

    await setting.save();
    res.status(200).json(setting);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getFee = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    res.status(200).json(setting);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const changeUserStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const user = await User.findById(id);
    user.status = status;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const changeUserPrivilege = async (req, res) => {
  try {
    const { id, privilege } = req.body;
    const user = await User.findById(id);
    user.privilege = privilege;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { status, privilege, email, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }
    if (privilege) {
      query.privilege = privilege;
    }
    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Optional: Sort by creation date in descending order
    };

    const users = await User.paginate(query, options);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export const getOrders = async (req, res) => {
  try {
    const {
      email,
      type,
      remark,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (type) {
      query.type = type;
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

    if (email) {
      const users = await User.find({
        email: { $regex: email, $options: "i" },
      });
      if (users.length > 0) {
        query.userId = { $in: users.map((user) => user._id) };
      } else {
        return res.status(200).json({
          docs: [],
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10,
          nextPage: null,
          page: 1,
          pagingCounter: 1,
          prevPage: null,
          totalDocs: 0,
          totalPages: 1,
        });
      }
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Optional: Sort by creation date in descending order
      populate: {
        path: "userId",
        select: "email", // Only select the email field from the user
      },
    };

    const orders = await Order.paginate(query, options);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
