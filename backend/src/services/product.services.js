import { Product } from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import { getDataUri } from "../utils/dataUri.js";

export const createProduct = async ({
  userId,
  productName,
  productDesc,
  productPrice,
  category,
  brand,
  files,
}) => {
  const uploadedImages = [];

  try {
    // ====================
    // Upload Product Images
    // ====================

    if (files?.length) {
      for (const file of files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(
          fileUri,
          {
            folder: "mern_products",
          },
        );

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // ====================
    // Create Product
    // ====================

    const product = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg: uploadedImages,
    });

    return product;
  } catch (error) {
    // ====================
    // Rollback Cloudinary Uploads
    // ====================

    if (uploadedImages.length > 0) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          cloudinary.uploader.destroy(
            image.public_id,
          ),
        ),
      );
    }

    throw error;
  }
};