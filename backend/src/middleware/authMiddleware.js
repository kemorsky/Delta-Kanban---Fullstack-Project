import jwt from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    let token;

    let authHeader = req.headers.Authorization || req.headers.authorization;
    console.log(authHeader);
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({message: "No suitable token found"})
        };

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode;
            console.log("The decoded user is: ", req.user)
            next(); // forwards the request
        } catch (er) {
            res
                .status(400)
                .json({message: "Invalid token"})
        }
    } else {
        return res
            .status(401)
            .json({message: "No suitable token found"})
    };
};

export default verifyToken;