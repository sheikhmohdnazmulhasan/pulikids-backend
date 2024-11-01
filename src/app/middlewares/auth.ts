import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";

function Auth(role: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'You have no access to this route'
            });
            return;
        }

        const extractToken = authHeader.slice(7);

        jwt.verify(extractToken, config.jwt_access_token_secret as string, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: 'You have no access to this route'
                });
            } else {
                const payload = decoded as JwtPayload;
                if (!role.includes(payload.role)) {
                    res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: `You have no access to this route`
                    });
                } else {
                    req.user = payload;
                    next();
                }
            }
        });
    };
}

export default Auth;
