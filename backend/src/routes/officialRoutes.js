import express from "express";
import {
  getOfficials,
  getOfficialById,
  createOfficial,
  updateOfficial,
  deleteOfficial,
} from "../controllers/officialController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getOfficials).post(protect, admin, createOfficial);

router
  .route("/:id")
  .get(getOfficialById)
  .put(protect, admin, updateOfficial)
  .delete(protect, admin, deleteOfficial);

export default router;
