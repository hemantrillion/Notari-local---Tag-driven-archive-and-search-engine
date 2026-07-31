const linksRepository = require('../links/links.repository');

async function searchLinks(query) {
  if (!query || query.trim() === '') {
    return [];
  }

  const cleanQuery = query.trim().toLowerCase();
  const groups = cleanQuery.split(/[|,]/).map(g => g.trim()).filter(Boolean);
  if (groups.length === 0) return [];

  const links = linksRepository.getLinks().filter(l => l.primaryTag !== '0000');

  const results = [];
  for (const link of links) {
    let satisfiesAllGroups = true;
    let totalScore = 0;

    const urlLower = link.url.toLowerCase();
    const sourceLower = (link.sourceCode || '').toLowerCase();
    const typeLower = (link.typeCode || '').toLowerCase();
    const readableCodeLower = link.readableCode.toLowerCase();

    const labelsToCheck = [];
    if (link.tagLabel) labelsToCheck.push(link.tagLabel.toLowerCase());
    if (link.tags && link.tags.length > 0) {
      link.tags.forEach(t => {
        if (t.label) labelsToCheck.push(t.label.toLowerCase());
      });
    }

    for (const group of groups) {
      let groupMatched = false;
      let groupScore = 0;

      let hasTagMatch = false;
      let hasExactTagBonus = false;

      labelsToCheck.forEach(lbl => {
        if (lbl.includes(group)) {
          hasTagMatch = true;
          if (lbl === group) {
            hasExactTagBonus = true;
          }
        }
      });

      if (hasTagMatch) {
        groupMatched = true;
        groupScore += 10;
        if (hasExactTagBonus) {
          groupScore += 5;
        }
      }

      if (readableCodeLower.includes(group)) {
        groupMatched = true;
        groupScore += 5;
      }

      if (sourceLower.includes(group)) {
        groupMatched = true;
        groupScore += 3;
      }

      if (typeLower.includes(group)) {
        groupMatched = true;
        groupScore += 3;
      }

      if (urlLower.includes(group)) {
        groupMatched = true;
        groupScore += 1;
      }

      if (!groupMatched) {
        satisfiesAllGroups = false;
        break;
      } else {
        totalScore += groupScore;
      }
    }

    if (satisfiesAllGroups) {
      results.push({ link, score: totalScore });
    }
  }

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.link.createdAt) - new Date(a.link.createdAt);
    })
    .map((r) => r.link);
}

module.exports = {
  searchLinks,
};
