import { Router } from "express";
import { ActivityController } from "./activity.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";
import ValidationRequest from "../../middlewares/zod_validation";
import { ActivityValidation } from "./activity.validation";

const router = Router();

// Route for creating a new activity (ADMIN, USER roles)
router.post('/create-activity',
    Auth([userRole.ADMIN, userRole.USER]),
    ValidationRequest(ActivityValidation.createActivityValidationSchema),
    ActivityController.createActivity
);

// Route for updating an activity by ID (ADMIN, USER roles)
router.put('/:activityId',
    Auth([userRole.ADMIN, userRole.USER]),
    ValidationRequest(ActivityValidation.updateActivityValidationSchema),
    ActivityController.updateActivity
);

// Route for deleting an activity by ID (ADMIN, USER roles)
router.delete('/:activityId',
    Auth([userRole.ADMIN, userRole.USER]),
    ActivityController.deleteActivity
);

// Route for generating activity report (ADMIN role only)
router.get('/report',
    Auth([userRole.ADMIN]),
    ActivityController.getReport
);

// Routes for retrieving activities
router.get('/', ActivityController.retrieveAllActivities); // All activities
router.get('/:activityId', ActivityController.retrieveSingleActivity); // Single activity by ID

export const ActivityRouters = router;
