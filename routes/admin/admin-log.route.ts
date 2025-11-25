import { Router } from "express";
import * as adminLogController from "../../controllers/admin/admin-log.controller";
import { checkPermission } from "../../middlewares/admin/authenticate.middleware";

const router = Router();

router.get('/list', 
  checkPermission("log-activity-list"),
  adminLogController.list
);

export default router;