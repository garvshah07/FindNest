import { getAllUser, createdUser } from "../service/user.service.js";

const getAllUserDetails = async (req, res) => {
  try {
    const users = await getAllUser();
    res.status(200).send({ message: "Users Fetched", users: users });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { firstname, lastname, email, password, mode } = req.body;

  const data = { firstname, lastname, email, password, mode };
  try {
    await createdUser(data);
    res.status(200).send({ message: "User Created" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export { getAllUserDetails, createUser };
