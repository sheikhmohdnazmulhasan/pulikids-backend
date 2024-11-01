import { Router } from "express";
import { UserRoutes } from "../modules/users/user.route";
import { ActivityRouters } from "../modules/activities/activity.route";
import { AttendanceRoutes } from "../modules/attendances/attendance.route";
import { BookingRoutes } from "../modules/bookings/booking.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/auth/user',
        route: UserRoutes,
    },
    {
        path: '/activities',
        route: ActivityRouters,
    },
    {
        path: '/attendances',
        route: AttendanceRoutes,
    },
    {
        path: '/bookings',
        route: BookingRoutes,
    },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;