import express from 'express';
import { getColumns, reorderColumns, postColumn, editColumn, deleteColumn} from '../controllers/columnController.js'

const router = express.Router();

router.get('/api/columns', getColumns);
router.put('/api/columns/reorder', reorderColumns);
router.post('/api/columns', postColumn);
router.put('/api/columns/column/:id', editColumn);
router.delete('/api/columns/column/:id', deleteColumn);

export default router;