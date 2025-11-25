import { Request } from "express";

// Mở rộng interface Request để thêm thuộc tính adminId

export interface RequestAccount extends Request {
  adminId?: string;
}