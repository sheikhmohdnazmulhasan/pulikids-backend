import { Router } from "express";
import { UserController } from "./users.controller";
import ValidationRequest from "../../middlewares/zod_validation";
import { UserValidation } from "./user.validation";

const router = Router();

router.post('/register', ValidationRequest(UserValidation.createUserValidation), UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/recovery', UserController.resetPassword);

export const UserRoutes = router;