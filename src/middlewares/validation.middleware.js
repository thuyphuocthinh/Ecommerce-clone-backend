import mongoose from "mongoose";

export const validateObjectId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }
    next();
  } catch (error) {
    console.log(">>> error in validating id", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
