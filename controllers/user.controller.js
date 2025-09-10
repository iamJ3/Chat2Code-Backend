// Controller for user registration and response handling
import userModel from '../models/user.model.js';
import * as userService from "../services/user.service.js";
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';
import { isDatabaseConnected } from '../db/db.js';


export const createUserController = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    // Check database connection
    if (!isDatabaseConnected()) {
        return res.status(503).json({ 
            success: false, 
            message: "Database connection failed" 
        });
    }

    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();
        delete user._doc.password; // Remove password from user object before sending response
        res.status(201).json({ success: true, user, token });
    }
    catch (error) {
        console.error('User creation error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Failed to create user" 
        });
    }
}

export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check database connection
    if (!isDatabaseConnected()) {
        return res.status(503).json({ 
            success: false, 
            message: "Database connection failed" 
        });
    }

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Credentials" 
            });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Credentials" 
            });
        }
        const token = await user.generateJWT();
        delete user._doc.password; // Remove password from user object before sending response
        res.status(200).json({ success: true, user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Login failed" 
        });
    }
}

export const ProfileController = async (req, res) => {
    // Check database connection
    if (!isDatabaseConnected()) {
        return res.status(503).json({ 
            success: false, 
            message: "Database connection failed" 
        });
    }

    console.log(req.user);
    res.status(200).json({
        success: true,
        user: req.user
    })
}

export const logoutController = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24); // Store token in Redis with 24 hour expiration
        res.status(200).json({ 
            success: true, 
            message: "Logged out successfully" 
        });
        
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
}

export const getAllUsersController = async (req, res) => {
    // Check database connection
    if (!isDatabaseConnected()) {
        return res.status(503).json({ 
            success: false, 
            message: "Database connection failed" 
        });
    }

    try {
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            success: true,
            users: allUsers
        })

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch users" 
        });
    }
}