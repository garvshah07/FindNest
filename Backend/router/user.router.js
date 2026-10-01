import express from "express";
import {
  createUser,
  getAllUserDetails,
  logedinUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/", getAllUserDetails);
router.post("/create", createUser);
router.post("/login", logedinUser)

export default router;
