import express from "express";
import {
  createUser,
  getAllUserDetails,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/", getAllUserDetails);
router.post("/create", createUser);

export default router;
