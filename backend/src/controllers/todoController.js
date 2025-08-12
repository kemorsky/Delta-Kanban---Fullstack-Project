import mongoose from 'mongoose';
import { todoSchema } from '../models/todoModel.js';
import { columnSchema } from '../models/columnModel.js';
import { labelSchema } from '../models/labelModel.js';

const Todo = mongoose.model('Todo', todoSchema);
const Column = mongoose.model('Column', columnSchema);
const Label = mongoose.model('Label', labelSchema);

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id })
                            .sort({ order: 1 })
                            .populate('user', 'username')
                            .populate('labels');

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

const getTodoById = async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await Todo.findOne({ _id: todoId, user: req.user.id }).populate('user', 'username');
        res
            .status(200)
            .json(todo)
    } catch (error) {
        return res
            .status(404)
            .json({message: "Todo not found"})
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
      columnId,
      order: await Todo.countDocuments({ columnId }),
      labels: [],
      user: req.user.id
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

const postLabel = async (req, res) => {
    try {
        const todoId = req.params.id;
        const { title } = req.body;

        const todo = await Todo.findById({ _id: todoId });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        const newLabel = new Label({ title, todo });
        await newLabel.save();

        todo.labels.push(newLabel._id);
        await todo.save();

         console.log(todo);

         res.status(201).json({
            message: "Label created successfully",
            label: newLabel
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

const deleteLabel = async (req, res) => {
    try {
        const todoId = req.params.id;
        const labelId = req.params.labelId;
        console.log('deleteLabel hit');
        console.log('Params:', req.params);

        const todo = await Todo.findOneAndUpdate(
            { _id: todoId },
            { $pull: { labels: labelId } },
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        if (todo.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You don't have permission to delete this label" });
        }

         res.status(200).json({
            message: "Label deleted successfully"
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

const editTodo = async (req, res) => {
    const todoId = req.params.id;
    const { title, description, labels } = req.body;

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, user: req.user.id },
            { title, description, labels },
            { new: true, runValidators: true }
        );

        if (labels) {
            updatedTodo.labels = labels;
        }

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
        // Step 1: Verify ownership of all todos in the reorder list
        const todos = await Todo.find({ _id: { $in: order }, user: req.user.id });
        if (todos.length !== order.length) {
            return res.status(403).json({ message: "Unauthorized: Invalid todos" });
        }

        const bulkOps = order.map((id, index) => ({
            updateOne: {
                filter: {_id: id, user: req.user.id},
                update: { columnId, order: index}
            }
        }));

         console.log("🚀 Bulk operations prepared1:", bulkOps);

        if (movedTodoId && !order.includes(movedTodoId)) {
            const movedTodo = await Todo.findOne({ _id: movedTodoId, user: req.user.id });
            if (!movedTodo) {
                return res.status(403).json({ message: "Unauthorized moved todo" });
            }
            bulkOps.push({
                updateOne: {
                    filter: {_id: movedTodoId, user: req.user.id},
                    update: { columnId }
                }
            })
        }

        console.log("🚀 Bulk operations prepared2:", bulkOps);

        await Todo.bulkWrite(bulkOps);

        const updatedTodos = await Todo.find({ columnId, user: req.user.id }).sort({ order: 1 });

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
        const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: req.user.id });
        console.log('🔥 deleteTodo hit');

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

export { getTodos, getTodoById, postTodo, editTodo, reorderTodos, deleteTodo, postLabel, deleteLabel };