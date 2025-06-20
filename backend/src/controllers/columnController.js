import mongoose from 'mongoose';
import { columnSchema } from '../models/columnModel.js';

const Column = mongoose.model('Column', columnSchema);

const getColumns = async (req, res) => {
    try {
        const columns = await Column.find().sort({ order: 1 });
        res
            .status(200)
            .send(columns);
    } catch (error) {
        return res
            .status(500)
            .json({message: error.message});
    }
};

const postColumn = async (req, res) => {
    try {
        const lastColumn = await Column.findOne().sort({ order: -1});
        const newOrder = lastColumn ? lastColumn.order + 1 : 0;
        const { title } = req.body;
        const newColumn = new Column({
            title,
            order: newOrder
        });
        await newColumn.save();
        res
            .status(201)
            .json({
                message: "Column created successfully",
                column: newColumn
            });
    } catch (error) {
        return res
            .status(500)
            .json({message: error.message});
    }
};

const editColumn = async (req, res) => {
    const columnId = req.params.id;
    const { title } = req.body;

    try {
        const updatedColumn = await Column.findByIdAndUpdate(
            columnId,
            {title}, 
            {new: true, runValidators: true}
        );

        if (!updatedColumn) {
            res
                .status(404)
                .json({message: `Columns with id ${columnId} not found.`})
        };

        res
            .status(200)
            .json({
                message: `Todo with id ${columnId} edited successfully`,
                column: updatedColumn
            });
    } catch (error) {
        res
            .status(error.status || 500)
            .json({message: "Error updating column", error: error.message})
    }
};

const reorderColumns = async (req, res) => {
    console.log("🔥 reorderColumns route hit");
    const { order } = req.body;

    // console.log("🧪 Received body:", req.body);
    // if (!Array.isArray(order)) {
    //     console.log("🧪 FULL req.body:", req.body);
    //     console.error("Invalid reorder payload:", req.body);
    //     return res.status(400).json({ message: "Order must be an array" });
    // }
    
    try {
        const bulkOps = order.map((id, index) => ({
            updateOne: {
                filter: {_id: id},
                update: {order: index}
            }
        }));

        await Column.bulkWrite(bulkOps);

        const updatedColumns = await Column.find().sort({ order: 1 });

        res
            .status(200)
            .json({ message: "Columns reordered successfully", columns: updatedColumns });

    } catch (error) {
        res
            .status(error.status || 500)
            .json({message: "Error reordering columns", error: error.message})
    }
};

const deleteColumn = async (req, res) => {
    const columnId = req.params.id;
    
    try {
        const deletedColumn = await Column.findByIdAndDelete(columnId)

        if (!deletedColumn) {
            res
                .status(error.status)
                .json({message: `Column with id ${columnId} not found.`})
        }

        res
            .status(200)
            .json({message: `Column with id ${columnId} deleted successfully.`});

    } catch (error) {
        res
            .status(error.status || 500)
            .json({message: error.message})
    }
};

export { getColumns, reorderColumns, postColumn, editColumn, deleteColumn };