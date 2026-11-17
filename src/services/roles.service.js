export class RolesService {
    constructor(rolesModel) {
        this.rolesModel = rolesModel;
    };

    async getRoles() {
        const roles = await this.rolesModel.getRoles();
        return roles;
    };
}