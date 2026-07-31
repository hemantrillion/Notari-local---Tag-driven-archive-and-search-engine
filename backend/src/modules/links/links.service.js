const { randomUUID } = require('crypto');
const repository = require('./links.repository');
const tagsService = require('../tags/tags.service');
const db = require('../../shared/db');
const auditLogsService = require('../audit-logs/audit-logs.service');

function sanitizeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'igsh', 'si', 'fbclid', 'gclid', 'ref', 'feature'
    ];
    trackingParams.forEach(param => url.searchParams.delete(param));
    return url.toString();
  } catch (e) {
    return rawUrl; // Fallback
  }
}

function generateDateParts() {
  const d = new Date();
  const DD = String(d.getDate()).padStart(2, '0');
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const YY = String(d.getFullYear()).slice(-2);
  return { DD, MMYY: `${MM}${YY}` };
}

function parseUrlHeuristics(url) {
  const data = repository.getLinks ? db.readDb() : { sourceRegistry: [] };
  const sources = data.sourceRegistry || [];
  
  const getCode = (name, fallback) => {
    const found = sources.find(s => s.name === name);
    return found ? found.code : fallback;
  };

  const ytbCode = getCode('youtube', 'ytb');
  const insCode = getCode('instagram', 'ins');
  const gfgCode = getCode('geeksforgeeks', 'gfg');
  const gitCode = getCode('github', 'git');
  const webCode = getCode('web', 'web');

  let sourceCode = webCode;
  let typeCode = 'doc'; // Default to document/generic

  const urlLower = url.toLowerCase();

  // 1. Detect Source (iterating registered patterns)
  for (const src of sources) {
    if (src.url && urlLower.includes(src.url.toLowerCase())) {
      sourceCode = src.code;
      break;
    }
  }
  
  // Specific alias overrides
  if (sourceCode === webCode) {
    if (urlLower.includes('youtu.be')) {
      sourceCode = ytbCode;
    } else if (urlLower.includes('instagr.am')) {
      sourceCode = insCode;
    }
  }

  // 2. Detect Type Heuristics (YouTube & Instagram specifics)
  if (sourceCode === ytbCode) {
    if (urlLower.includes('/post/') || urlLower.includes('/community') || urlLower.includes('image')) {
      typeCode = 'img';
    } else {
      typeCode = 'vid';
    }
  } else if (sourceCode === insCode) {
    if (urlLower.includes('/reel/') || urlLower.includes('/reels/') || urlLower.includes('/tv/')) {
      typeCode = 'vid';
    } else {
      typeCode = 'img';
    }
  } else {
    if (
      urlLower.includes('video') ||
      urlLower.includes('reel') ||
      urlLower.includes('/shorts/') ||
      urlLower.match(/\.(mp4|mkv|webm|avi)$/)
    ) {
      typeCode = 'vid';
    } else if (urlLower.includes('image') || urlLower.match(/\.(jpeg|jpg|png|gif|webp)$/)) {
      typeCode = 'img';
    }
  }

  return { sourceCode, typeCode };
}

function mapSourceToName(sourceCode) {
  const data = db.readDb();
  const sources = data.sourceRegistry || [];
  const found = sources.find(s => s.code === sourceCode.toLowerCase());
  return found ? found.name : sourceCode;
}

// Compute the sequential ID: source-type-tag-day-monthYear-suffix
function computeUniqueReadableCode(
  sourceCode,
  tagCode,
  typeCode,
  existingLinks
) {
  const { DD, MMYY } = generateDateParts();

  // Find all links created on this specific day to calculate the next sequence number (suffix)
  const sameDayLinks = existingLinks.filter(l => {
    const parts = l.readableCode.split('-');
    if (parts.length >= 6) {
      return parts[3] === DD && parts[4] === MMYY;
    }
    return false;
  });

  const nextIndex = sameDayLinks.length;
  const suffix = String(nextIndex).padStart(3, '0');

  return `${sourceCode.toLowerCase()}-${typeCode.toLowerCase()}-${tagCode}-${DD}-${MMYY}-${suffix}`;
}

async function createLink({ url, source, type, primaryTagLabel }) {
  const cleanedUrl = sanitizeUrl(url);
  const heuristics = parseUrlHeuristics(cleanedUrl);

  const resolvedSource = source || heuristics.sourceCode;
  const resolvedType = type || heuristics.typeCode;

  // Tag Later always defaults to code '0000'
  const tag = await tagsService.getOrCreateTag(primaryTagLabel || '');
  const existingLinks = repository.getLinks();
  
  const readableCode = computeUniqueReadableCode(
    resolvedSource,
    tag.code,
    resolvedType,
    existingLinks
  );

  const newLink = {
    id: randomUUID(),
    url: cleanedUrl,
    readableCode,
    sourceCode: resolvedSource,
    typeCode: resolvedType,
    primaryTag: tag.code,
    tagLabel: tag.label,
    tags: tag.code === '0000' ? [] : [{ code: tag.code, label: tag.label }],
    from: mapSourceToName(resolvedSource),
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const saved = repository.saveLink(newLink);
  auditLogsService.createAuditLog(
    'CREATE_LINK', 
    `Link '${newLink.title || 'Untitled Page'}' (${newLink.url}) was shared.`
  ).catch(console.error);
  return saved;
}

async function updateLink(id, { url, source, type, primaryTagLabel, readableCode, notes, title, tags, styleSettings }) {
  const existingLinks = repository.getLinks();
  const current = existingLinks.find((l) => l.id === id);
  if (!current) {
    throw new Error('Link not found');
  }

  const updatedFields = {
    updatedAt: new Date().toISOString()
  };

  if (title !== undefined) {
    updatedFields.title = title;
  }

  // 1. Manual readableCode update & format validation
  if (readableCode !== undefined) {
    const regex = /^[a-z]{3}-[a-z]{3}-[a-z0-9]{4}-\d{2}-\d{4}-\d{3}$/;
    if (!regex.test(readableCode)) {
      throw new Error('Cannot be tagged');
    }
    
    // Sync components from the manual URL ID
    const parts = readableCode.split('-');
    const tagCode = parts[2];
    
    // Check if tag code exists in registry (unless 0000)
    const tagsList = await tagsService.getAllTags();
    const matchedTag = tagsList.find((t) => t.code === tagCode);
    if (!matchedTag && tagCode !== '0000') {
      throw new Error('Cannot be tagged');
    }

    updatedFields.readableCode = readableCode;
    updatedFields.sourceCode = parts[0];
    updatedFields.typeCode = parts[1];
    updatedFields.primaryTag = tagCode;
    updatedFields.tagLabel = tagCode === '0000' ? '' : matchedTag.label;
    updatedFields.tags = tagCode === '0000' ? [] : [{ code: tagCode, label: matchedTag.label }];
    updatedFields.from = mapSourceToName(parts[0]);
  }

  if (tags !== undefined) {
    updatedFields.tags = tags;
    const firstTag = tags.length > 0 ? tags[0] : { code: '0000', label: '' };
    updatedFields.primaryTag = firstTag.code;
    updatedFields.tagLabel = firstTag.code === '0000' ? '' : firstTag.label;
    
    // Update readableCode tag code portion only if manual code is not provided
    if (readableCode === undefined) {
      const parts = current.readableCode.split('-');
      if (parts.length >= 6) {
        parts[2] = firstTag.code;
        updatedFields.readableCode = parts.join('-');
      }
    }
  }

  if (notes !== undefined) {
    updatedFields.notes = notes;
  }

  if (styleSettings !== undefined) {
    updatedFields.styleSettings = styleSettings;
  }

  if (url !== undefined) {
    updatedFields.url = sanitizeUrl(url);
  }

  // 2. Automated updates if individual fields changed (and no manual readableCode was provided)
  if (readableCode === undefined) {
    let tagCode = current.primaryTag;
    let tagLabel = current.tagLabel;
    
    if (primaryTagLabel !== undefined) {
      const cleanLabel = primaryTagLabel.trim().toLowerCase();
      if (cleanLabel === '' || cleanLabel === 'untagged') {
        tagCode = '0000';
        tagLabel = '';
      } else {
        const regex = /^[a-z][a-z0-9\s]*$/;
        if (!regex.test(cleanLabel)) {
          throw new Error('Cannot be tagged');
        }
        const tag = await tagsService.getOrCreateTag(cleanLabel);
        tagCode = tag.code;
        tagLabel = tag.label;
      }
      updatedFields.primaryTag = tagCode;
      updatedFields.tagLabel = tagLabel;
    }

    if (source !== undefined) {
      updatedFields.sourceCode = source.toLowerCase();
      updatedFields.from = mapSourceToName(source.toLowerCase());
    }

    if (type !== undefined) {
      updatedFields.typeCode = type.toLowerCase();
    }

    if (source !== undefined || type !== undefined || primaryTagLabel !== undefined) {
      const parts = current.readableCode.split('-');
      if (parts.length >= 6) {
        const finalSource = source || current.sourceCode;
        const finalType = type || current.typeCode;
        const finalTag = tagCode;
        const DD = parts[3];
        const MMYY = parts[4];
        const suffix = parts[5];
        updatedFields.readableCode = `${finalSource.toLowerCase()}-${finalType.toLowerCase()}-${finalTag}-${DD}-${MMYY}-${suffix}`;
      }
    }
  }

  const updated = repository.updateLink(id, updatedFields);
  auditLogsService.createAuditLog(
    'UPDATE_LINK',
    `Link '${updated.title || 'Untitled'}' (${updated.url}) was updated. Fields changed: ${Object.keys(updatedFields).filter(k => k !== 'updatedAt').join(', ')}`
  ).catch(console.error);
  return updated;
}

async function getAllLinks() {
  return repository.getLinks();
}

async function deleteLink(id) {
  const existingLinks = repository.getLinks();
  const current = existingLinks.find((l) => l.id === id);
  if (!current) throw new Error('Link not found');

  const success = repository.deleteLink(id);
  if (!success) throw new Error('Link not found');
  
  auditLogsService.createAuditLog(
    'DELETE_LINK',
    `Link '${current.title || 'Untitled'}' (${current.url}) was deleted.`
  ).catch(console.error);
  return true;
}

module.exports = {
  createLink,
  updateLink,
  getAllLinks,
  deleteLink,
};
