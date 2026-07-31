const express = require('express');
const router = express.Router();
const controller = require('./tags.controller');

router.get('/', controller.listTags);
router.post('/', controller.createTag);
router.put('/:code', controller.modifyTag);
router.delete('/:code', controller.deleteTag);

module.exports = router;
