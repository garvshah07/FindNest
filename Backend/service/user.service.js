import User from "../model/user.model.js";
import { hash, compare } from "bcryptjs";
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { configDotenv } from "dotenv";

configDotenv()

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

    const isMatch = await compare(data.password, user.password)

    if (isMatch) {
      const token = sign({
        "firstname": user.firstname,
        "email": user.email,
        "accounttype": user.accounttype
      }, token_key, { expiresIn: "1h" })

      return token
    } else {
      throw new Error("Invalid Credencial");
    }
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
}



export { getAllUser, createdUser, loginUser };
