export interface IUser {
    firstName: String,
    lastName: String,
    email: String,
    password?: String
    role: 'user' | 'admin'
}