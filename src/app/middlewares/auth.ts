import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";

function Auth(role: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'You have no access to this route'
            });
        };

        const extractToken = authHeader.slice(7);
        jwt.verify(extractToken, (config.jwt_access_token_secret as string), (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: 'You have no access to this route'
                });

            } else {
                const payload = decoded as JwtPayload;
                if (payload.role !== role) {
                    return res.status(401).json({
                        success: false,
                        statusCode: 401,
                        message: `You have no access to this route`
                    });

                } else {
                    req.user = (decoded as JwtPayload);
                    next();
                }
            };

        });
    };
};

export default Auth;