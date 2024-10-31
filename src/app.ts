import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import { globalErrorHandler } from "./app/middlewares/global_error_handler";
import router from "./app/router";
import { clerkClient, clerkMiddleware } from '@clerk/express'

// initialize express
const app: Application = express();


// Initialize middleware
app.use(clerkMiddleware())
app.use(express.json());
app.use(cors());

// test endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World')
});

// application route
app.use('/api/v1', router);

// global error handler
app.use(globalErrorHandler);

// app.patch('/', async (req, res) => {
//     const { email, password, firstName, lastName } = req.body

//     try {
//         const createUserParams = {
//             emailAddress: [String(email)],
//             password: String(password),
//             firstName: String(firstName),
//             lastName: String(lastName),
//         };

//         const user = await clerkClient.users.createUser(createUserParams);

//         res.send(user)
//     } catch (error) {
//         console.error("Error creating user:", error);
//         // throw error;
//     }
// })

// not found route
app.all('*', (req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Not Found",
    });

})

export default app