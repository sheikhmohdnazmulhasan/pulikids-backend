import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import { AttendanceService } from "./attendance.service";
import sendResponse from "../../../utils/send_response";

/**
 * Controller to create a new attendance record in the database.
 * This function uses the `AttendanceService` to save a new attendance
 * based on the user and data provided in the request body.
 */
const createAttendance = catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.createAttendanceIntoDb(req.user, req.body);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Controller to retrieve all attendance records from the database.
 * Uses the `AttendanceService` to fetch all existing attendance records.
 */
const retrieveAllAttendances = catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.retrieveAllAttendancesFromDb();

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Controller to retrieve attendances based on a specific activity.
 * This function fetches attendance records related to the activity 
 * specified by `activityId` in the request parameters.
 */
const retrieveActivityBasedAttendances = catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.retrieveActivityBasedAttendancesFromDb(req.params.activityId);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Exporting all controller functions as `AttendanceController` for easy access in other modules.
 */
export const AttendanceController = {
    createAttendance,
    retrieveAllAttendances,
    retrieveActivityBasedAttendances
};
