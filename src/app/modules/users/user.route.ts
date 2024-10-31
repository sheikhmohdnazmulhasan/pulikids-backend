import { Router } from "express";
import { UserController } from "./users.controller";

const router = Router();

router.post('/register', UserController.createUser)

export const UserRoutes = router;