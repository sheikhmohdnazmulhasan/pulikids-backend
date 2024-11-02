import { z } from 'zod';

export const createBookingSchemaValidation = z.object({
    body: z.object({
        activityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Activity ID'), // Checks for a valid ObjectId
        // userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID'), // Checks for a valid ObjectId
        bookingDate: z.string().transform((str) => new Date(str)).optional(),
    })
});

// Define the schema for updating a booking
export const updateBookingSchemaValidation = z.object({
    body: z.object({
        status: z.enum(['confirmed', 'canceled']),
    }),
});

export const BookingValidation = {
    createBookingSchemaValidation,
    updateBookingSchemaValidation
}
