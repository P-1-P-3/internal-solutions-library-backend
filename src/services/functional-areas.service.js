import { CustomError } from "../utils/errors.js";

export class FunctionalAreasService {
    constructor(functionalAreasModel) {
        this.functionalAreasModel = functionalAreasModel;
    }

    async getAllFunctionalAreas() {
        const functionalAreas = await this.functionalAreasModel.getAllFunctionalAreas();
        return functionalAreas;
    }

    async findFunctionalAreaMatches(functional_area, exactMatch = false) {
        const functionalAreas = await this.functionalAreasModel.findFunctionalAreaMatches(functional_area, exactMatch);
        return functionalAreas;
    }

    async createFunctionalArea(functional_area) {
        if (await this.functionalAreaExistsByName(functional_area)) {
            throw new CustomError(400, 'El área funcional ya existe');
        }

        const newFunctionalArea = await this.functionalAreasModel.createFunctionalArea(functional_area);
        return newFunctionalArea;
    }

    async updateFunctionalArea(id, functional_area) {
        if (!await this.functionalAreaExistsById(id)) {
            throw new CustomError(400, 'No existe el área funcional');
        }

        const updatedFunctionalArea = await this.functionalAreasModel.updateFunctionalArea(id, functional_area);
        return updatedFunctionalArea;
    }

    async deleteFunctionalArea(id) {
        // Verificar si el área funcional existe
        if (!await this.functionalAreaExistsById(id)) {
            throw new CustomError(400, 'No existe el área funcional');
        }

        // Nueva validación: verificar si está asociada a alguna solución
        if (await this.functionalAreaAssignedToSolutions(id)) {
            throw new CustomError(400, 'No es posible eliminar el área funcional, asegúrese de que no esté asociada a alguna solución');
        }

        // Proceder a eliminar si pasa las validaciones
        const deletedFunctionalArea = await this.functionalAreasModel.deleteFunctionalArea(id);
        return deletedFunctionalArea;
    }

    async functionalAreaExistsByName(functional_area) {
        const functionalAreaExists = await this.functionalAreasModel.findFunctionalAreaMatches(functional_area, true);
        return !!functionalAreaExists.length;
    }

    async functionalAreaExistsById(id) {
        const functionalAreaExists = await this.functionalAreasModel.getFunctionalAreaById(id);
        return !!functionalAreaExists.length;
    }
}