import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import { ActivityService } from "./activity.service";
import sendResponse from "../../../utils/send_response";

/**
 * Controller to create a new activity in the database.
 * This function uses the `ActivityService` to save a new activity 
 * based on the data provided in the request body.
 */
const createActivity = catchAsync(async (req: Request, res: Response) => {
    const result = await ActivityService.createActivityIntoDb(req.user, req.body);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Controller to retrieve all activities from the database.
 * Uses the `ActivityService` to fetch all existing activities.
 */
const retrieveAllActivities = catchAsync(async (req: Request, res: Response) => {
    const result = await ActivityService.retrieveAllActivitiesFromDb();

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Controller to retrieve a single activity by ID.
 * It retrieves the activity based on the `activityId` provided in the request params.
 */
const retrieveSingleActivity = catchAsync(async (req: Request, res: Response) => {
    const result = await ActivityService.retrieveSingleActivityFromDb(req.params.activityId);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Controller to update an existing activity.
 * It updates the activity with the given `activityId` and data provided in the request body.
 */
const updateActivity = catchAsync(async (req: Request, res: Response) => {
    const result = await ActivityService.updateActivityFromDb(req.params.activityId, req.user, req.body);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Controller to delete an activity by ID.
 * This function removes an activity specified by `activityId` in the request params.
 */
const deleteActivity = catchAsync(async (req: Request, res: Response) => {
    const result = await ActivityService.deleteActivityFromDb(req.user, req.params.activityId);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Controller to retrieve a report on activities.
 * Uses `ActivityService` to get a summary or report of the activities.
 */
const getReport = catchAsync(async (req: Request, res: Response) => {
    const result = await ActivityService.getReportFromDb();

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

/**
 * Exporting all controller functions as `ActivityController` for easy access in other modules.
 */
export const ActivityController = {
    createActivity,
    retrieveAllActivities,
    retrieveSingleActivity,
    updateActivity,
    deleteActivity,
    getReport
};
