import express from "express";
import {
  allUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import { updateUserSchema } from "../validations/user.validation.js";

const router = express.Router();

// Users
router.get("/all-user", isAuthenticated, isAdmin, allUser);
router.get("/get-user/:userId", getUserById);
router.put("/update/:id", isAuthenticated, singleUpload, validate(updateUserSchema), updateUser);


export default router;
