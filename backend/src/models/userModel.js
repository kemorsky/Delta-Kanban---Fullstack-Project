import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username must be provided"],
            trim: true,
            unique: [true, "Username must be unique"],
            minLength: [3, "Username must be at least 3 characters"],
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password must be provided"],
            trim: true,
            minLength: [5, "Password must be at least 5 characters"],
        },
        forgotPasswordCode: {
            type: String,
            select: false,
        },
        forgotPasswordCodeValidation: {
            type: Number,
            select: false,
        },
    }, {
            timestamps: true,
            validateBeforeSave: true,
        }
);