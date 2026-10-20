import ReusableSolutionsService from '../services/reusable-solutions.service.js';
export class ReusableSolutionsController {
    constructor(reusableSolutionsModel) {
        this.reusableSolutionsService = new ReusableSolutionsService(reusableSolutionsModel);
    };

    getAllReusableSolutions = async (req, res) => {
        try {
            const reusableSolutions = await this.reusableSolutionsService.getAllReusableSolutions();
            res.json(reusableSolutions);
        } catch (error) {
            console.error('Error fetching reusable solutions:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    getReusableSolutionById = async (req, res) => {
        const { id } = req.params;
        try {
            const reusableSolution = await this.reusableSolutionsService.getReusableSolutionById(id);
            if (reusableSolution) {
                res.json(reusableSolution);
            } else {
                res.status(404).json({ error: 'Solución no encontrada' });
            }
        } catch (error) {
            console.error(`Error fetching reusable solution with ID ${id}:`, error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    createReusableSolution = async (req, res) => {
        const solutionData = req.body;
        try {
            const newSolution = await this.reusableSolutionsService.createReusableSolution(solutionData);
            res.status(201).json(newSolution);
        } catch (error) {
            console.error('Error creating reusable solution:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    updateReusableSolution = async (req, res) => {
        const { id } = req.params;
        const solutionData = req.body;
        try {
            const updatedSolution = await this.reusableSolutionsService.updateReusableSolution(id, solutionData);
            res.json(updatedSolution);
        } catch (error) {
            console.error(`Error updating reusable solution with ID ${id}:`, error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    deleteReusableSolution = async (req, res) => {
        const { id } = req.params;
        try {
            const deletedSolution = await this.reusableSolutionsService.deleteReusableSolution(id);
            res.json(deletedSolution);
        } catch (error) {
            console.error(`Error deleting reusable solution with ID ${id}:`, error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
};