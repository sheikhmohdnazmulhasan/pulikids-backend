import { clerkClient } from "@clerk/express";
import type { IUser } from "./user.interface";
import User from "./user.model";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import config from "../../config";
import handleClerkError from "../../errors/handleClerkError";

// Define the parameter type for the createUser method from Clerk's client.
// This ensures `createUserParams` has the exact structure Clerk expects.
type CreateUserParams = Parameters<typeof clerkClient.users.createUser>[0];

// Async function to create a new user in Clerk and save them to the database.
async function createUserIntoDb({ email, password, firstName, lastName }: IUser) {

    try {
        // Create an object with required fields for Clerk's createUser method.
        const createUserParams: CreateUserParams = {
            emailAddress: [String(email)],
            password: String(password),
            firstName: String(firstName),
            lastName: String(lastName),
        };

        // Register the user with Clerk using the createUser method.
        const user = await clerkClient.users.createUser(createUserParams);

        // Check if Clerk successfully created the user.
        if (user) {
            // Insert user data into the database, including Clerk's unique ID.
            const saveUserToDb = await User.create({
                email, firstName, lastName, clerkId: user.id
            });

            // Confirm successful database insertion, returning a success response.
            if (saveUserToDb) {
                return {
                    statusCode: StatusCodes.OK,
                    success: true,
                    message: 'User registered successfully. Please log in.',
                    data: saveUserToDb
                };

            } else {
                // Return failure if database insertion fails.
                return {
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false,
                    message: 'Failed to insert account data into database. Try again.',
                    data: null
                };
            };

        } else {
            // Return failure if user creation in Clerk fails.
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: 'Failed to create account in Clerk.',
                data: null
            };
        };

    } catch (error: any) {
        if (error.clerkError) {
            // Format Clerk-specific errors to match TResponse structure.
            return handleClerkError(error);
        } else {
            // Handle general errors.
            return {
                statusCode: 500,
                success: false,
                message: "Internal Server Error",
                data: null,
            };
        }
    }
};

async function loginUserFromClerk(payload: { email: string; password: string; }) {
    try {
        // Find user by email in the database
        const user = await User.findOne({ email: payload.email });

        // If user is not found, return a NOT_FOUND response
        if (!user) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "User Not Found",
                data: null,
            };
        }

        // Verify the password with Clerk's client using user ID and provided password
        await clerkClient.users.verifyPassword({
            userId: String(user.clerkId),
            password: payload.password
        });

        // Generate access token with user details, expires in 3 hours
        const accessToken = jwt.sign({
            data: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        }, config.jwt_access_token_secret as string, { expiresIn: '3h' });

        // If access token creation fails, return NOT_IMPLEMENTED response
        if (!accessToken) {
            return {
                statusCode: StatusCodes.NOT_IMPLEMENTED,
                success: false,
                message: "Failed to create access token",
                data: null,
            };
        }

        // Generate refresh token with similar data, expires in 30 days
        const refreshToken = jwt.sign({
            data: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        }, config.jwt_refresh_token_secret as string, { expiresIn: '30d' });

        // Return success response with user information and tokens
        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                user: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    role: user.role
                },
                token: {
                    accessToken,
                    refreshToken
                }
            },
        };

    } catch (error: any) {
        // Check if the error is specific to Clerk
        if (error.clerkError) {
            // Format Clerk-specific error to match TResponse structure

            return handleClerkError(error);
        } else {
            // Handle general errors
            return {
                statusCode: 500,
                success: false,
                message: "Internal Server Error",
                data: null,
            };
        }
    }
};

async function resetPasswordWithClerk(payload: { email: string; }) {

    console.log(payload);
}

// Export UserService object with various methods
export const UserService = {
    createUserIntoDb,
    loginUserFromClerk,
    resetPasswordWithClerk
};