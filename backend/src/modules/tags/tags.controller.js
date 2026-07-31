const service = require('./tags.service');

async function listTags(req, res) {
  try {
    const tags = await service.getAllTags();
    return res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error('listTags controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}

async function createTag(req, res) {
  try {
    const { label } = req.body;
    if (!label) {
      return res.status(400).json({ success: false, error: 'Tag label is required' });
    }

    const cleanLabel = label.trim().toLowerCase();
    const regex = /^[a-z][a-z0-9\s]*$/;
    if (!regex.test(cleanLabel)) {
      return res.status(400).json({
        success: false,
        error: 'Tag label must start with a letter and contain only lowercase letters, numbers, or spaces.'
      });
    }

    const tag = await service.getOrCreateTag(cleanLabel);
    return res.status(201).json({ success: true, data: tag });
  } catch (error) {
    console.error('createTag controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

async function modifyTag(req, res) {
  try {
    const { code } = req.params;
    const { label } = req.body;
    const updated = await service.editTag(code, label);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('modifyTag controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

async function deleteTag(req, res) {
  try {
    const { code } = req.params;
    await service.removeTag(code);
    return res.status(200).json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('deleteTag controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

module.exports = {
  listTags,
  createTag,
  modifyTag,
  deleteTag,
};
