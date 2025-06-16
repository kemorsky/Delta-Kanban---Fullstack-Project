import mongoose from 'mongoose';

export const todoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            required: true,
            minLength: 1
        },
        description: {
            type: String,
            required: true,
            minLength: 1
        },
        comment: {
            type: String,
            required: false,
        },
    }, {
        timestamps: true
        }
);