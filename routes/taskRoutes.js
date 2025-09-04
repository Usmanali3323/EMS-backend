import express from 'express';
import { createTask, getAllTasks,getTaskById, updateTask,deleteTask } from '../controllers/taskController.js';getAllTasks


const router = express.Router();

// Task Routes
router.post('/createTasks', createTask); // Create task route
router.get('/allTasks', getAllTasks);   // get allTasks route
router.get('/:id', getTaskById);         // Get task by ID route
router.put("/:id", updateTask);            //  Update task
router.delete("/:id", deleteTask);        //Delete task

export default router;


