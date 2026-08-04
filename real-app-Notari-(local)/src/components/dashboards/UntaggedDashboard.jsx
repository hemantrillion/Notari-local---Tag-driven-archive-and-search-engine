import React from 'react';

export default function UntaggedDashboard({
  untaggedLinks = [],
  formatDate = () => '',
  formatTime = () => '',
  setActiveEditLinkId = () => {},
  handleDeleteLink = () => {},
  setActiveViewLink = () => {},
  setDetailMode = () => {},
  onOpenManualUrlModal = () => {}
}) {
  return (
    <div id="untagged-dashboard" className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button 
          type="button"
          onClick={onOpenManualUrlModal}
          style={{ 
            padding: '6px 16px', 
            borderRadius: '20px', 
            fontSize: '13px', 
            fontWeight: 600, 
            cursor: 'pointer', 
            backgroundColor: 'transparent', 
            color: 'var(--accent, #1a73e8)', 
            border: '1px solid var(--accent, #1a73e8)' 
          }}
        >
          + Add Manual URL
        </button>
      </div>
      <div style={{ overflowX: 'auto', flex: 1 }}>
        {untaggedLinks.length === 0 ? (
          <div id="untagged-empty-msg" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>
            No untagged records found.
          </div>
        ) : (
          <table id="untagged-table" className="dashboard-table">
            <thead>
              <tr>
                <th>URL ID</th>
                <th>Clean URL</th>
                <th>Date Added</th>
                <th>Time Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {untaggedLinks.map((link) => (
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
                    <a 
                      href={link.url} 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveViewLink(link);
                        setDetailMode('view');
                      }}
                      style={{ fontSize: '12px', color: '#1a73e8', textDecoration: 'none', wordBreak: 'break-all' }}
                    >
                      {link.url}
                    </a>
                  </td>
                  <td>{formatDate(link.createdAt)}</td>
                  <td>{formatTime(link.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        className="btn-sm"
                        onClick={() => setActiveEditLinkId(link.id)}
                      >
                        Add Tag
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
