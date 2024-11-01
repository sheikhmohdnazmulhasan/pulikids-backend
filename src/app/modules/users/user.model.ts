import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const userModel = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    clerkId: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExpiry: {
        type: Date,
        required: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: "user"
    }
}, {
    timestamps: true,
    versionKey: false
});
const User = mongoose.model<IUser>('User', userModel);
export default User;