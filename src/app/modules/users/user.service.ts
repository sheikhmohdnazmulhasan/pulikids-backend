import { clerkClient } from "@clerk/express";
import type { IUser } from "./user.interface";
import User from "./user.model";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import config from "../../config";
import handleClerkError from "../../errors/handleClerkError";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or use a different service like SendGrid or Mailgun
    auth: {
        user: config.email_user, // Email service account
        pass: config.email_pass // Email service password
    }
});

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


// Function to request a password reset
export async function requestPasswordResetService(email: string) {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "User not found",
                data: null
            };
        }

        // Generate a secure token for the password reset link
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Store the token and expiry in the user's record
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(resetTokenExpiry);
        await user.save();

        // Send an email with the reset link
        // await transporter.sendMail({
        //     to: user.email,
        //     subject: "Password Reset Request",
        //     html: `<p>You requested a password reset.</p>
        //            <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`
        // });

        console.log('reset token', resetToken);

        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Password reset email sent. Please check your inbox.",
            data: null
        };

    } catch (error) {
        return {
            statusCode: 500,
            success: false,
            message: "Internal Server Error",
            data: null
        };
    }
}

// Function to reset the password
export async function resetPassword(token: string, newPassword: string) {
    try {
        // Find the user with the matching reset token and valid expiry
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check that the token hasn't expired
        });

        if (!user) {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Invalid or expired token",
                data: null
            };
        }

        // Update the password in Clerk and clear the reset token fields
        await clerkClient.users.updateUser(user.clerkId, { password: newPassword });
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Password reset successful",
            data: null
        };

    } catch (error) {
        return {
            statusCode: 500,
            success: false,
            message: "Internal Server Error",
            data: null
        };
    }
}


// Export UserService object with various methods
export const UserService = {
    createUserIntoDb,
    loginUserFromClerk,
    requestPasswordResetService
};