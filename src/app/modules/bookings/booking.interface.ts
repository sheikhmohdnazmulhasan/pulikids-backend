import { Types } from 'mongoose';

export interface IBooking {
    activityId: Types.ObjectId; // Reference to Activity schema
    userId: Types.ObjectId; // Reference to User schema
    status: 'pending' | 'confirmed' | 'canceled'; // Status of the booking
    bookingDate: Date; // Date of booking
}