import { Request, Response } from 'express';
import { pathAdmin, permissionList } from '../../configs/variable.config';
import AdminLog from '../../models/admin-log.model';
import AccountAdmin from '../../models/account-admin.model';

export const list = async (req: Request, res: Response) => {
  // Phân trang
  const limitItems = 20;
  let page = 1;
  if (req.query.page && parseInt(`${req.query.page}`) > 0) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await AdminLog.countDocuments();
  const totalPage = Math.ceil(totalRecord / limitItems);
  const skip = (page - 1) * limitItems;
  const pagination = {
    totalRecord: totalRecord,
    totalPage: totalPage,
    currentPage: page,
    skip: skip
  };

  // Lấy danh sách log, sắp xếp theo thời gian mới nhất trước
  const recordList: any = await AdminLog
    .find()
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)
    .lean();

  // Lấy avatar và tên admin cho mỗi log (batch query)
  const adminIds = recordList
    .map((r: any) => r.adminId)
    .filter((id: any) => id && /^[0-9a-fA-F]{24}$/.test(id.toString())); // chỉ lấy ObjectId hợp lệ
  const adminMap: any = {};
  
  if (adminIds.length > 0) {
    const adminList = await AccountAdmin.find({ _id: { $in: adminIds } }).lean();
    adminList.forEach((admin: any) => {
      adminMap[admin._id.toString()] = admin;
    });
  }

  recordList.forEach((record: any) => {
    // Check if adminId matches SUPER_ADMIN_ID from env
    if (record.adminId === process.env.SUPER_ADMIN_ID) {
      // Trường hợp 1: SuperAdmin
      record.name = "SuperAdmin";
      record.avatarSuperAdmin = "/admin/assets/images/users/avatar-1.jpg";
    } else {
      const adminInfo = adminMap[record.adminId?.toString()];
      if (adminInfo) {
        // Trường hợp 2: Admin thường
        record.name = adminInfo.fullName;
        record.avatar = adminInfo.avatar;
      } else {
        // Trường hợp 3: Unknown user
        record.name = "N/A";
        record.avatarUnkhown = "/admin/assets/images/users/unknown-avatar.png";
      }
    }
  });

  // Format lại trường createAt
  recordList.forEach((record: any) => {
    const createdAt = new Date(record.createdAt);
    const day = String(createdAt.getDate()).padStart(2, '0');
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const year = createdAt.getFullYear();
    const hours = String(createdAt.getHours()).padStart(2, '0');
    const minutes = String(createdAt.getMinutes()).padStart(2, '0');
    record.formattedCreatedAt = `${day}/${month}/${year} ${hours}:${minutes}`;
  });

  res.render("admin/pages/admin-log", {
    pageTitle: "Danh sách hoạt động quản trị",
    recordList: recordList,
    pagination: pagination,
    pathAdmin: pathAdmin
  });
}