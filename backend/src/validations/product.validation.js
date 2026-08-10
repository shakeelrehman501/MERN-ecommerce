import { z } from "zod";

// ====================
// Add Product
// ====================

export const addProductSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(3, "Product name must be at least 2 words")
    .max(400, "Product name cannot exceed 100 characters")
    .refine(
      (value) => value.split(/\s+/).length >= 2,
      "Product name must contain at least 2 words",
    ),

  productDesc: z
    .string()
    .trim()
    .min(10, "Product description must be at least 10 characters")
    .max(10000, "Product description cannot exceed 1000 characters"),

  productPrice: z.coerce
    .number({
      invalid_type_error: "Product price must be a number",
    })
    .positive("Product price must be greater than 0"),

  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category cannot exceed 50 characters"),
    // .regex(
    //   /^[A-Za-z]+$/,
    //   "Category must contain only one word",
    // ),

  brand: z
    .string()
    .trim()
    .min(2, "Brand must be at least 2 characters")
    .max(50, "Brand cannot exceed 50 characters"),
});

// ====================
// Update Product
// ====================

export const updateProductSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters")
    .optional(),

  productDesc: z
    .string()
    .trim()
    .min(10, "Product description must be at least 10 characters")
    .max(1000, "Product description cannot exceed 1000 characters")
    .optional(),

  productPrice: z.coerce
    .number({
      invalid_type_error: "Product price must be a number",
    })
    .positive("Product price must be greater than 0")
    .optional(),

  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category cannot exceed 50 characters")
    .optional(),

  brand: z
    .string()
    .trim()
    .min(2, "Brand must be at least 2 characters")
    .max(50, "Brand cannot exceed 50 characters")
    .optional(),

  existingImages: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;

        try {
          const parsed = JSON.parse(value);

          return (
            Array.isArray(parsed) &&
            parsed.every((id) => typeof id === "string")
          );
        } catch {
          return false;
        }
      },
      {
        message: "existingImages must be a valid JSON array",
      },
    ),
});