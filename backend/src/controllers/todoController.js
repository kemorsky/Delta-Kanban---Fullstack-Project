import mongoose from 'mongoose';
import { todoSchema } from '../models/todoModel.js';
import { columnSchema } from '../models/columnModel.js';

// TODO: FIND OUT HOW TO REFRESH THE DATABASE ON PUT AND DELETE METHODS SO THAT 
// FRONTEND DOESN'T NEED TO MESS AROUND WITH SESSION STORAGE

const Todo = mongoose.model('Todo', todoSchema);
const Column = mongoose.model('Column', columnSchema);

const getTodos = async (req, res) => {
    try {
        const columnId = req.params.columnId;
        console.log(`Column ID: ${columnId}`);
        const todos = await Todo.find({ columnId: columnId });
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
        const {title, description, columnId} = req.body; // post required body
        const column = await Column.findById(columnId);
        if (!column) {
            return res
                .status(404)
                .json({ message: "Column not found" });
        }
        const newTodo = new Todo({
            title, 
            description,
            columnId }); // create new todo , // REIMPLEMENT userId: req.user.id PROPERLY AT A LATER TIME

        await newTodo.save(); // wait for the todo to be saved in the database
        res
            .status(201)
            .json({
                message: "Todo created successfully",
                todo: newTodo
            });
    } catch (error) {
        res
            .status(error.status || 500)
            .json({message: error.message});
    }
};

const editTodo = async (req, res) => {
    const todoId = req.params.id;
    const {title, description} = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            {title, description}, 
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

export { getTodos, postTodo, editTodo, deleteTodo };