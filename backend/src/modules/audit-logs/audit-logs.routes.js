const express = require('express');
const router = express.Router();
const controller = require('./audit-logs.controller');

router.get('/', controller.listAuditLogs);

module.exports = router;
