import { Router } from "express";
import { BookingController } from "./booking.controller";
import Auth from "../../middlewares/auth";
import { userRole } from "../../constants/constant.user.role";

const router = Router();

router.post('/create-booking',
    Auth([userRole.USER]),
    BookingController.createBooking);

export const BookingRoutes = router;