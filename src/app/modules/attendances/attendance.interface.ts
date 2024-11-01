import mongoose from "mongoose";

export interface IAttendance extends Document {
    activityId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    status: 'present' | 'absent' | 'excused';
};