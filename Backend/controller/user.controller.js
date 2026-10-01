import { getAllUser, createdUser, loginUser } from "../service/user.service.js";
import User from "../model/user.model.js"

const getAllUserDetails = async (req, res) => {
  try {
    const users = await getAllUser();
    res.status(200).send({ message: "Users Fetched", users: users });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { firstname, lastname, email, password, accounttype } = req.body;
  try {

    const user = await User.findOne({ email: email })

    if (!user) {

      const data = { firstname, lastname, email, password, accounttype }

      await createdUser(data);
      res.status(200).send({ message: "User Created" });
    } else {
      res.staus(404).send({ message: "User Exist" })
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const logedinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = { email, password }

    if (email === "" && password === "") {
      res.status(400).send({ message: "Enter the Email & Password" });
    } else {
      await loginUser(data)
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export { getAllUserDetails, createUser, logedinUser };
