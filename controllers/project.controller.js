import Project from "../models/project.model.js";
import * as projectservice from "../services/project.service.js";
import { validationResult } from "express-validator";
import usermodel from "../models/user.model.js";

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try {
        const { name } = req.body;
        const loggedInUser = await usermodel.findOne({ email: req.user.email });

        const userID = loggedInUser._id;

        const newProject = await projectservice.createProject({ name, userId: userID });
        res.status(201).json({
            message: "Project created successfully",
            project: newProject
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const loggedInUser = await usermodel.findOne({
            email: req.user.email
        });

        const allUserProjects = await projectservice.getAllProjects({
            userId: loggedInUser._id
        });

        return res.status(200).json({
            message: "Projects fetched successfully",
            projects: allUserProjects
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error" });
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
            // message: "User added to project successfully",
            project: project,
            users: users,
            message: `${users.length} user(s) added to project successfully`
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" });

    }
}

export const getProjectById = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await projectservice.getProjectById({ projectId });
        return res.status(200).json({
            project: project
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
}
