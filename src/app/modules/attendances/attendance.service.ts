import { IAttendance } from "./attendance.interface";
import { StatusCodes } from "http-status-codes";
import { Attendance } from "./attendance.model";

async function createAttendanceIntoDb(payload: IAttendance) {
    try {
        const insertResult = await Attendance.create(payload);

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
