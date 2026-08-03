import React from 'react';

export default function ThemesDashboard({
  THEME_OPTIONS,
  appTheme,
  themeMode,
  changeTheme
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

      {/* Preview Section (Header simply 'Preview', 4 Miniature Page Cards below) */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-family)' }}>
          Preview
        </h2>

        <div 
          className={`preview-canvas theme-${appTheme} mode-${themeMode}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.25rem',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-app)',
            color: 'var(--text)',
            transition: 'all 0.25s ease'
          }}
        >
          
          {/* 1. Miniature Homepage View Card */}
          <div style={{ padding: '0.85rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'var(--font-family)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Homepage Structure
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.4rem' }}>
              A Sap Link
            </div>
            <div style={{ padding: '0.35rem', borderRadius: '1rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-app)', fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>
              Search tags, URLs, or notes...
            </div>
            <div style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-app)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)' }}>New page horaganaaaaa</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>youtube &gt; music video | song</div>
            </div>
          </div>

          {/* 2. Miniature Webpage Detail View Card */}
          <div style={{ padding: '0.85rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'var(--font-family)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Webpage Structure</span>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '0.2rem', backgroundColor: 'var(--accent)', color: '#fff' }}>web mints</span>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              New page horaganaaaaa
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Url: https://www.youtube.com/watch...
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text)', lineHeight: 1.3, opacity: 0.85 }}>
              first try out page what
            </div>
          </div>

          {/* 3. Miniature Tagged Dashboard Table Card */}
          <div style={{ padding: '0.85rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'var(--font-family)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Tagged Structure
            </div>
            <div style={{ fontSize: '0.6rem', borderCollapse: 'collapse', width: '100%' }}>
              <div style={{ display: 'flex', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.2rem', color: 'var(--text-muted)' }}>
                <span style={{ flex: 1 }}>URL ID</span>
                <span style={{ flex: 1 }}>HEADING</span>
                <span style={{ flex: 1 }}>TAG</span>
              </div>
              <div style={{ display: 'flex', paddingTop: '0.2rem', color: 'var(--text)' }}>
                <span style={{ flex: 1, fontSize: '0.55rem' }}>ytb-vid-0003...</span>
                <span style={{ flex: 1, fontWeight: 600 }}>New page...</span>
                <span style={{ flex: 1, color: 'var(--accent)' }}>music video</span>
              </div>
            </div>
          </div>

          {/* 4. Miniature Logs Dashboard Card */}
          <div style={{ padding: '0.85rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'var(--font-family)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Logs Structure
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem', borderRadius: '0.8rem', backgroundColor: 'var(--accent)', color: '#fff', fontWeight: 600 }}>Change Logs (25)</span>
              <span style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem', borderRadius: '0.8rem', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Audit Logs (55)</span>
            </div>
            <div style={{ padding: '0.3rem', borderRadius: '0.3rem', backgroundColor: 'var(--bg-app)', fontSize: '0.55rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>EDITED </span>
              <span style={{ color: 'var(--text-muted)' }}>Link 'New page horaganaaaaa' was updated.</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
