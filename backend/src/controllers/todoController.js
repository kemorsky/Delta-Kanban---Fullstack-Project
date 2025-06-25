import mongoose from 'mongoose';
import { todoSchema } from '../models/todoModel.js';
import { columnSchema } from '../models/columnModel.js';

// TODO: FIND OUT HOW TO REFRESH THE DATABASE ON PUT AND DELETE METHODS SO THAT
// FRONTEND DOESN'T NEED TO MESS AROUND WITH SESSION STORAGE

const Todo = mongoose.model('Todo', todoSchema);
const Column = mongoose.model('Column', columnSchema);

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ order: 1 }).populate('user');
        console.log(todos);
        res
            .status(200)
            .json(todos);
    } catch (error) {
        return res
                .status(404)
                .json({message: "No todos found"});
    }
};

const postTodo = async (req, res) => {
  try {
    const columnId = req.params.columnId;
    const { title, description } = req.body;

    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const newTodo = new Todo({
      title,
      description,
      columnId
    });

    await newTodo.save();
    res.status(201).json({
      message: "Todo created successfully",
      todo: newTodo
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};


const editTodo = async (req, res) => {
    const todoId = req.params.id;
    const {title} = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            {title}, 
            {new: true, runValidators: true}
        );

        if (!updatedTodo) {
            res
                .status(404)
                .json({message: `Todo with id ${todoId} not found.`})
        };

        res
            .status(200)
            .json({
                message: `Todo with id ${todoId} edited successfully`,
                todo: updatedTodo
            });
    } catch (error) {
        res
            .status(error.status || 500)
            .json({message: "Error updating todo", error: error.message})
    }
};

const reorderTodos = async (req, res) => {
    const { order, columnId, movedTodoId } = req.body;

    console.log("reorderTodos route hit");
    
    try {
        const bulkOps = order.map((id, index) => ({
            updateOne: {
                filter: {_id: id},
                update: { columnId, order: index}
            }
        }));

         console.log("🚀 Bulk operations prepared:", bulkOps);

        if (movedTodoId) {
            bulkOps.push({
                updateOne: {
                    filter: {_id: movedTodoId},
                    update: { columnId }
                }
            })
        }

        console.log("🚀 Bulk operations prepared:", bulkOps);

        await Todo.bulkWrite(bulkOps);

        const updatedTodos = await Todo.find({ columnId }).sort({ order: 1 });

        res.status(200).json({ message: "Todos reordered successfully", todos: updatedTodos });

    } catch (error) {
        res
            .status(error.status || 500)
            .json({message: "Error reordering todos", error: error.message})
    }
};

const deleteTodo = async (req, res) => {
    const todoId = req.params.id;
    
    try {
        const deletedTodo = await Todo.findByIdAndDelete(todoId)

        if (!deletedTodo) {
            res
                .status(error.status)
                .json({message: `Todo with id ${todoId} not found.`})
        }

        res
            .status(200)
            .json({message: `Todo with id ${todoId} deleted successfully.`});

    } catch (error) {
        res
            .status(error.status || 500)
            .json({message: error.message})
    }
};

export { getTodos, postTodo, editTodo, reorderTodos, deleteTodo };