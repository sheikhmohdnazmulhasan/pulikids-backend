
import { clerkClient } from "@clerk/express";
import type { IUser } from "./user.interface";
import User from "./user.model";
import { StatusCodes } from "http-status-codes";

// Extract the parameter type from the createUser method
type CreateUserParams = Parameters<typeof clerkClient.users.createUser>[0];

async function createUserIntoDb({ email, password, firstName, lastName, role }: IUser) {

    try {
        const createUserParams: CreateUserParams = {
            emailAddress: [String(email)],
            password: String(password),
            firstName: String(firstName),
            lastName: String(lastName),
        };

        const user = await clerkClient.users.createUser(createUserParams);

        if (user) {
            const saveUserToDb = await User.create({
                email, firstName, lastName, role, clerkId: user.id
            });

            if (saveUserToDb) {
                return {
                    statusCode: StatusCodes.OK,
                    success: true,
                    message: 'User created into database. places login',
                    data: saveUserToDb
                };

            } else {
                return {
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false,
                    message: 'Something wrong with inserting account data into db. try again',
                    data: null
                };
            };

        } else {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: 'Something wrong with creating account into clerk',
                data: null
            };
        };

    } catch (error) {
        console.error("Error creating user:", error);
        // throw error;
    }
}

export const UserService = {
    createUserIntoDb,
};