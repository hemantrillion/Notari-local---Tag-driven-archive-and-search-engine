const db = require('../../shared/db');

function getLinks() {
  const data = db.readDb();
  return data.links || [];
}

function saveLink(link) {
  const data = db.readDb();
  data.links = data.links || [];
  data.links.push(link);
  db.writeDb(data);
  return link;
}

function updateLink(id, updatedFields) {
  const data = db.readDb();
  data.links = data.links || [];
  const idx = data.links.findIndex((l) => l.id === id);
  if (idx === -1) return null;

  data.links[idx] = {
    ...data.links[idx],
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  };

  db.writeDb(data);
  return data.links[idx];
}

function deleteLink(id) {
  const data = db.readDb();
  data.links = data.links || [];
  const filtered = data.links.filter((l) => l.id !== id);
  const deleted = data.links.length !== filtered.length;
  data.links = filtered;
  db.writeDb(data);
  return deleted;
}

module.exports = {
  getLinks,
  saveLink,
  updateLink,
  deleteLink,
};
