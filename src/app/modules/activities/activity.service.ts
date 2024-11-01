import { JwtPayload } from "jsonwebtoken";
import { IActivity } from "./activity.interface";
import Activity from "./activity.model";
import { StatusCodes } from "http-status-codes";

async function createActivityIntoDb(user: JwtPayload, payload: Partial<IActivity>) {

    try {
        const data = { ...payload, createdBy: user._id };
        const insertResult = await Activity.create(data);

        if (insertResult) {
            return {
                statusCode: StatusCodes.CREATED,
                success: true,
                message: 'Activity successfully created',
                data: insertResult
            };
        } else {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Something went wrong. Please try again!",
                data: null
            };
        }

    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null
        };
    }
};

export const ActivityService = {
    createActivityIntoDb
}