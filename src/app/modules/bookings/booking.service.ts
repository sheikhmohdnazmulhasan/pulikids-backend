import { StatusCodes } from "http-status-codes";
import { IBooking } from "./booking.interface";
import Booking from "./booking.model";
import { JwtPayload } from "jsonwebtoken";
import { userRole } from "../../constants/constant.user.role";

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

// Retrieve bookings with related activity and user details
async function retrieveAllBookingsFromDb(user: JwtPayload) {
    try {
        const result = await Booking.find(user.role === userRole.USER ? { userId: user._id } : {}).populate({
            path: 'activityId',
            select: 'name description location',
        }).populate({
            path: 'userId',
            select: 'firstName lastName email'
        });

        // Check if any bookings were found
        if (!result.length) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Booking Not Available",
                data: null,
            };
        }

        // Return successful response with booking data
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Bookings retrieved successfully",
            data: result,
        };

    } catch (error) {
        // Handle errors
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Something went wrong. Please try again later.",
            data: null,
        };
    }
};

// Retrieve single booking by _id with related activity and user details
async function retrieveSingleBookingFromDb(bookingId: string) {
    try {
        const result = await Booking.findById(bookingId).populate({
            path: 'activityId',
            select: 'name description location',
        }).populate({
            path: 'userId',
            select: 'firstName lastName email'
        });

        // Check if any bookings were found
        if (!result) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Booking Not Available",
                data: null,
            };
        }

        // Return successful response with booking data
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Booking retrieved successfully",
            data: result,
        };

    } catch (error) {
        // Handle errors
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Something went wrong. Please try again later.",
            data: null,
        };
    }
};

// Retrieve specific users booking by _id with related activity and user details
async function retrieveUserBookingsFromDb(userId: string) {
    try {
        const result = await Booking.find({ userId }).populate({
            path: 'activityId',
            select: 'name description location',
        }).populate({
            path: 'userId',
            select: 'firstName lastName email'
        });

        // Check if any bookings were found
        if (!result) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Booking Not Available",
                data: null,
            };
        }

        // Return successful response with booking data
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "User bookings retrieved successfully",
            data: result,
        };

    } catch (error) {
        // Handle errors
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Something went wrong. Please try again later.",
            data: null,
        };
    }
};

async function updateBookingStatusIntoDb(bookingId: string, payload: { status: 'confirmed' | 'canceled' }) {
    try {
        // Fetch the booking by its ID
        const booking = await Booking.findById(bookingId);

        // Check if the booking exists
        if (!booking) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Booking not found. Please check the booking ID and try again.",
                data: null,
            };
        };

        // Check if the booking status is not 'pending' to allow updates
        if (booking.status !== 'pending') {
            return {
                statusCode: StatusCodes.NOT_ACCEPTABLE,
                success: false,
                message: "Booking status cannot be updated as it is already confirmed or canceled.",
                data: null,
            };
        };

        // Update the booking status
        booking.status = payload.status;
        await booking.save();

        // Populate related activity and user information for the response
        const populatedBookingForResponse = await (await booking.populate({
            path: 'activityId',
            select: 'name description location',
        })).populate({
            path: 'userId',
            select: 'firstName lastName email'
        });

        // Return success response with updated booking details
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: `Booking status updated successfully to '${payload.status}'.`,
            data: populatedBookingForResponse,
        };

    } catch (error) {
        // Handle any unexpected errors
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "An unexpected error occurred while updating the booking status. Please try again later.",
            data: null,
        };
    }
};

async function deleteBookingFromDb(bookingId: string) {
    try {

        // Fetch the booking by its ID
        const booking = await Booking.findById(bookingId).lean();

        // Check if the booking exists
        if (!booking) {
            return {
                statusCode: StatusCodes.NOT_FOUND, // 404 error if booking not found
                success: false,
                message: "Booking not found. Please check the booking ID and try again.",
                data: null,
            };
        };

        // Attempt to delete the booking
        const result = await Booking.findByIdAndDelete(bookingId);

        // Check if the deletion was successful
        if (!result) {
            return {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR, // 500 if deletion fails unexpectedly
                success: false,
                message: "Failed to delete the booking due to an internal error. Please try again later.",
                data: null,
            };
        }

        // Return success response
        return {
            statusCode: StatusCodes.OK, // 200 success status
            success: true,
            message: "Booking deleted successfully.",
            data: null,
        };

    } catch (error) {
        // Log the error for debugging (optional, depending on your logging strategy)
        // console.error("Error deleting booking:", error);

        // Handle unexpected errors gracefully
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR, // 500 error for server issues
            success: false,
            message: "An unexpected error occurred while attempting to delete the booking. Please try again later.",
            data: null,
        };
    }
}


export const BookingService = {
    createBookingIntoDb,
    retrieveAllBookingsFromDb,
    retrieveSingleBookingFromDb,
    retrieveUserBookingsFromDb,
    updateBookingStatusIntoDb,
    deleteBookingFromDb
}
