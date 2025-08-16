import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userSchema } from '../models/userModel.js';

const User = mongoose.model('User', userSchema);

export const register = async (req, res) => {
    try { 
        const { username, password, role } = req.body;

        if (password.length < 5) {
            return res.status(400).json({ message: 'Password must be at least 5 characters' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, role });
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
    const { username, password } = req.body; // required body elements to post

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: `User with username ${username} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password); // check if password is correct
    console.log('isMatch:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // send only over HTTPS in prod
      sameSite: 'None',
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ username, userId: user._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = (res) => {
  try {
    res.clearCookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            res
                .status(404)
                .json({message: `User with id ${userId} not found`});
        }

        res
            .status(200)
            .json({message: `User with id ${userId} deleted successfully`});

    } catch (error) {
        res
            .status(error.status || 500)
            .json({message: error.message})
    }
};

export const fetchUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user)
  } catch (error) {
      return res
        .status(404)
        .json({message: "User not found"})
  }
}