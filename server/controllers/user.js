import crypto from "crypto";

import jwt from "jsonwebtoken";

import { PASSPORT_SECRET_KEY } from "../config/index.js";
import { sendEmail } from "../config/mailer.js";
import User from "../models/User.js";

export const signup = async (req, res) => {
  console.log("ttttt");
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "restricted") {
      return res.status(401).json({
        message: "The user is restricted. Please contact with admin.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        balance: user.balance,
        privilege: user.privilege,
      },
      PASSPORT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    ); // Use an environment variable for the secret
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  const { password, oldPassword } = req.body;
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user || !(await user.validatePassword(oldPassword))) {
      return res.status(401).json({ message: "Old password is incorrect!" });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password is updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://${req.headers.origin}/reset-password/${token}`;
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
