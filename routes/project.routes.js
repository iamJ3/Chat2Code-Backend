import { Router } from 'express';
import { body } from 'express-validator';
import * as authmiddleware from '../middleware/auth.middleware.js';
import * as projectcontroller from '../controllers/project.controller.js';

const router = Router();
router.post('/create',
    authmiddleware.authUser,
    body('name').isString().withMessage('Name is required'),
    projectcontroller.createProject
)

router.get('/all',
    authmiddleware.authUser,
    projectcontroller.getAllProjects
);

router.put('/add-user',
    authmiddleware.authUser,
    body('projectId').isString().withMessage('ProjectId is required'),
    body('users').isArray({ min: 1 }).withMessage('At least one user ID is required').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('All user IDs must be strings'),
    projectcontroller.addUserToProject
);

router.get('/get-project/:projectId',authmiddleware.authUser, projectcontroller.getProjectById);
export default router;