import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    adminId: String,
    // lưu phương thức người dùng đã thực hiện (GET, POST, PUT, DELETE, ...)
    method: String,
    // lưu đường dẫn người dùng đã truy cập
    route: String,
    title: String,
    // xác định thời gian hết hạn của bản ghi này
    expireAt: {
      type: Date,
      expires: 0
    }
  },
  {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
  }
);

const AdminLog = mongoose.model('AdminLog', schema, "admin-logs");

export default AdminLog;