import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';

// initialize express
const app: Application = express()

// parser
app.use(express.json());
app.use(cors());


// test endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World')
});

// not found route
app.all('*', (req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Not Found",
    });

})

export default app