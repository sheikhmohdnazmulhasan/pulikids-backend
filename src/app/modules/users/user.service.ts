import { authenticateRequest, clerkClient } from "@clerk/express";
import type { IUser } from "./user.interface";
import User from "./user.model";
import { StatusCodes } from "http-status-codes";

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
                    message: 'User created in database. Please log in.',
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
            const formattedError = {
                statusCode: error.status || 422,
                success: false,
                message: error.errors?.[0]?.message || "An error occurred with Clerk.",
                data: {
                    clerkTraceId: error.clerkTraceId,
                    errors: error.errors,
                },
            };

            return formattedError;
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

async function loginUserFromClerk(payload: { email: string; password: string }) {
    try {
        // Clerk's session-based login
        const userSession = await clerkClient.users.verifyPassword({
            userId: '32323',
            password: 'eeewe'
        })

        clerkClient.

        // if (!userSession) {
        //     return res.status(401).json({ message: 'Invalid credentials' });
        // }

        // res.status(200).json({
        //     message: 'Login successful',
        //     sessionToken: userSession.session.token, // Clerk session token
        //     user: userSession.user, // Clerk user data
        // });

        return userSession;

    } catch (error) {
        console.error("Login error:", error);
        // res.status(400).json({ message: 'Login failed', error: error.message });
    }

}


export const UserService = {
    createUserIntoDb,
    loginUserFromClerk
};