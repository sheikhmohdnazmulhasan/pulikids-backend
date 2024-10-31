import { IUser } from "./user.interface";

async function createUserIntoDb(payload: IUser) {

    console.log(payload);

}


export const UserService = {
    createUserIntoDb
}