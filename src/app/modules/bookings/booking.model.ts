import mongoose, { Document, Schema } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking & Document>({
    activityId: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending',
        required: true,
    },
    bookingDate: { type: Date, required: true },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps,
    versionKey: false
});

const Booking = mongoose.model<IBooking & Document>('Booking', bookingSchema);
export default Booking;
