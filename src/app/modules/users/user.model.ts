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
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: "user"
    }
});

const User = mongoose.model<IUser>('user', userModel);
export default User;