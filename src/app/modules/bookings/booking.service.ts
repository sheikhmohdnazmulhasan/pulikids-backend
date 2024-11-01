import { StatusCodes } from "http-status-codes";
import { IBooking } from "./booking.interface";
import Booking from "./booking.model";
import { JwtPayload } from "jsonwebtoken";

async function createBookingIntoDb(user: JwtPayload, newBooking: Partial<IBooking>) {
    try {
        // Check for existing bookings by the same user on the same date with status Pending or Confirmed
        const userConflict = await Booking.findOne({
            userId: user._id,
            bookingDate: newBooking.bookingDate,
            status: { $in: ['pending', 'confirmed'] },
        });

        if (userConflict) {
            return {
                statusCode: StatusCodes.CONFLICT,
                success: false,
                message: "You already have a booking scheduled for this date.",
                data: null,
            };
        }

        // Check for conflicts with confirmed bookings for the same activity
        const activityConflict = await Booking.findOne({
            activityId: newBooking.activityId,
            bookingDate: newBooking.bookingDate,
            status: 'confirmed', // Only check against confirmed bookings
        });

        if (activityConflict) {
            return {
                statusCode: StatusCodes.CONFLICT,
                success: false,
                message: "This activity is fully booked on the selected date. Please choose another date.",
                data: null,
            };
        }

        // If no conflicts, create and save the new booking
        const booking = new Booking({ ...newBooking, userId: user._id });
        await booking.save();

        // Populate fields for user and activity details
        const populatedBooking = await booking.populate([
            {
                path: 'userId',
                select: '_id firstName lastName email'
            }, // Populate user details
            {
                path: 'activityId',
                select: '_id name description location'
            } // Populate activity details
        ])

        return {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "Your booking has been successfully created.",
            data: populatedBooking,
        };

    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Something went wrong. Please try again later.",
            data: null,
        };
    }
};

export const BookingService = {
    createBookingIntoDb
}
