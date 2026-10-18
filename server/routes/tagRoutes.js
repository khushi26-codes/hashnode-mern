const router = require('express').Router();
const controller = require('../controllers/tagController');
router.get('/', controller.listTags);
router.get('/:slug/posts', controller.postsByTag);
module.exports = router;
