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
    const result = await BookingService.retrieveAllBookingsFromDb(req.user);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const retrieveSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.retrieveSingleBookingFromDb(req.params.bookingId);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const retrieveUserBookings = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.retrieveUserBookingsFromDb(req.params.userId);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.updateBookingStatusIntoDb(req.params.bookingId, req.body);

    sendResponse(res, {
        statusCode: result.statusCode,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.deleteBookingFromDb(req.params.bookingId);

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
    retrieveSingleBooking,
    retrieveUserBookings,
    updateBookingStatus,
    deleteBooking
}