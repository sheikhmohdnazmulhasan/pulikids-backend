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

export const BookingRoutes = router;