const service = require('./audit-logs.service');

async function listAuditLogs(req, res) {
  try {
    const logs = await service.getAuditLogs();
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('listAuditLogs controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
}

module.exports = {
  listAuditLogs
};
