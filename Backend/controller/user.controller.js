import {
  getAllUsers,
  createdUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../service/user.service.js";
import User from "../model/user.model.js";

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "Users Fetched", users: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createUserController = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const data = { firstname, lastname, email, password, role };

      await createdUser(data);
      res.status(200).json({ message: "User Created" });
    } else {
      res.status(404).json({ message: "User Is Allready Exist" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logedinUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "" && password === "") {
      res.status(400).json({ message: "Enter the Email & Password" });
    } else {
      const token = await loginUser(email, password);
      res.status(200).json({ message: "User Login Successfuly", token: token });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUserController = async (req, res) => {
  const {
    updatedFirstName,
    updatedLastName,
    updatedEmail,
    updatedPassword,
    updatedRole,
  } = req.body;

  const { id } = req.params;

  const updatedData = {
    updatedFirstName,
    updatedLastName,
    updatedEmail,
    updatedPassword,
    updatedRole,
  };

  await updateUser(updatedData, id);
  res.status(200).json({ messgae: "User Data Updated" });
  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.status(200).json({ message: "User Deleted Succesfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getAllUsersController,
  createUserController,
  logedinUserController,
  updateUserController,
  deleteUserController,
};
