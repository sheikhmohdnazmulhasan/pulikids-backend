// import mongoose from 'mongoose';
import { z } from 'zod';

export const createActivityValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Activity name is required'),
        description: z.string().min(1, 'Description is required'),
        date: z.string().transform((str) => new Date(str)),
        startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time format (HH:MM)'),
        endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time format (HH:MM)'),
        location: z.string().min(1, 'Location is required'),
        // createdBy: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        //     message: 'Invalid user ID format',
        // }),
    })
});

export const ActivityValidation = {
    createActivityValidationSchema
}
