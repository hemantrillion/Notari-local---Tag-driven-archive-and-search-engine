import React from 'react';

export default function ThemesDashboard({
  THEME_OPTIONS = [],
  appTheme = 'default',
  themeMode = 'light',
  changeTheme = () => {}
}) {
  return (
    <div id="themes-dashboard" className="dashboard-container" onClick={(e) => e.stopPropagation()}>
      {/* Pair of compact rounded rectangular theme boxes with uniform text */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {THEME_OPTIONS.map((theme) => {
          const isActive = appTheme === theme.id;
          return (
            <div
              key={theme.id}
              className={`theme-selection-card theme-${theme.id} mode-${themeMode}`}
              onClick={() => changeTheme(theme.id)}
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                border: isActive ? '2px solid var(--accent, #1a73e8)' : '1px solid var(--border, #dadce0)',
                backgroundColor: isActive ? 'var(--bg-card, #ffffff)' : 'var(--bg-card, #ffffff)',
                color: 'var(--text, #202124)',
                fontFamily: 'var(--font-family)',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(26, 115, 232, 0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ fontWeight: isActive ? '700' : '600', fontSize: '14px', color: 'var(--text, #202124)', fontFamily: 'inherit' }}>
                {theme.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
