const router = require('express').Router();
const controller = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.get('/:id', controller.getPublicProfile);
router.put('/me', protect, controller.updateMyProfile);
module.exports = router;
