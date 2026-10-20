export default class ReusableSolutionsService {
    constructor(reusableSolutionsModel) {
        this.reusableSolutionsModel = reusableSolutionsModel;
    };

    async getAllReusableSolutions() {
        try {
            const reusableSolutions = await this.reusableSolutionsModel.getAllReusableSolutions();
            return reusableSolutions;
        } catch (error) {
            console.error('Error fetching reusable solutions:', error);
            throw new Error('Error interno del servidor');
        }
    };

    async getReusableSolutionById(id) {
        try {
            const reusableSolution = await this.reusableSolutionsModel.getReusableSolutionById(id);
            // TODO: Crear lógica para obtener tags y technologies asociados con la solución reutilizable
            return reusableSolution;
        } catch (error) {
            console.error(`Error fetching reusable solution with ID ${id}:`, error);
            throw new Error('Error interno del servidor');
        }
    };

    async createReusableSolution({tags, technologies, ...solutionData}) {
        try {
            const newSolution = await this.reusableSolutionsModel.createReusableSolution(solutionData);
            // TODO: Crear lógica para asociar tags y technologies con la nueva solución reutilizable
            return newSolution;
        } catch (error) {
            console.error('Error creating reusable solution:', error);
            throw new Error('Error interno del servidor');
        }
    };

    async updateReusableSolution(id, {tags, technologies, ...solutionData}) {
        try {
            const updatedSolution = await this.reusableSolutionsModel.updateReusableSolution(id, solutionData);
            // TODO: Crear lógica para actualizar tags y technologies asociados con la solución reutilizable
            return updatedSolution;
        } catch (error) {
            console.error(`Error updating reusable solution with ID ${id}:`, error);
            throw new Error('Error interno del servidor');
        }
    };

    async deleteReusableSolution(id) {
        try {
            const deletedSolution = await this.reusableSolutionsModel.deleteReusableSolution(id);
            // TODO: Crear lógica para eliminar tags y technologies asociados con la solución reutilizable
            return deletedSolution;
        } catch (error) {
            console.error(`Error deleting reusable solution with ID ${id}:`, error);
            throw new Error('Error interno del servidor');
        }
    };
}; 