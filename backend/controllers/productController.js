import { json } from "express";
import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //Handle multiple image uploads
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products", // cloudinary folder name
        });
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    //create new product
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg, //array of objects [{url, public_id}, {url, public_id}]
    });

    return res.status(200).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
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

    // Filters
    const filter = {};

    // Search
    if (search.trim()) {
      filter.productName = {
        $regex: search,
        $options: "i",
      };
    }

    // Category
    if (category !== "All") {
      filter.category = category;
    }

    // Brand
    if (brand !== "All") {
      filter.brand = brand;
    }

    // Price
    filter.productPrice = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "lowToHigh":
        sortOption.productPrice = 1;
        break;

      case "highToLow":
        sortOption.productPrice = -1;
        break;

      default:
        sortOption.createdAt = -1;
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      totalProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductFilters = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    const brands = await Product.distinct("brand");

    return res.status(200).json({
      success: true,
      categories,
      brands,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    // Delete images from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }
    // Delete product from MongoDB
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = [];
    //keep selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );
      // delete only removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );
      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImg; // keep all of nothing sent
    }

    //upload new images if any
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          foler: "mern_products",
        });
        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // update product
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  export const loggedOut = async (req, res) => {
//    try {
//     return res.status(400).json({
//       success: false,
//       message: "User not found",
//     });
//      return res.status(200).json({
//        success: true,
//        message: "User loggedOut successfully",
//      });
//    } catch (error) {
//      return res.status(500).json({
//        success: false,
//        message: error.message,
//      });
//    }
//  };
