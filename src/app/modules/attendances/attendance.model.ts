import mongoose, { Schema } from "mongoose";
import { IAttendance } from "./attendance.interface";

const attendanceSchema: Schema = new Schema<IAttendance>({
    activityId: {
        type: Schema.Types.ObjectId,
        ref: 'Activity', // Reference to Activity schema
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to User schema
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'excused'], // Allowed values
        required: true
    }
});

export const Attendance = mongoose.model('Attendance', attendanceSchema)

// // Index to ensure a user can only have one attendance record per activity
// AttendanceSchema.index({ activityId: 1, userId: 1 }, { unique: true });
// export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);