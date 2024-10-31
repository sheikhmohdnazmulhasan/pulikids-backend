import { z } from "zod"; // Import Zod library for schema validation

// Validation schema for user registration
const createUserValidation = z.object({
    body: z.object({
        firstName: z.string().nonempty({ message: "First name is required" }),
        lastName: z.string().nonempty({ message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().nonempty({ message: "Password is required" }),
    })
});

// Validation schema for user login
const loginUserValidation = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().nonempty({ message: "Password is required" }),
    })
});

// Validation schema for requesting a password reset
const requestPasswordResetValidation = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
    })
});

// Validation schema for resetting the password
const passwordResetValidation = z.object({
    body: z.object({
        token: z.string().nonempty({ message: "Token is required" }),
        newPassword: z.string().nonempty({ message: "New password is required" }),
    })
});

// Export all validation schemas as UserValidation object
export const UserValidation = {
    createUserValidation,
    loginUserValidation,
    requestPasswordResetValidation,
    passwordResetValidation
};
