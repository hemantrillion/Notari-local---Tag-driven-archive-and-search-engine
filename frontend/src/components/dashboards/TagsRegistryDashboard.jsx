import React from 'react';

export default function TagsRegistryDashboard({
  tags,
  links,
  setNewTagOpen,
  handleDeleteTag
}) {
  return (
    <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          className="white-theme-btn primary"
          style={{ padding: '6px 14px', fontSize: '12px' }}
          onClick={() => setNewTagOpen(true)}
        >
          + Create Tag
        </button>
      </div>

      <div style={{ overflowX: 'auto', flex: 1 }}>
        {tags.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>
            No tags registered. Click "+ Create Tag" to add one!
          </div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Tag Code</th>
                <th>Tag Name</th>
                <th>Linked Posts</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t) => {
                const count = links.filter(l => (l.tags && l.tags.some(tag => tag.code === t.code)) || (l.tagCode === t.code)).length;
                return (
                  <tr key={t.code}>
                    <td>
                      <span className="badge badge-accent">{t.code}</span>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{t.label}</td>
                    <td>{count} link(s)</td>
                    <td>
                      {t.code !== '0000' && (
                        <button 
                          className="btn-sm-danger"
                          onClick={(e) => handleDeleteTag(t.code, e)}
                        >
                          Delete
                        </button>
                      )}
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
