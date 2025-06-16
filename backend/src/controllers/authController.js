import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userSchema } from '../models/userModel.js';

const User = mongoose.model('User', userSchema);

export const register = async (req, res) => {
    try { 
        const {username, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({username, password: hashedPassword, role});
        await newUser.save();
        res.
            status(201).
            json({message: `User registered successfully with username: ${username}`});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body; // required body elements to post
        const user = await User.findOne({ username }); // find the user

        if (!user) {
            return res
            .status(404)
            .json({message: `User with username ${username} not found`})
        }

        const isMatch = await bcrypt.compare(password, user.password) // check if password is correct

        if (!isMatch) {
            return res
                .status(400)
                .json({message: 'Invalid credentials'});
        }

        const token = jwt.sign( // create token on successful login
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
