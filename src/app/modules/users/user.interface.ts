export interface IUser {
    firstName: String;
    lastName: String;
    email: String;
    password?: String;
    clerkId?: String;
    resetToken?: String;
    resetTokenExpiry?: Date;
    role: 'user' | 'admin';
}