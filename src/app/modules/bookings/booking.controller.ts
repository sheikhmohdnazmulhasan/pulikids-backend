import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import { BookingService } from "./booking.service";
import sendResponse from "../../../utils/send_response";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.createBookingIntoDb(req.user, req.body)

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const retrieveAllBookings = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.retrieveAllBookingsFromDb();

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const retrieveSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.retrieveSingleFromDb(req.params.bookingId);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

export const BookingController = {
    createBooking,
    retrieveAllBookings,
    retrieveSingleBooking
}