import { Router } from "express";
import { BookingController } from "./booking.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";
import ValidationRequest from "../../middlewares/zod_validation";
import { BookingValidation } from "./booking.validation";

const router = Router();

// Route to create a new booking (USER role)
router.post('/create-booking',
    Auth([userRole.USER]),
    ValidationRequest(BookingValidation.createBookingSchemaValidation),
    BookingController.createBooking
);

// Route to retrieve all bookings (ADMIN and USER roles)
router.get('/',
    Auth([userRole.ADMIN, userRole.USER]),
    BookingController.retrieveAllBookings
);

// Route to retrieve a single booking by ID (ADMIN role only)
router.get('/:bookingId',
    Auth([userRole.ADMIN]),
    BookingController.retrieveSingleBooking
);

// Route to retrieve all bookings for a specific user (ADMIN role only)
router.get('/user/:userId',
    Auth([userRole.ADMIN]),
    BookingController.retrieveUserBookings
);

// Route to update booking status by booking ID (ADMIN role only)
router.patch('/action/status/:bookingId',
    Auth([userRole.ADMIN]),
    ValidationRequest(BookingValidation.updateBookingSchemaValidation),
    BookingController.updateBookingStatus
);

// Route to delete a booking by ID (ADMIN role only)
router.delete('/action/delete/:bookingId',
    Auth([userRole.ADMIN]),
    BookingController.deleteBooking
);

export const BookingRoutes = router;
