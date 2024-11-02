import { Router } from "express";
import { BookingController } from "./booking.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";
import ValidationRequest from "../../middlewares/zod_validation";
import { BookingValidation } from "./booking.validation";

const router = Router();

router.post('/create-booking',
    Auth([userRole.USER]),
    ValidationRequest(BookingValidation.createBookingSchemaValidation),
    BookingController.createBooking);

router.get('/',
    Auth([userRole.ADMIN, userRole.USER]),
    // ValidationRequest(BookingValidation.createBookingSchemaValidation),
    BookingController.retrieveAllBookings);

router.get('/:bookingId',
    Auth([userRole.ADMIN]),
    // ValidationRequest(BookingValidation.createBookingSchemaValidation),
    BookingController.retrieveSingleBooking);

router.get('/user/:userId',
    Auth([userRole.ADMIN]),
    // ValidationRequest(BookingValidation.createBookingSchemaValidation),
    BookingController.retrieveUserBookings);

router.patch('/action/status/:bookingId',
    Auth([userRole.ADMIN]),
    ValidationRequest(BookingValidation.updateBookingSchemaValidation),
    BookingController.updateBookingStatus);

export const BookingRoutes = router;