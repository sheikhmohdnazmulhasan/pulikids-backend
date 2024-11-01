import { IAttendance } from "./attendance.interface";
import { StatusCodes } from "http-status-codes";
import { Attendance } from "./attendance.model";
import { JwtPayload } from "jsonwebtoken";
import { userRole } from "../../constants/constant.user.role";

/**
 * @param user - The authenticated user's JWT payload containing user information.
 * @param payload - Partial attendance information, including activityId.
 * @returns A response object indicating the result of the operation.
 */

//  Creates attendance entry in the database for a user.
async function createAttendanceIntoDb(user: JwtPayload, payload: Partial<IAttendance>) {
    try {
        // Check if attendance for the activity already exists for the user
        const isExist = await Attendance.findOne({
            activityId: payload.activityId,
            userId: user._id
        });

        // If attendance already recorded, return an error response
        if (isExist) {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Attendance already recorded: each user can only register attendance once per activity.",
                data: null,
            };
        }

        // Prepare the data for insertion, including user ID
        const data = {
            ...payload,
            userId: user.role === userRole.ADMIN && payload.userId ? payload.userId : user._id
        };

        // Create a new attendance entry in the database
        const insertResult = await Attendance.create(data);

        // If insertion was successful, return a success response
        if (insertResult) {
            return {
                statusCode: StatusCodes.CREATED,
                success: true,
                message: "Attendance created successfully",
                data: insertResult,
            };
        } else {
            // If insertion failed, return a failure response
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Something went wrong. Please try again",
                data: null,
            };
        }

    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null,
        };
    }
};

//  Retrieves all attendance records from the database, populating associated activity and user details.
async function retrieveAllAttendancesFromDb() {
    try {
        // Fetch all attendance records, populating activity and user details
        const result = await Attendance.find()
            .populate({
                path: 'activityId',
                select: '_id name description date startTime endTime location createdBy',
                populate: {
                    path: 'createdBy',
                    select: '_id firstName lastName email'
                }
            })
            .populate({
                path: 'userId',
                select: '_id firstName lastName email'
            })
            .lean(); // Using lean() for a plain JavaScript object

        // Check if there are no attendance records
        if (!result.length) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "No attendances available",
                data: null,
            };
        }

        // Successfully retrieved attendance records
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Attendances retrieved successfully",
            data: result,
        };

    } catch (error) {
        // Log the error for debugging
        // console.error("Error retrieving attendances:", error);

        // Handle unexpected errors with a generic response
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null,
        };
    }
};

//  Retrieves attendance records from the database based on a specific activity ID.
async function retrieveActivityBasedAttendancesFromDb(activityId: string) {
    try {
        // Retrieve all attendance records associated with the specified activityId
        const result = await Attendance.find({ activityId })
            .populate({
                path: 'activityId',
                select: '_id name description date startTime endTime location createdBy',
                populate: {
                    path: 'createdBy',
                    select: '_id firstName lastName email'
                }
            })
            .populate({
                path: 'userId',
                select: '_id firstName lastName email'
            })
            .lean();

        // Check if there are no attendance records for the specified activity
        if (!result.length) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "No attendances available for the specified activity",
                data: null,
            };
        }

        // Successfully retrieved attendance records
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Activity-based attendances retrieved successfully",
            data: result,
        };

    } catch (error) {
        // Log the error for debugging
        // console.error("Error retrieving activity-based attendances:", error);

        // Return an internal server error response
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null,
        };
    }
};


export const AttendanceService = {
    createAttendanceIntoDb,
    retrieveAllAttendancesFromDb,
    retrieveActivityBasedAttendancesFromDb
}
