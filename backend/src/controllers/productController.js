import mongoose from "mongoose";
import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ====================
// Add Product
// ====================

export const addProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    productDesc,
    productPrice,
    category,
    brand,
  } = req.body;

  const userId = req.id;

  const uploadedImages = [];

  try {
    // ====================
    // Upload Images
    // ====================

    if (req.files?.length) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(
          fileUri,
          {
            folder: "mern_ref_checking",
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

    return res.status(201).json(
      new ApiResponse(
        201,
        "Product created successfully",
        product,
      ),
    );
  } catch (error) {
    // ====================
    // Rollback Uploaded Images
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
});

// ====================
// Get All Products
// ====================

export const getAllProduct = asyncHandler(
  async (req, res) => {
    const {
      page = 1,
      limit = 8,
      search = "",
      category = "All",
      brand = "All",
      minPrice = 0,
      maxPrice = 9999999,
      sort = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1,
    );

    const pageLimit = Math.min(
      Math.max(Number(limit) || 8, 1),
      50,
    );

    const minimumPrice = Math.max(
      Number(minPrice) || 0,
      0,
    );

    const maximumPrice = Math.max(
      Number(maxPrice) || 9999999,
      minimumPrice,
    );

    // ====================
    // Filters
    // ====================

    const filter = {
      productPrice: {
        $gte: minimumPrice,
        $lte: maximumPrice,
      },
    };

    // ====================
    // Search
    // ====================

    if (search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.productName = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    // ====================
    // Category
    // ====================

    if (category !== "All") {
      filter.category = category;
    }

    // ====================
    // Brand
    // ====================

    if (brand !== "All") {
      filter.brand = brand;
    }

    // ====================
    // Sorting
    // ====================

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "lowToHigh") {
      sortOption = {
        productPrice: 1,
      };
    }

    if (sort === "highToLow") {
      sortOption = {
        productPrice: -1,
      };
    }

    // ====================
    // Pagination
    // ====================

    const skip = (currentPage - 1) * pageLimit;

    const [products, totalProducts] =
      await Promise.all([
        Product.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(pageLimit)
          .lean(),

        Product.countDocuments(filter),
      ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Products fetched successfully",
        {
          products,
          currentPage,
          totalPages: Math.ceil(
            totalProducts / pageLimit,
          ),
          totalProducts,
        },
      ),
    );
  },
);

// ====================
// Get Product Filters
// ====================

export const getProductFilters = asyncHandler(
  async (req, res) => {
    const [categories, brands] =
      await Promise.all([
        Product.distinct("category"),
        Product.distinct("brand"),
      ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Product filters fetched successfully",
        {
          categories,
          brands,
        },
      ),
    );
  },
);

// ====================
// Delete Product
// ====================

export const deleteProduct = asyncHandler(
  async (req, res) => {
    const { productId } = req.params;

    // ====================
    // Validate Product ID
    // ====================

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(
        400,
        "Invalid product ID",
      );
    }

    // ====================
    // Find Product
    // ====================

    const product = await Product.findById(
      productId,
    );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
      );
    }

    // ====================
    // Delete Cloudinary Images
    // ====================

    if (product.productImg?.length) {
      await Promise.allSettled(
        product.productImg.map((image) =>
          cloudinary.uploader.destroy(
            image.public_id,
          ),
        ),
      );
    }

    // ====================
    // Delete Product
    // ====================

    await Product.findByIdAndDelete(productId);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Product deleted successfully",
      ),
    );
  },
);

// ====================
// Update Product
// ====================

export const updateProduct = asyncHandler(
  async (req, res) => {
    const { productId } = req.params;

    // ====================
    // Validate Product ID
    // ====================

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(
        400,
        "Invalid product ID",
      );
    }

    // ====================
    // Find Product
    // ====================

    const product = await Product.findById(
      productId,
    );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
      );
    }

    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;

    // ====================
    // Existing Images
    // ====================

    let updatedImages = [
      ...product.productImg,
    ];

    let imagesToDelete = [];

    if (existingImages !== undefined) {
      let keepIds;

      try {
        keepIds = JSON.parse(existingImages);
      } catch {
        throw new ApiError(
          400,
          "Invalid existingImages format",
        );
      }

      if (!Array.isArray(keepIds)) {
        throw new ApiError(
          400,
          "existingImages must be an array",
        );
      }

      updatedImages =
        product.productImg.filter((image) =>
          keepIds.includes(image.public_id),
        );

      imagesToDelete =
        product.productImg.filter(
          (image) =>
            !keepIds.includes(image.public_id),
        );
    }

    // ====================
    // Upload New Images
    // ====================

    const newlyUploadedImages = [];

    try {
      if (req.files?.length) {
        for (const file of req.files) {
          const fileUri = getDataUri(file);

          const result =
            await cloudinary.uploader.upload(
              fileUri,
              {
                folder: "mern_products",
              },
            );

          newlyUploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }

      updatedImages.push(
        ...newlyUploadedImages,
      );

      // ====================
      // Update Product Fields
      // ====================

      product.productName =
        productName ?? product.productName;

      product.productDesc =
        productDesc ?? product.productDesc;

      product.productPrice =
        productPrice ?? product.productPrice;

      product.category =
        category ?? product.category;

      product.brand =
        brand ?? product.brand;

      product.productImg = updatedImages;

      await product.save();
    } catch (error) {
      // ====================
      // Rollback New Images
      // ====================

      if (newlyUploadedImages.length > 0) {
        await Promise.allSettled(
          newlyUploadedImages.map((image) =>
            cloudinary.uploader.destroy(
              image.public_id,
            ),
          ),
        );
      }

      throw error;
    }

    // ====================
    // Delete Removed Images
    // ====================

    if (imagesToDelete.length > 0) {
      await Promise.allSettled(
        imagesToDelete.map((image) =>
          cloudinary.uploader.destroy(
            image.public_id,
          ),
        ),
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        "Product updated successfully",
        product,
      ),
    );
  },
);