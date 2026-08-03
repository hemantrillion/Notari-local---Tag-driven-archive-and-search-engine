import React from 'react';

export default function ProfileDashboard({
  isLocalStorageEnabled = true,
  setIsLocalStorageEnabled = () => {},
  THEME_OPTIONS = [],
  appTheme = 'default',
  themeMode = 'light',
  changeTheme = () => {}
}) {
  return (
    <div id="profile-dashboard" className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      
      {/* Profile Info Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 0 24px 0', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent, #1a73e8)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          fontWeight: 'bold'
        }}>
          u
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Default Profile</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Local System Workspace</p>
        </div>
      </div>

      {/* Local Storage Toggle Section */}
      <div style={{ padding: '0 0 24px 0', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 'bold' }}>Data Storage</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
          Choose whether app preferences and cache persist in local browser storage.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Local Storage Cache</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isLocalStorageEnabled ? 'Enabled (Themes & history saved locally)' : 'Disabled (Session state only)'}
            </div>
          </div>
          <button
            className={`white-theme-btn ${isLocalStorageEnabled ? 'primary' : ''}`}
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => {
              const next = !isLocalStorageEnabled;
              setIsLocalStorageEnabled(next);
              if (!next) {
                localStorage.clear();
              } else {
                localStorage.setItem('themeMode', themeMode);
                localStorage.setItem('appTheme', appTheme);
              }
            }}
          >
            {isLocalStorageEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Theme Settings Section in Profile */}
      <div style={{ padding: '0 0 24px 0', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 'bold' }}>Theme Settings</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
          Select visual style theme with live app previews.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
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
                  border: isActive ? '2px solid #1a73e8' : '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card)',
                  cursor: 'pointer',
                  boxShadow: 'var(--box-shadow)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-color)' }}>
                    {theme.name}
                  </span>
                  {isActive && (
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1a73e8', padding: '2px 10px', borderRadius: '12px' }}>
                      Active
                    </span>
                  )}
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', border: '1px dashed var(--border)', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ height: '8px', width: '65%', backgroundColor: 'var(--accent, #1a73e8)', borderRadius: '4px' }} />
                  <div style={{ height: '6px', width: '90%', backgroundColor: 'var(--text-muted, #888)', borderRadius: '4px', opacity: 0.5 }} />
                  <div style={{ height: '6px', width: '40%', backgroundColor: 'var(--text-muted, #888)', borderRadius: '4px', opacity: 0.3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
