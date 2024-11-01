import { Router } from "express";
import { ActivityController } from "./activity.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";

const router = Router();

router.post('/create-activity', Auth([userRole.ADMIN, userRole.USER]), ActivityController.createActivity);

export const ActivityRouters = router;