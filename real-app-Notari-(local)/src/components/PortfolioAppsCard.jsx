import React from 'react';

/**
 * PortfolioAppsCard - Matching hekugo.online & Zeitplan card pattern.
 * Displays interactive app cards for Zeitplan & Notari (local) leading to APK downloads.
 */
export default function PortfolioAppsCard() {
  const apps = [
    {
      id: 'notari-local',
      title: 'Notari (local)',
      subtitle: 'Tag-Driven Archive & Local Search Engine',
      description: 'Capture, tag, and organize URLs, videos, documents, and web notes locally with 16 dynamic visual themes.',
      badge: 'Android APK Available',
      badgeColor: '#10b981',
      icon: '🔖',
      apkUrl: '/downloads/notari-local-release.apk',
      githubUrl: 'https://github.com/hemantrillion/Notari-local---Tag-driven-archive-and-search-engine'
    },
    {
      id: 'zeitplan',
      title: 'Zeitplan',
      subtitle: 'Schedule & Time Management Engine',
      description: 'Productivity scheduling app for tracking timeblocks, reminders, and daily agendas seamlessly.',
      badge: 'Android APK Available',
      badgeColor: '#3b82f6',
      icon: '⏱️',
      apkUrl: 'https://github.com/hemantrillion/Zeitplan',
      githubUrl: 'https://github.com/hemantrillion/Zeitplan'
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text, #111)' }}>
        Hekugo Portfolio Applications
      </h2>
      <p style={{ color: 'var(--text-muted, #666)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Select an application below to view details or download the native Android APK.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {apps.map((app) => (
          <div
            key={app.id}
            style={{
              border: '1px solid var(--border, #e5e7eb)',
              borderRadius: '16px',
              padding: '20px',
              backgroundColor: 'var(--bg-card, #ffffff)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{app.icon}</span>
                <span 
                  style={{ 
                    backgroundColor: `${app.badgeColor}15`, 
                    color: app.badgeColor, 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700 
                  }}
                >
                  {app.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text, #111)' }}>
                {app.title}
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent, #1a73e8)', marginBottom: '8px' }}>
                {app.subtitle}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #555)', lineHeight: 1.5, margin: 0 }}>
                {app.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <a
                href={app.apkUrl}
                download={app.id === 'notari-local'}
                target={app.id === 'notari-local' ? '_self' : '_blank'}
                rel="noreferrer"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent, #1a73e8)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                📥 Download APK
              </a>
              <a
                href={app.githubUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border, #ccc)',
                  backgroundColor: 'transparent',
                  color: 'var(--text, #111)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
