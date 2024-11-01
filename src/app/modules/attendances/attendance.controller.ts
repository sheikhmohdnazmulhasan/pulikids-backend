import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import { AttendanceService } from "./attendance.service";
import sendResponse from "../../../utils/send_response";

const createAttendance = catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.createAttendanceIntoDb(req.user, req.body)

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const retrieveAllAttendances = catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.retrieveAllAttendancesFromDb();

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const retrieveActivityBasedAttendances = catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.retrieveActivityBasedAttendancesFromDb(req.params.activityId);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});


export const AttendanceController = {
    createAttendance,
    retrieveAllAttendances,
    retrieveActivityBasedAttendances
}