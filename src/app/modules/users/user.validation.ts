import { z } from "zod";

const createUserValidation = z.object({
    body: z.object({
        firstName: z.string().nonempty({ message: "First name is required" }),
        lastName: z.string().nonempty({ message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().nonempty({ message: "password is required" }),
    })
});

const loginUserValidation = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().nonempty({ message: "password is required" }),
    })
});

const requestPasswordResetValidation = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
    })
});

const passwordResetValidation = z.object({
    body: z.object({
        token: z.string().nonempty({ message: "token is required" }),
        newPassword: z.string().nonempty({ message: "new password is required" }),
    })
});

export const UserValidation = {
    createUserValidation,
    loginUserValidation,
    requestPasswordResetValidation,
    passwordResetValidation
};

