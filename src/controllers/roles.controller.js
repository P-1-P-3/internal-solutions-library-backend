import { RolesService } from "../services/roles.service.js";
import { resSuccess } from "../utils/res-success.js";

export class RolesController {
    constructor(rolesModel) {
        this.rolesService = new RolesService(rolesModel);
    };
    
    getRoles = async (req, res) => {
        const roles = await this.rolesService.getRoles();

        resSuccess(res, roles);
    };
};