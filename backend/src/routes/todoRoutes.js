import express from 'express';
import { getTodos, getTodoById, postTodo, editTodo, reorderTodos, deleteTodo, postLabel, deleteLabel } from '../controllers/todoController.js'

const router = express.Router();

router.get('/todos', getTodos);
router.get('/todos/todo/:id', getTodoById);
router.post('/columns/:columnId/todos/todo/:id/labels', postLabel);
router.post('/columns/:columnId/todos', postTodo);
router.put('/todos/reorder', reorderTodos);
router.put('/columns/:columnId/todos/todo/:id', editTodo);
router.delete('/columns/:columnId/todos/todo/:id/labels/:labelId', deleteLabel);
router.delete('/columns/:columnId/todos/todo/:id', deleteTodo);

export default router;