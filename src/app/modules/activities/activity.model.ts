import mongoose, { Schema } from 'mongoose';
import { IActivity } from './activity.interface';

const activitySchema = new Schema<IActivity>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Activity = mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
