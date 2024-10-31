import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async"; // Utility function to handle async errors
import sendResponse from "../../../utils/send_response"; // Utility function to send a formatted response
import { UserService } from "./user.service";
import { IUser } from "./user.interface";

// Controller function for user registration
const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUserIntoDb(req.body as IUser); // Call the user service to handle user creation

    // Send response back to client
    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

// Controller function for user login
const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.loginUserFromClerk(req.body); // Call the user service to handle user login

    // Send response back to client
    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

// Controller function for requesting password reset
const requestPasswordReset = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.requestPasswordResetService(req.body.email); // Call the service to handle password reset request

    // Send response back to client
    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

// Controller function for resetting password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.resetPasswordService(req.body); // Call the service to handle password reset

    // Send response back to client
    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

// Export all controller functions as UserController
export const UserController = {
    createUser,
    loginUser,
    requestPasswordReset,
    resetPassword
};
