import express from "express";
import {
  getAllPropertiesController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
} from "../controller/property.controller.js";

const router = express.Router();

router.get("/", getAllPropertiesController);
router.post("/create", createPropertyController);
router.put("/update/:id", updatePropertyController);
router.delete("/delete/:id", deletePropertyController);

export default router;