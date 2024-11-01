import { IAttendance } from "./attendance.interface";
import { StatusCodes } from "http-status-codes";
import { Attendance } from "./attendance.model";
import { JwtPayload } from "jsonwebtoken";

async function createAttendanceIntoDb(user: JwtPayload, payload: Partial<IAttendance>) {
    try {
        const isExist = await Attendance.findOne({
            activityId: payload.activityId,
            userId: user._id
        });

        if (isExist) {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Attendance already recorded: each user can only register attendance once per activity.",
                data: null,
            };
        }

        const data = { ...payload, userId: user._id }
        const insertResult = await Attendance.create(data);

        if (insertResult) {
            return {
                statusCode: StatusCodes.CREATED,
                success: true,
                message: "attendance created successfully",
                data: insertResult,
            };

        } else {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Something went wrong. Please try again",
                data: null,
            };
        };

    } catch (error) {
        console.log(error);
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal Server Error",
            data: null,
        };

    };
};

export const AttendanceService = {
    createAttendanceIntoDb
}
