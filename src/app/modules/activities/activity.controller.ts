import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import { ActivityService } from "./activity.service";
import sendResponse from "../../../utils/send_response";

const createActivity = catchAsync(async (req: Request, res: Response) => {
    const result = await ActivityService.createActivityIntoDb(req.user, req.body)

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

export const ActivityController = {
    createActivity
}