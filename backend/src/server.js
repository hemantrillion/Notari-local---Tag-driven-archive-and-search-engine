const express = require('express');
const cors = require('cors');
const linksRouter = require('./modules/links/links.routes');
const auditLogsRouter = require('./modules/audit-logs/audit-logs.routes');
const searchRouter = require('./modules/search/search.routes');
const proxyRouter = require('./modules/proxy/proxy.routes');
const youtubeRouter = require('./modules/youtube/youtube.routes');
const tagsRouter = require('./modules/tags/tags.routes');
const sourcesRouter = require('./modules/sources/sources.routes');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount modular routers
app.use('/api/links', linksRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/search', searchRouter);
app.use('/api/proxy', proxyRouter);
app.use('/api/youtube', youtubeRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/sources', sourcesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
