import express from 'express';
import { getTodos, getTodoById, postTodo, editTodo, reorderTodos, deleteTodo, postLabel, deleteLabel } from '../controllers/todoController.js'

const router = express.Router();

router.get('/api/todos', getTodos);
router.get('/api/todos/todo/:id', getTodoById);
router.post('/api/columns/:columnId/todos/todo/:id/labels', postLabel);
router.post('/api/columns/:columnId/todos', postTodo);
router.put('/api/todos/reorder', reorderTodos);
router.put('/api/columns/:columnId/todos/todo/:id', editTodo);
router.delete('/api/columns/:columnId/todos/todo/:id/labels/:labelId', deleteLabel);
router.delete('/api/columns/:columnId/todos/todo/:id', deleteTodo);

export default router;