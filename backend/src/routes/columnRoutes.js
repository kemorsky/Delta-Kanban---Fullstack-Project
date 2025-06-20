import express from 'express';
import { getColumns, reorderColumns, postColumn, editColumn, deleteColumn} from '../controllers/columnController.js'

const router = express.Router();

router.get('', getColumns);
router.put('/reorder', reorderColumns);
router.post('', postColumn);
router.put('/column/:id', editColumn);
router.delete('/column/:id', deleteColumn);

export default router;