import { z } from "zod";
import mongoose from "mongoose";

// Custom validation to check if a string is a valid ObjectId
const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid activity _id",
});

const createAttendanceValidationSchema = z.object({
    activityId: objectIdSchema, // Validate activityId as a valid ObjectId
    status: z.enum(['present', 'absent', 'excused'], {
        required_error: "Status is required",
        invalid_type_error: "Status must be one of 'present', 'absent', or 'excused'"
    })
});

export const AttendanceValidation = {
    createAttendanceValidationSchema
}
