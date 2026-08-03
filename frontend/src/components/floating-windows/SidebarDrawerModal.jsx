import React from 'react';

/**
 * SidebarDrawerModal - Floating Window component for Main Navigation Drawer
 * Isolated with default theme styling (supports Light/Dark mode).
 */
export default function SidebarDrawerModal({
  drawerOpen,
  setDrawerOpen,
  activeTab,
  navigateTo,
  themeMode,
  toggleThemeMode,
  fetchAuditLogs,
  showToast
}) {
  if (!drawerOpen) return null;

  return (
    <div 
      className="sidebar-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '12px'
      }}
      onClick={() => setDrawerOpen(false)}
    >
      <div 
        className={`sidebar-drawer default-theme-isolated ${drawerOpen ? 'open' : ''}`}
        style={{
          width: '280px',
          maxWidth: '80vw',
          height: 'calc(100% - 24px)',
          backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
          color: themeMode === 'dark' ? '#ffffff' : '#111827',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: themeMode === 'dark' ? '0 12px 32px rgba(0,0,0,0.6)' : '0 12px 32px rgba(0,0,0,0.15)',
          padding: '2vh 1.25rem',
          borderRadius: '16px',
          border: themeMode === 'dark' ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Items List */}
        <div className="drawer-menu" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'untagged', label: 'Untagged' },
            { id: 'tagged', label: 'Tagged' },
            { id: 'tags', label: 'Tags' },
            { id: 'sources', label: 'Sources' },
            { id: 'profile', label: 'Profile' },
            { id: 'themes', label: 'Themes' },
            { id: 'logs', label: 'Logs' }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div 
                key={item.id}
                className={`drawer-item ${isActive ? 'active' : ''}`}
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  backgroundColor: isActive 
                    ? (themeMode === 'dark' ? 'rgba(59, 130, 246, 0.25)' : '#e8f0fe')
                    : 'transparent',
                  color: isActive 
                    ? (themeMode === 'dark' ? '#60a5fa' : '#1a73e8')
                    : (themeMode === 'dark' ? '#e2e8f0' : '#374151'),
                  border: isActive 
                    ? (themeMode === 'dark' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(26, 115, 232, 0.2)')
                    : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => {
                  navigateTo(item.id);
                  setDrawerOpen(false);
                  if (item.id === 'logs' && fetchAuditLogs) fetchAuditLogs();
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer: Triple T (No Top Divider Line, Ratio-Based Alignment) */}
        <div 
          className="drawer-footer triple-t-bar" 
          style={{ 
            marginTop: 'auto', 
            paddingTop: '3vh',
            paddingBottom: '2vh',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8%' 
          }}
        >
          {/* 1st Icon: Light / Dark Mode Toggle */}
          <button
            className="rounded-square-btn"
            title={themeMode === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode'}
            style={{
              width: '2.6rem',
              height: '2.6rem',
              borderRadius: '22%',
              border: themeMode === 'dark' ? '1px solid #3f3f46' : '1px solid #d1d5db',
              backgroundColor: themeMode === 'dark' ? '#27272a' : '#ffffff',
              color: themeMode === 'dark' ? '#ffffff' : '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.15s ease'
            }}
            onClick={toggleThemeMode}
          >
            {themeMode === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* 2nd Square: Reserved Slot */}
          <button
            className="rounded-square-btn"
            title="Option Reserved"
            style={{
              width: '2.6rem',
              height: '2.6rem',
              borderRadius: '22%',
              border: themeMode === 'dark' ? '1px solid #3f3f46' : '1px solid #d1d5db',
              backgroundColor: themeMode === 'dark' ? '#27272a' : '#ffffff',
              color: themeMode === 'dark' ? '#ffffff' : '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: 0.75,
              transition: 'all 0.15s ease'
            }}
            onClick={() => showToast && showToast('Option reserved')}
          />

          {/* 3rd Square: Reserved Slot */}
          <button
            className="rounded-square-btn"
            title="Option Reserved"
            style={{
              width: '2.6rem',
              height: '2.6rem',
              borderRadius: '22%',
              border: themeMode === 'dark' ? '1px solid #3f3f46' : '1px solid #d1d5db',
              backgroundColor: themeMode === 'dark' ? '#27272a' : '#ffffff',
              color: themeMode === 'dark' ? '#ffffff' : '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: 0.75,
              transition: 'all 0.15s ease'
            }}
            onClick={() => showToast && showToast('Option reserved')}
          />
        </div>
      </div>
    </div>
  );
}
