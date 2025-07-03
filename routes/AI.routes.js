import {Router} from 'express';
import * as Aicontroller from '../controllers/AI.controller.js';
const router = Router(
);


router.get('/get-result', Aicontroller.generateResult);

export default router;