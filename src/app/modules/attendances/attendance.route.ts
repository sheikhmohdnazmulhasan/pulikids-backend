import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";
import ValidationRequest from "../../middlewares/zod_validation";
import { AttendanceValidation } from "./attendance.validation";

const router = Router();

// Route to create attendance (ADMIN, USER roles)
router.post('/create-attendance',
    Auth([userRole.ADMIN, userRole.USER]),
    ValidationRequest(AttendanceValidation.createAttendanceValidationSchema),
    AttendanceController.createAttendance
);

// Route to retrieve all attendances (ADMIN role only)
router.get('/',
    Auth([userRole.ADMIN]),
    AttendanceController.retrieveAllAttendances
);

// Route to retrieve attendances for a specific activity (ADMIN role only)
router.get('/:activityId',
    Auth([userRole.ADMIN]),
    AttendanceController.retrieveActivityBasedAttendances
);

export const AttendanceRoutes = router;
