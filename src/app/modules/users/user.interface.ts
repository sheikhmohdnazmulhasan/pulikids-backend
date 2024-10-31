export interface IUser {
    firstName: String;
    lastName: String;
    email: String;
    password?: String;
    clerkId?: String;
    role: 'user' | 'admin';
}