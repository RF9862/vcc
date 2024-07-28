import bcryptjs from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { compareSync, genSaltSync, hashSync } = bcryptjs;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
    privilege: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "restricted"],
      default: "active",
      required: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// middleware
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const salt = genSaltSync(10);
  this.password = hashSync(this.password, salt);
  next();
});

UserSchema.methods.validatePassword = function (password) {
  return compareSync(password, this.password);
};

UserSchema.plugin(mongoosePaginate);

export default mongoose.model("User", UserSchema);
