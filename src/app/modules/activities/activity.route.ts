import { Router } from "express";
import { ActivityController } from "./activity.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";
import ValidationRequest from "../../middlewares/zod_validation";
import { ActivityValidation } from "./activity.validation";

const router = Router();

router.post('/create-activity',
    Auth([userRole.ADMIN, userRole.USER]),
    ValidationRequest(ActivityValidation.createActivityValidationSchema),
    ActivityController.createActivity);

export const ActivityRouters = router;