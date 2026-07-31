const service = require('./search.service');

async function executeSearch(req, res) {
  try {
    const { q } = req.query;
    const results = await service.searchLinks(q);
    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('executeSearch controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}

module.exports = {
  executeSearch,
};
