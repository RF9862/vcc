import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    cardBalance: {
      type: Number,
      required: true,
    },
    adapterSign: String,
    addressMv: Schema.Types.Mixed,
    special: Boolean,
    bankCardId: String,
  },
  { timestamps: true }
);

CardSchema.plugin(mongoosePaginate);

export default mongoose.model("Card", CardSchema);
