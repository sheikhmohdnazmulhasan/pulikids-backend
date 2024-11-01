import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";

const router = Router();

router.post('/crate-attendance',
    Auth([userRole.ADMIN, userRole.USER]),
    AttendanceController.createAttendance);

export const AttendanceRoutes = router;