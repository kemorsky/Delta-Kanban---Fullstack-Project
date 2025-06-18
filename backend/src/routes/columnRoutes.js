import express from 'express';
import { getColumns, postColumn, editColumn, deleteColumn} from '../controllers/columnController.js'

const router = express.Router();

router.post('', postColumn);
router.get('', getColumns);
router.put('/column/:id', editColumn);
router.delete('/column/:id', deleteColumn);

export default router;