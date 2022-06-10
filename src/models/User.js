import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  money: { type: Number, default: 0 },
  buyItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
