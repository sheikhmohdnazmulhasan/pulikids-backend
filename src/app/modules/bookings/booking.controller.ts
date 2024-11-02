import { Request, Response } from "express";
import catchAsync from "../../../utils/catch_async";
import { BookingService } from "./booking.service";
import sendResponse from "../../../utils/send_response";

// Controller to create a booking
const createBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.createBookingIntoDb(req.user, req.body);
    sendResponse(res, result);
});

// Controller to retrieve all bookings for the current user
const retrieveAllBookings = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.retrieveAllBookingsFromDb(req.user);
    sendResponse(res, result);
});

// Controller to retrieve a specific booking by ID
const retrieveSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.retrieveSingleBookingFromDb(req.params.bookingId);
    sendResponse(res, result);
});

// Controller to retrieve all bookings for a specific user
const retrieveUserBookings = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.retrieveUserBookingsFromDb(req.params.userId);
    sendResponse(res, result);
});

// Controller to update booking status
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.updateBookingStatusIntoDb(req.params.bookingId, req.body);
    sendResponse(res, result);
});

// Controller to delete a booking by ID
const deleteBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.deleteBookingFromDb(req.params.bookingId);
    sendResponse(res, result);
});

export const BookingController = {
    createBooking,
    retrieveAllBookings,
    retrieveSingleBooking,
    retrieveUserBookings,
    updateBookingStatus,
    deleteBooking
};
