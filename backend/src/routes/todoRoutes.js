import express from 'express';
import { getTodos, postTodo, editTodo, deleteTodo} from '../controllers/todoController.js'

const router = express.Router();

router.post('', postTodo);
router.get('', getTodos);
router.put('/todo/:id', editTodo);
router.delete('/todo/:id', deleteTodo);

export default router;