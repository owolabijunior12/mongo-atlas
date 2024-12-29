import express from 'express';
import {createUser, getUsers, home, loginUser} from '../controllers/userController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', home);
router.post('/register', createUser);
// router.post('/login', loginUser);


export default router;