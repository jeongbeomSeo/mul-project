import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  previousBlockHash: { type: String, required: true },
  merkleRoot: { type: String, required: true },
  timestamp: { type: Number, required: true },
  difficulty: { type: Number, required: true },
  nonce: { type: Number, required: true },
  time: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  item: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  sold: { type: Boolean, default: false },
  entrants: [{ type: Object }],
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  soldPrice: { type: Number },
  valid: { type: Boolean, required: true, default: false },
  timeOut: { type: Boolean, default: false },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
