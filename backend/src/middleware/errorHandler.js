import ApiError from "../utils/ApiError.js";

export const errorHandler = (error, req, res, next) => {
  // ====================
  // ApiError
  // ====================

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.errors?.length > 0 && {
        errors: error.errors,
      }),
    });
  }

  // ====================
  // Unexpected Error
  // ====================

  console.error("Unhandled Error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};