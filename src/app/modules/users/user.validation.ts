import { z } from "zod";

const createUserValidation = z.object({
    firstName: z.string().nonempty({ message: "First name is required" }),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z.enum(['admin', 'user']).optional(),
});

export const UserValidation = {
    createUserValidation
};

