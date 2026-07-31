const service = require('./sources.service');

async function listSources(req, res) {
  try {
    const sources = await service.getAllSources();
    return res.status(200).json({ success: true, data: sources });
  } catch (error) {
    console.error('listSources error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

async function addSource(req, res) {
  try {
    const { name, code, url } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, error: 'Source name and code are required' });
    }
    const created = await service.createSource(name, code, url || '');
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

async function editSourceCode(req, res) {
  try {
    const { oldCode } = req.params;
    const { newCode } = req.body;
    if (!newCode) {
      return res.status(400).json({ success: false, error: 'New source code is required' });
    }

    const updated = await service.updateSourceCode(oldCode, newCode.trim().toLowerCase());
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

async function removeSource(req, res) {
  try {
    const { code } = req.params;
    await service.deleteSource(code);
    return res.status(200).json({ success: true, message: 'Source deleted successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  listSources,
  editSourceCode,
  addSource,
  removeSource,
};
