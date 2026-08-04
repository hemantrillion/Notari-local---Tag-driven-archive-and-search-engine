import React from 'react';

export default function SourcesRegistryDashboard({
  sources = [],
  links = [],
  setNewSourceOpen = () => {},
  handleDeleteSource = () => {}
}) {
  return (
    <div id="sources-registry-dashboard" className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          id="create-source-btn"
          className="white-theme-btn primary"
          style={{ padding: '6px 14px', fontSize: '12px' }}
          onClick={() => setNewSourceOpen(true)}
        >
          + Create Source
        </button>
      </div>

      <div style={{ overflowX: 'auto', flex: 1 }}>
        {sources.length === 0 ? (
          <div id="sources-empty-msg" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>
            No sources registered. Click "+ Create Source" to add one!
          </div>
        ) : (
          <table id="sources-registry-table" className="dashboard-table">
            <thead>
              <tr>
                <th>Source Code</th>
                <th>Source Name</th>
                <th>URL Pattern</th>
                <th>Linked Posts</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => {
                const count = links.filter(l => l.from === s.name || l.sourceCode === s.code).length;
                return (
                  <tr key={s.code}>
                    <td>
                      <span className="badge badge-accent">{s.code}</span>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{s.name}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {s.urlPattern || 'N/A'}
                    </td>
                    <td>{count} link(s)</td>
                    <td>
                      <button 
                        className="btn-sm-danger"
                        onClick={(e) => handleDeleteSource(s.code, e)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
