import { Document, Types } from 'mongoose';

export interface IActivity extends Document {
    name: string;
    description: string;
    date: Date;
    startTime: string; // in format "HH:MM"
    endTime: string; // in format "HH:MM"
    location: string;
    createdBy: Types.ObjectId; // Reference to the User
}
