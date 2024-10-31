import { Router } from "express";
import { UserController } from "./users.controller";
import ValidationRequest from "../../middlewares/zod_validation";
import { UserValidation } from "./user.validation";

const router = Router();

router.post('/register', ValidationRequest(UserValidation.createUserValidation), UserController.createUser);
router.post('/login', ValidationRequest(UserValidation.loginUserValidation), UserController.loginUser);
router.patch('/password-reset-request', UserController.requestPasswordReset);

export const UserRoutes = router;