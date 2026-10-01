import express from "express";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  logedinUserController,
  updateUserController,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/", getAllUsersController);
router.post("/create", createUserController);
router.post("/login", logedinUserController);
router.put("/update/:id", updateUserController);
router.delete("/delete/:id", deleteUserController);

export default router;
