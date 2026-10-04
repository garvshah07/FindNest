import {
  getAllUsers,
  createdUser,
  loginUser,
  updateUser,
  deleteUser,
  sendPasswordResetOTP,
} from "../service/user.service.js";
import User from "../model/user.model.js";
import PasswordReset from "../model/passwordReset.model.js";
import { generateOTP, hashOTP } from "../config/otpgen.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "Users Fetched", users: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createUserController = async (req, res) => {
  const { firstname, lastname, email, confirmPassword, password, role } =
    req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      if (password !== confirmPassword) {
        res
          .status(400)
          .json({ message: "Password and Confirm Password do not match" });
        return;
      }

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
    confirmPassword,
    updatedRole,
  } = req.body;

  const { id } = req.params;

  if (updatedPassword !== confirmPassword) {
    res
      .status(400)
      .json({ message: "Password and Confirm Password do not match" });
    return;
  }

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

const forgotPasswordController = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message: "If an account exists with this email, an OTP has been sent.",
    });
  }

  const otp = generateOTP();

  const otpHash = hashOTP(otp);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await PasswordReset.deleteMany({ email });

  await PasswordReset.create({
    email,
    otpHash,
    expiresAt,
    attempts: 0,
    verified: false,
  });

  await sendPasswordResetOTP(email, otp);

  return res.status(200).json({
    message: "If an account exists with this email, an OTP has been sent.",
  });
  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyOTPController = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const resetRequest = await PasswordReset.findOne({
      email,
      verified: false,
    }).sort({ createdAt: -1 });

    if (!resetRequest) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    
    if (resetRequest.attempts >= 5) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(429).json({
        message: "Too many attempts. Request a new OTP.",
      });
    }

    resetRequest.attempts += 1;

    const submittedHash = hashOTP(otp);


    if (submittedHash !== resetRequest.otpHash) {
      await resetRequest.save();

      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }
    resetRequest.verified = true;

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    resetRequest.resetTokenHash = resetTokenHash;

    resetRequest.resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await resetRequest.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: "Reset token and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const resetRequest = await PasswordReset.findOne({
      resetTokenHash,
      verified: true,
    });

    if (!resetRequest) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Check reset-token expiry
    if (
      !resetRequest.resetTokenExpiresAt ||
      resetRequest.resetTokenExpiresAt < new Date()
    ) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        message: "Reset token has expired",
      });
    }

    const user = await User.findOne({
      email: resetRequest.email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid reset request",
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    user.password = passwordHash;

    await user.save();

    // Make reset token unusable
    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    });

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export {
  getAllUsersController,
  createUserController,
  logedinUserController,
  updateUserController,
  deleteUserController,
  forgotPasswordController,
  verifyOTPController,
  resetPasswordController,
};
