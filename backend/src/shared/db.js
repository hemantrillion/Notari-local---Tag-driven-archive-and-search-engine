const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../links.json');

function readDb() {
  const defaultSources = [
    { code: "ytb", name: "youtube", url: "youtube.com" },
    { code: "ins", name: "instagram", url: "instagram.com" },
    { code: "gfg", name: "geeksforgeeks", url: "geeksforgeeks.org" },
    { code: "git", name: "github", url: "github.com" },
    { code: "web", name: "web", url: "" }
  ];

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ links: [], tagRegistry: [], sourceRegistry: defaultSources, auditLogs: [] }, null, 2)
    );
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { links: parsed, tagRegistry: [], sourceRegistry: defaultSources, auditLogs: [] };
    }
    if (!parsed.auditLogs) {
      parsed.auditLogs = [];
    }
    if (!parsed.sourceRegistry) {
      parsed.sourceRegistry = defaultSources;
      fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2));
    } else {
      let updated = false;
      parsed.sourceRegistry.forEach(s => {
        if (s.url === undefined) {
          const match = defaultSources.find(ds => ds.code === s.code);
          s.url = match ? match.url : "";
          updated = true;
        }
      });
      if (updated) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2));
      }
    }
    return parsed;
  } catch (e) {
    return { links: [], tagRegistry: [], sourceRegistry: defaultSources };
  }
}

function writeDb(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  readDb,
  writeDb,
};
