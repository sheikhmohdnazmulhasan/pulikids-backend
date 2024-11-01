import { JwtPayload } from "jsonwebtoken";
import { IActivity } from "./activity.interface";
import Activity from "./activity.model";
import { StatusCodes } from "http-status-codes";
import { userRole } from "../../constants/constant.user.role";
import { Attendance } from "../attendances/attendance.model";
import mongoose from "mongoose";
import User from "../users/user.model";

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
        // Log any unexpected errors and return an internal server error response
        // console.error(error); // Added logging for error visibility
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null
        };
    }
};

//  Retrieves all activities from the database, including details of the user who created each activity.
async function retrieveAllActivitiesFromDb() {
    try {
        // Fetch all activities from the database and populate the 'createdBy' field with user details
        const result = await Activity.find().populate({
            path: 'createdBy', // Field to populate
            select: '_id firstName lastName email' // Fields to select from the populated document
        }).lean(); // Use lean() to return plain JavaScript objects

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
};

//  Retrieves a single activity from the database by its ID, including details of the user who created it.
async function retrieveSingleActivityFromDb(activityId: string) {
    try {
        // Fetch the activity by ID and populate the 'createdBy' field with user details
        const result = await Activity.findById(activityId).populate({
            path: 'createdBy', // Field to populate
            select: '_id firstName lastName email' // Fields to select from the populated document
        }).lean(); // Use lean() to return a plain JavaScript object

        // If the activity is not found, return a not found response
        if (!result) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: true,
                message: "No activity found with the given ID",
                data: null
            };
        }

        // Return a success response with the retrieved activity
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Activity retrieved successfully",
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
};

/**
 * Updates an activity in the database if the user is authorized.
 *
 * @param activityId - The ID of the activity to update.
 * @param user - The user making the update request, including their role and ID.
 * @param payload - The fields to update in the activity.
 * @returns A response object indicating the result of the update operation.
 */
async function updateActivityFromDb(activityId: string, user: JwtPayload, payload: Partial<IActivity>) {
    try {
        // Retrieve the activity by its ID
        const activity = await Activity.findById(activityId).lean();

        // Log activity and user IDs for debugging
        // console.log({ activity: String(activity?.createdBy), user: user._id });

        // Check if the activity exists
        if (!activity) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "No activity found with the given ID",
                data: null
            };
        }

        // Ensure only admins or the creator can update the activity
        if (user.role !== userRole.ADMIN && String(activity.createdBy) !== String(user._id)) {
            return {
                statusCode: StatusCodes.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access: As a general user, you can only update your own activity.",
                data: null
            };
        }

        // Update the activity with new data and return the updated document
        const result = await Activity.findByIdAndUpdate(activityId, payload, { new: true });

        // If the update fails, return a bad request response
        if (!result) {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Something went wrong",
                data: null
            };
        }

        // Return a success response with the updated activity data
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Activity updated successfully",
            data: result
        };

    } catch (error) {
        // Handle any unexpected errors with a standard internal server error response
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null
        };
    }
};

// delete activity and corresponding attendances
async function deleteActivityFromDb(user: JwtPayload, activityId: string) {
    // Start a new MongoDB session for transaction management
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the activity by ID within the current session
        const activity = await Activity.findById(activityId).session(session);

        // If activity does not exist, abort the transaction and return a not-found response
        if (!activity) {
            await session.abortTransaction();
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Activity not found: No record matches the provided ID.",
                data: null
            };
        }

        // Check if user has permission to delete the activity (must be an admin or the creator)
        if (user.role !== userRole.ADMIN && String(activity.createdBy) !== String(user._id)) {
            await session.abortTransaction();
            return {
                statusCode: StatusCodes.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access: Only administrators or creators can delete this activity.",
                data: null
            };
        }

        // Attempt to delete the activity from the database
        const deleteActivity = await Activity.findByIdAndDelete(activityId).session(session);

        // If activity deletion fails, abort the transaction and return a failure response
        if (!deleteActivity) {
            await session.abortTransaction();
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Activity deletion failed: Unable to remove the activity. Please try again.",
                data: null
            };
        }

        // Attempt to delete all corresponding attendance records linked to the activity
        const deleteCorrespondingAttendance = await Attendance.deleteMany({ activityId }).session(session);

        // If deleting attendances fails, abort the transaction and return a failure response
        if (!deleteCorrespondingAttendance) {
            await session.abortTransaction();
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Attendance deletion failed: Unable to remove corresponding attendance records. Please try again.",
                data: null
            };
        }

        // Commit the transaction if all deletions are successful
        await session.commitTransaction();

        // Return success response after successfully deleting activity and attendances
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Activity and associated attendance records successfully deleted.",
            data: null
        };

    } catch (error) {
        // In case of an error, abort the transaction and return an internal server error response
        await session.abortTransaction();
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "An error occurred during the deletion process. Please try again later.",
            data: null
        };

    } finally {
        // End the session regardless of success or failure
        session.endSession();
    }
};

async function getReportFromDb() {
    try {
        const usersReport = await User.aggregate([
            {
                $lookup: {
                    from: 'activities',
                    localField: '_id',
                    foreignField: 'createdBy',
                    as: 'activities'
                }
            },
            {
                $lookup: {
                    from: 'attendances',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'attendances'
                }
            },
            {
                $lookup: {
                    from: 'attendances',
                    localField: 'activities._id',
                    foreignField: 'activityId',
                    as: 'activityAttendances'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'activityAttendances.userId',
                    foreignField: '_id',
                    as: 'activityAttendances.attendees'
                }
            },
            {
                $addFields: {
                    activityCount: { $cond: { if: { $isArray: "$activities" }, then: { $size: "$activities" }, else: 0 } },
                    attendanceCount: { $cond: { if: { $isArray: "$attendances" }, then: { $size: "$attendances" }, else: 0 } }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    activityCount: 1,
                    attendanceCount: 1,
                    activities: {
                        _id: 1,
                        name: 1,
                        attendanceCount: { $cond: { if: { $isArray: "$activityAttendances" }, then: { $size: "$activityAttendances" }, else: 0 } },
                        attendees: "$activityAttendances.attendees"
                    }
                }
            }
        ]);

        if (!usersReport.length) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "No users found for report generation",
                data: null
            };
        };

        return {
            statusCode: StatusCodes.NOT_FOUND,
            success: true,
            message: "User activity report generated successfully",
            data: usersReport
        };

    } catch (error) {

        console.log(error);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: true,
            message: "Internal server error",
            data: null
        };
    }
}


export const ActivityService = {
    createActivityIntoDb,
    retrieveAllActivitiesFromDb,
    retrieveSingleActivityFromDb,
    updateActivityFromDb,
    deleteActivityFromDb,
    getReportFromDb
}