const express = require('express');
const controller = require('./links.controller');

const router = express.Router();

router.get('/', controller.listLinks);
router.post('/', controller.saveLink);
router.put('/:id', controller.modifyLink);
router.delete('/:id', controller.removeLink);

module.exports = router;
