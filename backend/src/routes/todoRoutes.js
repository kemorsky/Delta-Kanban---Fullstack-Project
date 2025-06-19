import express from 'express';
import { getTodos, postTodo, editTodo, deleteTodo} from '../controllers/todoController.js'

const router = express.Router();

router.post('/columns/:columnId/todos', postTodo);
router.get('/columns/:columnId/todos', getTodos);
router.put('/columns/:columnId/todos/todo/:id', editTodo);
router.delete('/columns/:columnId/todos/todo/:id', deleteTodo);

export default router;