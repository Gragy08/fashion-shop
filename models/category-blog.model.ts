import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    parent: String,
    description: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    view: {
      type: Number,
      default: 0
    },
    deleted: {
      type: Boolean,
      default: false
    },
    search: String
  },
  {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
  }
);

const CategoryBlog = mongoose.model('CategoryBlog', schema, "categories-blog");

export default CategoryBlog;