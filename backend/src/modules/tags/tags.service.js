const repository = require('./tags.repository');
const linksRepository = require('../links/links.repository');
const auditLogsService = require('../audit-logs/audit-logs.service');

async function getOrCreateTag(label) {
  if (!label) return { code: '0000', label: '' };

  const cleanLabel = label.trim().toLowerCase();
  if (cleanLabel === '') {
    return { code: '0000', label: '' };
  }

  const registry = repository.getTagRegistry();

  // Check if tag already exists in registry
  const existing = registry.find(
    (t) => t.label.toLowerCase() === cleanLabel
  );
  if (existing) {
    return existing;
  }

  // Find next code in sequence (excluding 0000)
  const numericCodes = registry
    .map((t) => parseInt(t.code, 10))
    .filter((code) => !isNaN(code) && code > 0);

  let nextNum = 1;
  if (numericCodes.length > 0) {
    nextNum = Math.max(...numericCodes) + 1;
  }

  // Format code to 4 digits, e.g., "0001"
  const nextCode = String(nextNum).padStart(4, '0');

  const newTag = {
    code: nextCode,
    label: cleanLabel,
  };

  const saved = repository.saveTag(newTag);
  auditLogsService.createAuditLog('CREATE_TAG', `Tag '${newTag.label}' (${newTag.code}) was created.`).catch(console.error);
  return saved;
}

async function getAllTags() {
  const registry = repository.getTagRegistry();
  const defaultTag = { code: '0000', label: 'untagged' };
  const hasDefault = registry.some(t => t.code === '0000');
  if (!hasDefault) {
    return [defaultTag, ...registry];
  }
  return registry;
}

async function editTag(code, label) {
  const cleanLabel = label.trim().toLowerCase();
  if (!cleanLabel) {
    throw new Error('Tag label cannot be empty');
  }
  const regex = /^[a-z][a-z0-9\s]*$/;
  if (!regex.test(cleanLabel)) {
    throw new Error('Tag label must start with a letter and contain only lowercase letters, numbers, or spaces.');
  }
  const registry = repository.getTagRegistry();
  const exists = registry.some(t => t.label.toLowerCase() === cleanLabel && t.code !== code);
  if (exists) {
    throw new Error('This tag name already exists');
  }
  const updated = repository.updateTag(code, { label: cleanLabel });
  if (!updated) {
    throw new Error('Tag not found');
  }
  auditLogsService.createAuditLog('UPDATE_TAG', `Tag '${code}' was renamed to '${cleanLabel}'.`).catch(console.error);
  return updated;
}

async function removeTag(code) {
  const links = linksRepository.getLinks();
  const isUsed = links.some(l => {
    if (l.primaryTag === code) return true;
    if (l.tags && l.tags.some(t => t.code === code)) return true;
    return false;
  });
  if (isUsed) {
    throw new Error('Cannot delete tag that is actively used by archived links');
  }

  const success = repository.deleteTag(code);
  if (!success) {
    throw new Error('Tag not found');
  }
  auditLogsService.createAuditLog('DELETE_TAG', `Tag '${code}' was deleted.`).catch(console.error);
  return true;
}

module.exports = {
  getOrCreateTag,
  getAllTags,
  editTag,
  removeTag
};
