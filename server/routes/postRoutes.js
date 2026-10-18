const router = require('express').Router();
const controller = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', controller.listPublished);
router.get('/mine', protect, controller.getMine);
router.get('/:slug', controller.getPublishedBySlug);
router.post('/', protect, controller.createPost);
router.put('/:id', protect, controller.updatePost);
router.delete('/:id', protect, controller.deletePost);
module.exports = router;
