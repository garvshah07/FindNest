import User from "../model/user.model.js";
import { hash, compare } from "bcryptjs";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

configDotenv();

const token_key = process.env.JWT_KEY;

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const createdUser = async (data) => {
  try {
    const hasedPassword = await hash(data.password, 10);

    const createUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hasedPassword,
      accounttype: data.accounttype,
    };

    const createdUser = await User.create(createUser);

    return createdUser;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User Not Found");
    }

    const isMatch = await compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          firstname: user.firstname,
          email: user.email,
          accounttype: user.accounttype,
        },
        token_key,
        { expiresIn: "1h" },
      );
      return token;
    } else {
      throw new Error("Invalid Credential");
    }
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const updateUser = async (updatedData, id) => {
  const {
    updatedFirstName,
    updatedLastName,
    updatedEmail,
    updatedPassword,
    updatedAccounntType,
  } = updatedData;

  const updatedHashedPassword = await hash(updatedPassword, 10);

  const updateData = {
    firstname: updatedFirstName,
    lastname: updatedLastName,
    email: updatedEmail,
    password: updatedHashedPassword,
    accounttype: updatedAccounntType,
  };

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    return user;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new Error("User Not Found");
    }

    const deletedUser = await User.deleteOne({ _id: id });

    return deletedUser;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

export { getAllUsers, createdUser, loginUser, updateUser, deleteUser };
