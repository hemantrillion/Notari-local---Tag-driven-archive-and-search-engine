const db = require('../../shared/db');
const auditLogsService = require('../audit-logs/audit-logs.service');

async function getAllSources() {
  const data = db.readDb();
  return data.sourceRegistry || [];
}

async function updateSourceCode(oldCode, newCode) {
  const data = db.readDb();
  data.sourceRegistry = data.sourceRegistry || [];

  // Validate format of new code (strictly 3 lowercase letters)
  const regex = /^[a-z]{3}$/;
  if (!regex.test(newCode)) {
    throw new Error('Source code must be exactly 3 lowercase letters');
  }

  // Check if new code conflicts with another source
  const conflict = data.sourceRegistry.find(s => s.code === newCode && s.code !== oldCode);
  if (conflict) {
    throw new Error('Source code already exists');
  }

  // Check if any links are currently using this source code
  const links = data.links || [];
  const inUse = links.some(l => l.sourceCode === oldCode);
  if (inUse) {
    throw new Error('Cannot edit: This source code is currently in use by archived links.');
  }

  // Update code in registry
  const source = data.sourceRegistry.find(s => s.code === oldCode);
  if (!source) {
    throw new Error('Source not found');
  }

  source.code = newCode;
  db.writeDb(data);
  auditLogsService.createAuditLog('UPDATE_SOURCE', `Source code '${oldCode}' was updated to '${newCode}'.`).catch(console.error);
  return source;
}

async function createSource(name, code, url) {
  const data = db.readDb();
  data.sourceRegistry = data.sourceRegistry || [];

  const cleanName = name.trim().toLowerCase();
  const cleanCode = code.trim().toLowerCase();
  const cleanUrl = url.trim().toLowerCase();

  // Validate code (exactly 3 lowercase letters)
  const codeRegex = /^[a-z]{3}$/;
  if (!codeRegex.test(cleanCode)) {
    throw new Error('Source code must be exactly 3 lowercase letters');
  }

  // Validate name (starts with letter, lowercase letters, numbers, spaces)
  const nameRegex = /^[a-z][a-z0-9\s]*$/;
  if (!nameRegex.test(cleanName)) {
    throw new Error('Source name must start with a letter and contain only lowercase letters, numbers, or spaces');
  }

  // Duplicate checks
  if (data.sourceRegistry.some(s => s.code === cleanCode)) {
    throw new Error('Source code already exists');
  }
  if (data.sourceRegistry.some(s => s.name === cleanName)) {
    throw new Error('Source name already exists');
  }
  if (cleanUrl && data.sourceRegistry.some(s => s.url === cleanUrl)) {
    throw new Error('Source URL/Domain pattern already exists');
  }

  const newSource = { name: cleanName, code: cleanCode, url: cleanUrl };
  data.sourceRegistry.push(newSource);
  db.writeDb(data);
  auditLogsService.createAuditLog('CREATE_SOURCE', `Source '${cleanName}' (${cleanCode}) was registered.`).catch(console.error);
  return newSource;
}

async function deleteSource(code) {
  const data = db.readDb();
  data.sourceRegistry = data.sourceRegistry || [];

  // Check if in use
  const links = data.links || [];
  const inUse = links.some(l => l.sourceCode === code);
  if (inUse) {
    throw new Error('Cannot delete: This source is currently in use by archived links.');
  }

  const index = data.sourceRegistry.findIndex(s => s.code === code);
  if (index === -1) {
    throw new Error('Source not found');
  }

  const source = data.sourceRegistry[index];
  data.sourceRegistry.splice(index, 1);
  db.writeDb(data);
  auditLogsService.createAuditLog('DELETE_SOURCE', `Source '${source.name}' (${code}) was deleted.`).catch(console.error);
  return true;
}

module.exports = {
  getAllSources,
  updateSourceCode,
  createSource,
  deleteSource,
};
