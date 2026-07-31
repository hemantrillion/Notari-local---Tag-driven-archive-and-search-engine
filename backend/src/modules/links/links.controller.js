const service = require('./links.service');

async function listLinks(req, res) {
  try {
    const links = await service.getAllLinks();
    return res.status(200).json({ success: true, data: links });
  } catch (error) {
    console.error('listLinks controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}

async function saveLink(req, res) {
  try {
    const { url, source, type, primaryTagLabel } = req.body;
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
      });
    }
    const link = await service.createLink({
      url,
      source,
      type,
      primaryTagLabel,
    });
    return res.status(201).json({ success: true, data: link });
  } catch (error) {
    console.error('saveLink controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

async function modifyLink(req, res) {
  try {
    const { id } = req.params;
    const { url, source, type, primaryTagLabel, readableCode, notes, title, tags, styleSettings } = req.body;
    const updated = await service.updateLink(id, {
      url,
      source,
      type,
      primaryTagLabel,
      readableCode,
      notes,
      title,
      tags,
      styleSettings
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('modifyLink controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

async function removeLink(req, res) {
  try {
    const { id } = req.params;
    await service.deleteLink(id);
    return res.status(200).json({
      success: true,
      message: 'Link deleted successfully',
    });
  } catch (error) {
    console.error('removeLink controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

module.exports = {
  listLinks,
  saveLink,
  modifyLink,
  removeLink,
};
