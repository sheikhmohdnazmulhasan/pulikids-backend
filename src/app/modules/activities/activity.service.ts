import { JwtPayload } from "jsonwebtoken";
import { IActivity } from "./activity.interface";

async function createActivityIntoDb(user: JwtPayload, payload: Partial<IActivity>) {

    try {
        const data = { ...payload, createdBy: user._id };
        console.log(data);

    } catch (error) {
        return {
            statusCode: 500,
            success: false,
            message: "Internal Server Error",
            data: null
        };
    }
};

export const ActivityService = {
    createActivityIntoDb
}