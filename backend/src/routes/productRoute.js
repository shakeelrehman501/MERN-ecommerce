import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProductFilters,
  updateProduct,
} from "../controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";
import { validate } from "../middleware/validate.js";
import {
  addProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

const router = express.Router();

router.post(
  "/addproduct",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  validate(addProductSchema),
  addProduct,
);


router.get("/getallproducts", getAllProduct);
// Filters
router.get("/filters", getProductFilters);

router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);

router.put(
  "/update/:productId",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  validate(updateProductSchema),
  updateProduct,
);

export default router;
