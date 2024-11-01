import { z } from 'zod';

export const createBookingSchemaValidation = z.object({
    activityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Activity ID'), // Checks for a valid ObjectId
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID'), // Checks for a valid ObjectId
    bookingDate: z.date(),
});

export const BookingValidation = {
    createBookingSchemaValidation
}
