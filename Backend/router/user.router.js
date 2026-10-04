import express from "express";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  logedinUserController,
  updateUserController,
  forgotPasswordController,
  verifyOTPController,
  resetPasswordController,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/", getAllUsersController);
router.post("/create", createUserController);
router.post("/login", logedinUserController);
router.put("/update/:id", updateUserController);
router.delete("/delete/:id", deleteUserController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOTPController);
router.post("/reset-password", resetPasswordController);

export default router;
