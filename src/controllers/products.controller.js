import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config.js";
import { redis } from "../config/redis.config.js";
import Product from "../models/products.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      success: true,
      message: "Get all products success",
      products,
    });
  } catch (error) {
    console.log(">>> error in getting products: ", error.message);
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // if in redis
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.status(200).json({
        success: true,
        message: "Getting featured products success",
        products: JSON.parse(featuredProducts),
      });
    }

    // if not in redis
    // .lean() => is gonna return a plain JS object instead of a mongodb document
    // which is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    // store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    return res.status(200).json({
      success: true,
      message: "Getting featured products success",
      products: featuredProducts,
    });
  } catch (error) {
    console.log(">>> error in getting featured products: ", error.message);
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Created product successfully",
      product: product,
    });
  } catch (error) {
    console.log(">>> error in creating product: ", error.message);
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("delete image from cloudinary");
      } catch (error) {
        console.log("Error deleting image from cloudinary: ", error);
      }
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Deleted product successfully",
    });
  } catch (error) {
    console.log(">>> error in deleting product: ", error.message);
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Success",
      products,
    });
  } catch (error) {
    console.log(">>> error in getting recommended products: ", error.message);
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).lean();
    return res.status(200).json({
      success: true,
      message: "Success",
      products,
    });
  } catch (error) {
    console.log(">>> error in creating products: ", error.message);
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      // save => up-sert
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      return res.status(200).json({
        success: true,
        message: "Success",
        product: updatedProduct,
      });
    }
    return res.status(400).json({
      success: false,
      message: "No product found",
    });
  } catch (error) {
    console.log(">>> error in toggling featured product: ", error.message);
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};

const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(
      ">>> error in updaing featured products cache: ",
      error.message
    );
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
};
