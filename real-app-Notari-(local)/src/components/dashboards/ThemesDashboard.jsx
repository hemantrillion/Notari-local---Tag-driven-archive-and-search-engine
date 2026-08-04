import React from 'react';

export default function ThemesDashboard({
  THEME_OPTIONS = [],
  appTheme = 'default',
  themeMode = 'light',
  changeTheme = () => {}
}) {
  return (
    <div id="themes-dashboard" className="dashboard-container" onClick={(e) => e.stopPropagation()} style={{ overflowY: 'auto', maxHeight: '100%', paddingBottom: '60px' }}>
      {/* 8 Theme Options in clean uniform 2-column grid of rounded rectangular cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
        {THEME_OPTIONS.map((theme) => {
          const isActive = appTheme === theme.id;
          return (
            <div
              key={theme.id}
              className="theme-selection-card"
              onClick={() => changeTheme(theme.id)}
              style={{
                padding: '0.85rem 1.25rem',
                borderRadius: '0.75rem',
                border: isActive ? '2.5px solid #1a73e8' : '1px solid var(--border)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(26, 115, 232, 0.25)' : 'var(--box-shadow)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ fontWeight: isActive ? 700 : 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                {theme.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Preview Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>
          Preview
        </h2>

        <div 
          className={`preview-canvas theme-${appTheme} mode-${themeMode}`}
          style={{
            minHeight: '180px',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-app)',
            color: 'var(--text)',
            transition: 'all 0.25s ease'
          }}
        >
        </div>
      </div>
    </div>
  );
}
