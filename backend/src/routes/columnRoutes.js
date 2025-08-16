import express from 'express';
import { getColumns, reorderColumns, postColumn, editColumn, deleteColumn} from '../controllers/columnController.js'

const router = express.Router();

router.get('/columns', getColumns);
router.put('/columns/reorder', reorderColumns);
router.post('/columns', postColumn);
router.put('/columns/column/:id', editColumn);
router.delete('/columns/column/:id', deleteColumn);

export default router;