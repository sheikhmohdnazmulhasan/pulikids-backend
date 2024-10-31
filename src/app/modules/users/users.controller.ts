import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import sendResponse from "../../../utils/send_response";
import { UserService } from "./user.service";
import { IUser } from "./user.interface";

const createUser = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createUserIntoDb(req.body as IUser);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });

});

const loginUser = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.loginUserFromClerk(req.body);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });

});

const requestPasswordReset = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.requestPasswordResetService(req.body.email);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

export const UserController = {
    createUser,
    loginUser,
    requestPasswordReset
};