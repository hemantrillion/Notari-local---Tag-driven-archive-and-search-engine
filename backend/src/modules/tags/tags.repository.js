const db = require('../../shared/db');

function getTagRegistry() {
  const data = db.readDb();
  return data.tagRegistry || [];
}

function saveTag(tag) {
  const data = db.readDb();
  data.tagRegistry = data.tagRegistry || [];
  data.tagRegistry.push(tag);
  db.writeDb(data);
  return tag;
}

function deleteTag(code) {
  const data = db.readDb();
  data.tagRegistry = data.tagRegistry || [];
  const index = data.tagRegistry.findIndex(t => t.code === code);
  if (index !== -1) {
    data.tagRegistry.splice(index, 1);
    db.writeDb(data);
    return true;
  }
  return false;
}

function updateTag(code, updatedFields) {
  const data = db.readDb();
  data.tagRegistry = data.tagRegistry || [];
  const tag = data.tagRegistry.find(t => t.code === code);
  if (tag) {
    Object.assign(tag, updatedFields);
    db.writeDb(data);
    return tag;
  }
  return null;
}

module.exports = {
  getTagRegistry,
  saveTag,
  deleteTag,
  updateTag
};
