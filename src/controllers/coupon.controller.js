import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      message: "success",
      coupon,
    });
  } catch (error) {
    console.log(">>> error in getting coupon: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      userId: req.user._id,
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Coupond not found",
      });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({
        success: false,
        message: "Coupond is expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log(">>> error in validating coupon: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
