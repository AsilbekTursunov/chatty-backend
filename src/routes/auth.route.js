import express from 'express';
import { loginUser, logoutUser, onboard, registerUser } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { userDetails } from '../lib/index.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.post('/onboarding', protectRoute, onboard);

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: userDetails(req.user),
  });
});

export default router;