import User from "../model/user.model.js";
import { genSalt, hash, compare } from "bcryptjs";
import pkg from 'jsonwebtoken';
const { sign } = pkg;


const token_key = process.env.JWT_KEY

const getAllUser = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};


const createdUser = async (data) => {
  try {

    const hasedPassword = await hash(data.password, 10)

    const createUser = {
      "firstname": data.firstname,
      "lastname": data.lastname,
      "email": data.email,
      "password": hasedPassword,
      "accounttype": data.accounttype
    }

    const createdUser = await User.create(createUser);

    return createdUser;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const loginUser = async (data) => {
  try {
    const user = await User.findOne({ email: data.email });

    const isMatch = compare(data.password, user.password)

    if (isMatch) {
      const token = sign({
        "firstname": user.firstname,
        "email": user.email,
        "accounttype": user.accounttype
      }, JWT_KEY, { expiresIn: "1h" })

      return token
    } else {
      throw new Error("Invalid Credencial");
    }
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
}



export { getAllUser, createdUser, loginUser };
