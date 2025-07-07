import express from 'express'; 
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendFriendRequest, getMyFriends, getRecommendedUsers, acceptFriendRequest, getFriendRequests, getOngoingFriendRequest } from '../controllers/users.controller.js';

const router = express.Router();

router.use(protectRoute); // Protect all routes in this router

router.get('/recommended', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-request", getFriendRequests)
router.get("/ongoing-friend-request", getOngoingFriendRequest);
export default router;