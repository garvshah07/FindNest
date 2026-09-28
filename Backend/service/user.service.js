import User from "../model/user.model.js";
import { genSalt, hash } from "bcryptjs";

const createdUser = async (data) => {
  try {
    const createdUser = await User.create(data);
    return createdUser;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const getAllUser = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

export { getAllUser, createdUser };
