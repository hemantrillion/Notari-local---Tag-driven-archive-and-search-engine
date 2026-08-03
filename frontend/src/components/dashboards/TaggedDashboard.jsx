import React from 'react';

export default function TaggedDashboard({
  taggedLinks,
  formatDate,
  formatTime,
  copiedLinkId,
  setCopiedLinkId,
  setActiveEditLinkId,
  handleDeleteLink,
  setActiveViewLink,
  setDetailMode,
  setActivePlayerLink
}) {
  return (
    <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      <div style={{ overflowX: 'auto', flex: 1 }}>
        {taggedLinks.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>
            No tagged records found.
          </div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>URL ID</th>
                <th>Heading</th>
                <th>Clean URL</th>
                <th>Tag</th>
                <th>Date Added</th>
                <th>Time Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {taggedLinks.map((link) => (
                <tr key={link.id}>
                  <td>
                    <div 
                      style={{ fontWeight: 'bold', fontFamily: 'monospace', cursor: 'pointer', color: 'var(--accent)' }}
                      onClick={() => {
                        setActiveViewLink(link);
                        setDetailMode('view');
                      }}
                      title="Click to view webpage"
                    >
                      {link.readableCode}
                    </div>
                  </td>
                  <td>
                    {(() => {
                      const titleText = link.title || 'No Title';
                      const truncatedTitle = titleText.length > 25 ? titleText.substring(0, 25) + '...' : titleText;
                      return (
                        <div 
                          className="text-hover-container" 
                          style={{ fontSize: '12px', fontWeight: '500', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                          onClick={() => {
                            setActiveViewLink(link);
                            setDetailMode('view');
                          }}
                        >
                          {truncatedTitle}
                          <div className="text-tooltip-box">
                            {titleText}
                          </div>
                        </div>
                      );
                    })()}
                  </td>
                  <td>
                    {(() => {
                      const truncatedUrl = link.url.length > 30 ? link.url.substring(0, 30) + '...' : link.url;
                      const isCopied = copiedLinkId === link.id;
                      return (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', maxWidth: '240px' }}>
                          <div className="text-hover-container" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <a 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveViewLink(link);
                                setDetailMode('view');
                              }}
                              style={{ fontSize: '12px', color: '#1a73e8', textDecoration: 'none' }}
                            >
                              {truncatedUrl}
                            </a>
                            <div className="text-tooltip-box">
                              {link.url}
                            </div>
                          </div>
                          <button
                            title={isCopied ? "Copied!" : "Copy URL"}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: isCopied ? 1 : 0.6,
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => { if (!isCopied) e.currentTarget.style.opacity = 1; }}
                            onMouseLeave={(e) => { if (!isCopied) e.currentTarget.style.opacity = 0.6; }}
                            onClick={(e) => {
                              e.preventDefault();
                              navigator.clipboard.writeText(link.url);
                              setCopiedLinkId(link.id);
                              setTimeout(() => setCopiedLinkId(null), 1500);
                            }}
                          >
                            {isCopied ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f9d58" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            )}
                          </button>
                          <button
                            title="Open Preview Player"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0.6,
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.6; }}
                            onClick={(e) => {
                              e.preventDefault();
                              setActivePlayerLink(link.url);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                        </div>
                      );
                    })()}
                  </td>
                  <td>
                    <span className="badge badge-accent">
                      {link.tags && link.tags.length > 0 ? link.tags.map(t => t.label).join(' | ') : (link.tagLabel || 'untagged')}
                    </span>
                  </td>
                  <td>{formatDate(link.createdAt)}</td>
                  <td>{formatTime(link.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        className="btn-sm"
                        onClick={() => setActiveEditLinkId(link.id)}
                      >
                        Edit Tag
                      </button>
                      <button 
                        className="btn-sm-danger"
                        onClick={(e) => handleDeleteLink(link.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
