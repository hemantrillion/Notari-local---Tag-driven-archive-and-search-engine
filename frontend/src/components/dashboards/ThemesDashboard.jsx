import React from 'react';

export default function ThemesDashboard({
  THEME_OPTIONS = [],
  appTheme = 'default',
  themeMode = 'light',
  changeTheme = () => {}
}) {
  return (
    <div id="themes-dashboard" className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      
      {/* 8 Theme Options in 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '2rem' }}>
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
                border: isActive ? '2.5px solid var(--accent, #1a73e8)' : '1px solid var(--border)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text)',
                fontFamily: 'var(--font-family)',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(26, 115, 232, 0.25)' : 'var(--box-shadow)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'inherit' }}>
                {theme.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
