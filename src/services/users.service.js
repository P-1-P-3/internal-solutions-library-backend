import { CustomError } from "../utils/errors.js";
import { hashPassword } from "../utils/hash-password.js";

export class UsersService {
    constructor(usersModel) {
        this.usersModel = usersModel;
    };

    async getUser(id) {
        const user = await this.usersModel.getUser(id);
        return user;
    };

    async createUser(userData) {
        if (await this.userEmailExists(userData.email)) 
            throw new CustomError(400, 'La dirección de correo electrónico introducida ya está vinculada a un usuario.');
        
        if (!userData.password)
            throw new CustomError(400, 'La contraseña no puede estar vacía.');

        const password = await hashPassword(userData.password);

        const user = await this.usersModel.createUser({...userData, password, created_by: null });

        return user;
    };

    async updateUser(id, userData) {
        if (await this.userEmailExists(userData.email))
            throw new CustomError(400, 'La dirección de correo electrónico introducida ya está vinculada a un usuario.');
        
        let password;
        if (Object.hasOwn(userData, 'password')) {
            if (!userData.password) {
                throw new CustomError(400, 'La contraseña no puede estar vacía.');
            }

            password = await hashPassword(userData.password);
        }

        const updatedUser = await this.usersModel.updateUser(id, {...userData, password, update_by: null });

        return { user: updatedUser };
    };

    async deleteUser(id) {
        const deletedUser = await this.usersModel.deleteUser(id);
        return { user: deletedUser };
    };

    async userEmailExists(email) {
        return this.usersModel.userEmailExists(email);
    };
};