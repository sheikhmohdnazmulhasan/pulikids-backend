import { Router } from "express";
import { UserRoutes } from "../modules/users/user.route";
import { ActivityRouters } from "../modules/activities/activity.route";

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
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;