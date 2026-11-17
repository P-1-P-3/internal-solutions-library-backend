
import { UsersService } from "../services/users.service.js";
import { CustomError } from "../utils/errors.js";
import { resSuccess } from "../utils/res-success.js";

export class UsersController {
    constructor(usersModel) {
        this.usersService = new UsersService(usersModel);
    };

    getUser = async (req, res) => {
        const { id } = req.params;

        const user = await this.usersService.getUser(id);

        if(user) {
            resSuccess(res, user);
        } else {
            throw new CustomError(404, 'Usuario no encontrado');
        }
    };

    getUsers = async (req, res) => {
        const { pagination = {}, filters = {}, sort = {} } = req.body ?? {};

        const users = await this.usersService.getUsers(pagination, filters, sort);
        resSuccess(res, users);
    };

    createUser = async (req, res) => {
        const userData = req.body;
        const { id }   = req.user;

        const user = await this.usersService.createUser({...userData, created_by: id});

        resSuccess(res, user, 201);
    };

    updateUser = async (req, res) => {
        const userData       = req.body;
        const { id }         = req.params;
        const { id: userId } = req.user;

        const updatedUser = await this.usersService.updateUser(id, {...userData, update_by: userId});

        resSuccess(res, updatedUser);
    };

    deleteUser = async (req, res) => {
        const { id } = req.params;

        const deletedUser = await this.usersService.deleteUser(id);
        
        resSuccess(res, deletedUser);
    };
};