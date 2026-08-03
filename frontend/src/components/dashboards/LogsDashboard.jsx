import React from 'react';

export default function LogsDashboard({
  auditLogs,
  auditLogsLoading,
  fetchAuditLogs,
  logsSubTab,
  setLogsSubTab
}) {
  const changeLogs = auditLogs.filter(l => ['UPDATE_LINK', 'UPDATE_TAG'].includes(l.action));

  return (
    <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          className="white-theme-btn"
          style={{ padding: '6px 14px', fontSize: '12px' }}
          onClick={fetchAuditLogs}
          disabled={auditLogsLoading}
        >
          {auditLogsLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Sub-Tab Navigation Toggle with Live Counts (No Emojis) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <button
          className={`white-theme-btn ${logsSubTab === 'change' ? 'primary' : ''}`}
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px' }}
          onClick={() => setLogsSubTab('change')}
        >
          Change Logs ({changeLogs.length})
        </button>
        <button
          className={`white-theme-btn ${logsSubTab === 'audit' ? 'primary' : ''}`}
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px' }}
          onClick={() => setLogsSubTab('audit')}
        >
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {auditLogsLoading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>Loading activity logs...</p>
      ) : (
        <div>
          {/* 1. Change Logs View */}
          {logsSubTab === 'change' && (
            <div>
              {changeLogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No change logs recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {changeLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '14px 16px',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '10px',
                        border: 'var(--card-border)',
                        boxShadow: 'var(--box-shadow)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(26,115,232,0.15)',
                            color: '#1a73e8',
                            letterSpacing: '0.4px',
                            textTransform: 'uppercase'
                          }}
                        >
                          EDITED
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: '500' }}>
                        {log.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Full Audit Logs View */}
          {logsSubTab === 'audit' && (
            <div>
              {auditLogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No audit logs recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '14px 16px',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '10px',
                        border: 'var(--card-border)',
                        boxShadow: 'var(--box-shadow)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            backgroundColor:
                              log.action.includes('DELETE') ? 'rgba(217,83,79,0.15)' :
                              log.action.includes('UPDATE') ? 'rgba(26,115,232,0.15)' :
                              'rgba(52,168,83,0.15)',
                            color:
                              log.action.includes('DELETE') ? '#c0392b' :
                              log.action.includes('UPDATE') ? '#1a73e8' :
                              '#1e8449',
                            letterSpacing: '0.4px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {log.action.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {log.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
