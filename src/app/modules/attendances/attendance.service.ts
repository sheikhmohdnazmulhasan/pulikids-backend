import { IAttendance } from "./attendance.interface";
import { StatusCodes } from "http-status-codes";
import { Attendance } from "./attendance.model";
import { JwtPayload } from "jsonwebtoken";

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
        const data = { ...payload, userId: user._id };

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
}


export const AttendanceService = {
    createAttendanceIntoDb
}
