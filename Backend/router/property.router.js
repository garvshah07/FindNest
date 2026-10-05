import express from "express";
import { getAllPropertiesController , createPropertyController } from "../controller/property.controller.js";


const router = express.Router();

router.get("/" , getAllPropertiesController)
router.post("/create" , createPropertyController)

export default router