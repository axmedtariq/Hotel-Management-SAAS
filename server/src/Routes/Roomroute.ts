import express from 'express';
import { 
    getAllRooms, 
    createRoom, 
    simulateSpike, 
    resetMarket 
} from '../controller/roomcontroller.ts'; 
import { authorize } from '../middleware/auth.ts';

const router = express.Router();

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms (Public - No login required)
 */
router.get('/', getAllRooms);

/**
 * @route   POST /api/rooms
 * @desc    Create a new room (Protected - Admin only)
 */
router.post('/', authorize(['admin']), createRoom);

/**
 * @route   POST /api/rooms/simulate-spike
 * @desc    AI Price Update (Protected - Admin or Receptionist)
 */
router.post('/simulate-spike', authorize(['admin', 'receptionist']), simulateSpike);

/**
 * @route   POST /api/rooms/reset
 * @desc    Market Reset (Protected - Admin only)
 */
router.post('/reset', authorize(['admin']), resetMarket);

export default router;