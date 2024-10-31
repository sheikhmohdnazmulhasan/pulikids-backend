import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import sendResponse from "../../../utils/send_response";

const createUser = catchAsync(async (req: Request, res: Response) => {

});

export const UserController = {
    createUser
}