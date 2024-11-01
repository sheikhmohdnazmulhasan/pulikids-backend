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

router.put('/:activityId',
    Auth([userRole.ADMIN, userRole.USER]),
    ValidationRequest(ActivityValidation.updateActivityValidationSchema),
    ActivityController.updateActivity);

router.delete('/:activityId',
    Auth([userRole.ADMIN, userRole.USER]),
    // ValidationRequest(ActivityValidation.updateActivityValidationSchema),
    ActivityController.deleteActivity);

router.get('/report',
    Auth([userRole.ADMIN]),
    // ValidationRequest(ActivityValidation.createActivityValidationSchema),
    ActivityController.getReport);

router.get('/',
    // Auth([userRole.ADMIN, userRole.USER]),
    // ValidationRequest(ActivityValidation.createActivityValidationSchema),
    ActivityController.retrieveAllActivities);

router.get('/:activityId',
    // Auth([userRole.ADMIN, userRole.USER]),
    // ValidationRequest(ActivityValidation.createActivityValidationSchema),
    ActivityController.retrieveSingleActivity);

export const ActivityRouters = router;