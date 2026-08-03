import React from 'react';

export default function ThemesDashboard({
  THEME_OPTIONS = [],
  appTheme = 'default',
  themeMode = 'light',
  changeTheme = () => {}
}) {
  return (
    <div id="themes-dashboard" className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 'bold', color: 'var(--text)' }}>
          Theme Settings
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px' }}>
          Select visual style theme with live app previews.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {THEME_OPTIONS.map((theme) => {
            const isActive = appTheme === theme.id;
            return (
              <div
                key={theme.id}
                className={`theme-${theme.id} mode-${themeMode}`}
                onClick={() => changeTheme(theme.id)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: isActive ? '2.5px solid var(--accent, #1a73e8)' : '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card)',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(26, 115, 232, 0.2)' : 'var(--box-shadow)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text)' }}>
                    {theme.name}
                  </span>
                  {isActive && (
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1a73e8', padding: '2px 10px', borderRadius: '12px' }}>
                      Active
                    </span>
                  )}
                </div>

                <div style={{ padding: '12px', borderRadius: '8px', border: '1px dashed var(--border)', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ height: '8px', width: '65%', backgroundColor: 'var(--accent, #1a73e8)', borderRadius: '4px' }} />
                  <div style={{ height: '6px', width: '90%', backgroundColor: 'var(--text-muted, #888)', borderRadius: '4px', opacity: 0.5 }} />
                  <div style={{ height: '6px', width: '40%', backgroundColor: 'var(--text-muted, #888)', borderRadius: '4px', opacity: 0.3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Section Heading (Omitted miniature structure cards below) */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
          Preview
        </h3>
      </div>
    </div>
  );
}
