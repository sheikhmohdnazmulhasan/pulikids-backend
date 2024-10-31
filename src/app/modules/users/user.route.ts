import { Router } from "express";
import { UserController } from "./users.controller";
import ValidationRequest from "../../middlewares/zod_validation";
import { UserValidation } from "./user.validation";

const router = Router(); // Initialize Express router

// Route for user registration with validation middleware
router.post('/register', ValidationRequest(UserValidation.createUserValidation), UserController.createUser);

// Route for user login with validation middleware
router.post('/login', ValidationRequest(UserValidation.loginUserValidation), UserController.loginUser);

// Route for requesting a password reset, with validation middleware
router.patch('/password-reset-request', ValidationRequest(UserValidation.requestPasswordResetValidation), UserController.requestPasswordReset);

// Route for resetting the password after request, with validation middleware
router.patch('/reset-password', ValidationRequest(UserValidation.passwordResetValidation), UserController.resetPassword);

export const UserRoutes = router; // Export the configured router as UserRoutes
