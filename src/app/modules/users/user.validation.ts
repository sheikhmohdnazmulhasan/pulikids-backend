import { z } from "zod";

const createUserValidation = z.object({
    body: z.object({
        firstName: z.string().nonempty({ message: "First name is required" }),
        lastName: z.string().nonempty({ message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().nonempty({ message: "password is required" }),
    })
});

export const UserValidation = {
    createUserValidation
};

