import mongoose, { Schema } from "mongoose";

const SettingSchema = new Schema(
  {
    newCardFee: {
      type: Number,
      default: 1.8,
    },
    topupFee: {
      type: Number,
      default: 0.035,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", SettingSchema);
