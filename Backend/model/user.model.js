import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: ture, default: "User" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
