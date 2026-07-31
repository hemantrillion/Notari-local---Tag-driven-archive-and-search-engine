const db = require('../../shared/db');

async function createAuditLog(action, details) {
  const data = db.readDb();
  if (!data.auditLogs) {
    data.auditLogs = [];
  }
  const newLog = {
    id: 'log-' + Math.random().toString(36).substr(2, 9),
    action,
    details,
    timestamp: new Date().toISOString()
  };
  data.auditLogs.unshift(newLog);
  db.writeDb(data);
  return newLog;
}

async function getAuditLogs() {
  const data = db.readDb();
  return data.auditLogs || [];
}

module.exports = {
  createAuditLog,
  getAuditLogs
};
