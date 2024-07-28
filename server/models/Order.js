import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    changeAmount: {
      type: Number,
      required: true,
    },
    balAfterChange: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
    },
    type: {
      type: String,
      enum: ["deposit", "new_card", "recharge", "withdrawal"],
      required: true,
    },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);

export default mongoose.model("Order", OrderSchema);
