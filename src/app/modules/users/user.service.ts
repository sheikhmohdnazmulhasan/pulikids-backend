
import { clerkClient } from "@clerk/express";
import type { IUser } from "./user.interface";
import AppError from "../../errors/AppError";

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

        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        // throw error;
    }
}

export const UserService = {
    createUserIntoDb,
};