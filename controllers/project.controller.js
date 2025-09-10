import Project from "../models/project.model.js";
import * as projectservice from "../services/project.service.js";
import { validationResult } from "express-validator";
import usermodel from "../models/user.model.js";
import { isDatabaseConnected } from '../db/db.js';

export const createProject = async (req, res) => {
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
        const { name } = req.body;
        const loggedInUser = await usermodel.findOne({ email: req.user.email });

        const userID = loggedInUser._id;

        const newProject = await projectservice.createProject({ name, userId: userID });
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project: newProject
        });

    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
}

export const getAllProjects = async (req, res) => {
    // Check database connection
    if (!isDatabaseConnected()) {
        return res.status(503).json({ 
            success: false, 
            message: "Database connection failed" 
        });
    }

    try {
        const loggedInUser = await usermodel.findOne({
            email: req.user.email
        });

        const allUserProjects = await projectservice.getAllProjects({
            userId: loggedInUser._id
        });

        return res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            projects: allUserProjects
        });
    } catch (error) {
        console.error('Get all projects error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
}

export const addUserToProject = async (req, res) => {
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
        const { projectId, users } = req.body;
        const loggedInUser = await usermodel.findOne({
            email: req.user.email
        })
        const project = await projectservice.addUserToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })
        return res.status(200).json({
            success: true,
            project: project,
            users: users,
            message: `${users.length} user(s) added to project successfully`
        })
    } catch (error) {
        console.error('Add user to project error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
}

export const getProjectById = async (req, res) => {
    const { projectId } = req.params;
    
    // Check database connection
    if (!isDatabaseConnected()) {
        return res.status(503).json({ 
            success: false, 
            message: "Database connection failed" 
        });
    }

    try {
        const project = await projectservice.getProjectById({ projectId });
        return res.status(200).json({
            success: true,
            project: project
        });
    }
    catch (error) {
        console.error('Get project by ID error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
}
