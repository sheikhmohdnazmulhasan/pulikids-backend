import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import sendResponse from "../../../utils/send_response";
import { UserService } from "./user.service";
import { IUser } from "./user.interface";

const createUser = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createUserIntoDb(req.body as IUser);

    console.log('service result ', result);

    sendResponse(res, {
        data: 'ddd',
        message: 'ddd',
        statusCode: 200,
        success: true
    })

    // res.status(200).json({
    //     ss: "ssss"
    // })


});

export const UserController = {
    createUser
}