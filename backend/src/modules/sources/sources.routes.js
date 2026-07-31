const express = require('express');
const router = express.Router();
const controller = require('./sources.controller');

router.get('/', controller.listSources);
router.post('/', controller.addSource);
router.put('/:oldCode', controller.editSourceCode);
router.delete('/:code', controller.removeSource);

module.exports = router;
