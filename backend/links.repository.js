const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const DATA_FILE = path.join(__dirname, 'links.json');

// Helper to read data from the local JSON file
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Helper to write data back to the local JSON file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateDateStr() {
  const d = new Date();
  const DD = String(d.getDate()).padStart(2, '0');
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const YY = String(d.getFullYear()).slice(-2);
  return `${DD}${MM}${YY}`;
}

async function createLink({ url, sourceCode, typeCode, primaryTag }) {
  const links = readData();
  const dateStr = generateDateStr();
  const baseCode = `${sourceCode.toLowerCase()}-${primaryTag || '0000'}-${typeCode.toLowerCase()}-${dateStr}`;

  // Check for same-day duplicates starting with the baseCode
  const existingCodes = links.map(l => l.readableCode);

  let finalCode = baseCode;
  if (existingCodes.includes(baseCode)) {
    let counter = 1;
    while (existingCodes.includes(`${baseCode}-${counter}`)) {
      counter++;
    }
    finalCode = `${baseCode}-${counter}`;
  }

  const newLink = {
    id: randomUUID(),
    url,
    readableCode: finalCode,
    sourceCode: sourceCode.toLowerCase(),
    typeCode: typeCode.toLowerCase(),
    primaryTag: primaryTag || '0000',
    createdAt: new Date().toISOString()
  };

  links.push(newLink);
  writeData(links);
  return newLink;
}

async function getAllLinks() {
  const links = readData();
  // Return sorted by newest first
  return [...links].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function deleteLink(id) {
  const links = readData();
  const filtered = links.filter(l => l.id !== id);
  if (links.length === filtered.length) {
    throw new Error('Link not found');
  }
  writeData(filtered);
  return true;
}

module.exports = {
  createLink,
  getAllLinks,
  deleteLink
};
