import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";
import ValidationRequest from "../../middlewares/zod_validation";
import { AttendanceValidation } from "./attendance.validation";

const router = Router();

router.post('/crate-attendance',
    Auth([userRole.ADMIN, userRole.USER]),
    ValidationRequest(AttendanceValidation.createAttendanceValidationSchema),
    AttendanceController.createAttendance);

export const AttendanceRoutes = router;