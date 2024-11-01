import { JwtPayload } from "jsonwebtoken";
import { IActivity } from "./activity.interface";
import Activity from "./activity.model";
import { StatusCodes } from "http-status-codes";

/**
 * @param user - The authenticated user's JWT payload containing user information.
 * @param payload - Partial activity information to be stored in the database.
 * @returns A response object indicating the result of the operation.
 */

//  Creates a new activity entry in the database.
async function createActivityIntoDb(user: JwtPayload, payload: Partial<IActivity>) {

    try {
        // Prepare the data for insertion, including the ID of the user who created the activity
        const data = { ...payload, createdBy: user._id };

        // Attempt to create a new activity entry in the database
        const insertResult = await Activity.create(data);

        // If the insertion was successful, return a success response
        if (insertResult) {
            return {
                statusCode: StatusCodes.CREATED,
                success: true,
                message: 'Activity successfully created',
                data: insertResult
            };
        } else {
            // If insertion failed, return a failure response
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Something went wrong. Please try again!",
                data: null
            };
        }

    } catch (error) {
        // Handle any unexpected errors and return an internal server error response
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null
        };
    }
};

//  Retrieves all activities from the database.
async function retrieveAllActivitiesFromDb() {
    try {
        // Fetch all activities from the database, returning plain JavaScript objects
        const result = await Activity.find().lean();

        // If no activities are found, return a not found response
        if (!result.length) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: true,
                message: "No activities available",
                data: null
            };
        }

        // Return a success response with the retrieved activities
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Activities retrieved successfully",
            data: result
        };

    } catch (error) {
        // Handle any unexpected errors and return an internal server error response
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null
        };
    }
}



export const ActivityService = {
    createActivityIntoDb,
    retrieveAllActivitiesFromDb
}