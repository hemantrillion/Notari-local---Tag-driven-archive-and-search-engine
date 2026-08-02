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
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 1000,
        display: 'flex'
      }}
      onClick={() => setDrawerOpen(false)}
    >
      <div 
        className={`sidebar-drawer default-theme-isolated ${drawerOpen ? 'open' : ''}`}
        style={{
          width: '280px',
          maxWidth: '80vw',
          height: '100vh',
          backgroundColor: 'var(--bg-primary, #ffffff)',
          color: 'var(--text-primary, #111111)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          padding: '2vh 1.5rem',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Items List */}
        <div className="drawer-menu" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
          <div 
            className={`drawer-item ${activeTab === 'home' ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              navigateTo('home');
              setDrawerOpen(false);
            }}
          >
            Home
          </div>
          <div 
            className={`drawer-item ${activeTab === 'untagged' ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              navigateTo('untagged');
              setDrawerOpen(false);
            }}
          >
            Untagged
          </div>
          <div 
            className={`drawer-item ${activeTab === 'tagged' ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              navigateTo('tagged');
              setDrawerOpen(false);
            }}
          >
            Tagged
          </div>
          <div 
            className={`drawer-item ${activeTab === 'tags' ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              navigateTo('tags');
              setDrawerOpen(false);
            }}
          >
            Tags
          </div>
          <div 
            className={`drawer-item ${activeTab === 'sources' ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              navigateTo('sources');
              setDrawerOpen(false);
            }}
          >
            Sources
          </div>
          <div 
            className={`drawer-item ${activeTab === 'themes' ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              navigateTo('themes');
              setDrawerOpen(false);
            }}
          >
            Themes
          </div>
          <div 
            className={`drawer-item ${activeTab === 'logs' ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              navigateTo('logs');
              setDrawerOpen(false);
              if (fetchAuditLogs) fetchAuditLogs();
            }}
          >
            Logs
          </div>
        </div>

        {/* Drawer Footer: Triple T (No Top Divider Line, Ratio-Based Alignment) */}
        <div 
          className="drawer-footer triple-t-bar" 
          style={{ 
            marginTop: 'auto', 
            paddingTop: '3vh',
            paddingBottom: '3vh',
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
              border: '1px solid var(--border-color, #e0e0e0)',
              backgroundColor: 'var(--bg-card, #ffffff)',
              color: 'var(--text-color, #111111)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.15s ease'
            }}
            onClick={toggleThemeMode}
          >
            {themeMode === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              border: '1px solid var(--border-color, #e0e0e0)',
              backgroundColor: 'var(--bg-card, #ffffff)',
              color: 'var(--text-color, #111111)',
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
              border: '1px solid var(--border-color, #e0e0e0)',
              backgroundColor: 'var(--bg-card, #ffffff)',
              color: 'var(--text-color, #111111)',
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
