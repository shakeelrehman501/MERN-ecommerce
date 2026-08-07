import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "First name must be at least 3 characters")
    .max(30, "First name cannot exceed 30 characters")
    .regex(/^[A-Za-z\s'-]+$/, "First name can only contain letters")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(3, "Last name must be at least 3 characters")
    .max(30, "Last name cannot exceed 30 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Last name can only contain letters")
    .optional(),

  address: z
    .string()
    .trim()
    .max(200, "Address cannot exceed 200 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .max(50, "City cannot exceed 50 characters")
    .optional(),

  zipCode: z
    .string({
      required_error: "Zip Code is required",
    })
    .trim()
    .min(1, "Zip Code is required")
    .max(15, "Zip Code cannot exceed 15 characters"),

  phoneNo: z
    .string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Invalid phone number")
    .optional(),

  role: z.enum(["user", "admin"]).optional(),
});
