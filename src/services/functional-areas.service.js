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
        // Verificar campos vacíos o espacios en blanco
        if (!functional_area || typeof functional_area !== 'string' || !functional_area.trim()) {
            throw new CustomError(400, 'El campo del área funcional no puede estar vacío');
        }

        const cleanFunctionalArea = functional_area.trim();

        if (await this.functionalAreaExistsByName(cleanFunctionalArea)) {
            throw new CustomError(400, 'El área funcional ya existe');
        }

        const newFunctionalArea = await this.functionalAreasModel.createFunctionalArea(cleanFunctionalArea);
        return newFunctionalArea;
    }

    async updateFunctionalArea(id, functional_area) {
    // Verificar campos vacíos o espacios en blanco
        if (!functional_area || typeof functional_area !== 'string' || !functional_area.trim()) {
            throw new CustomError(400, 'El campo del área funcional no puede estar vacío');
        }

        const cleanFunctionalArea = functional_area.trim();       
        
        // 1. Verificar si el ID que intentas modificar existe
        if (!await this.functionalAreaExistsById(id)) {
            throw new CustomError(400, 'No existe el área funcional');
        }

        // 2. Verificar si el nombre ya lo tiene OTRO ID diferente
        const existingMatches = await this.functionalAreasModel.findFunctionalAreaMatches(functional_area, true);
        if (existingMatches.length > 0) {
            // Comparar si el ID del registro encontrado es diferente al ID que se esta actulizando
            const conflictRecord = existingMatches.find(item => item.id !== Number(id));
            if (conflictRecord) {
                throw new CustomError(400, 'Ya existe otra área funcional con este nombre');
            }
        }

        // 3. Proceder a actualizar si pasa las validaciones
        const updatedFunctionalArea = await this.functionalAreasModel.updateFunctionalArea(id, functional_area);
        return updatedFunctionalArea;
    }

    async deleteFunctionalArea(id) {
        // Verificar si el área funcional existe antes de borrar
        if (!await this.functionalAreaExistsById(id)) {
            throw new CustomError(400, 'No existe el área funcional');
        }

        // 1. Desvincular de las soluciones 
        await this.functionalAreasModel.removeFunctionalAreaFromSolutions(id);

        // 2. Proceder a eliminar el área funcional de su tabla
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