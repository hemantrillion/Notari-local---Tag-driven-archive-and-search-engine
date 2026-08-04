import React from 'react';

export default function NavigationControls({ 
  isEditing, 
  onGoBack, 
  onGoHome 
}) {
  return (
    <div className="navigation-controls" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
      {/* Back Button */}
      <button
        className="header-btn"
        onClick={onGoBack}
        disabled={isEditing}
        title="Back to previous page"
        style={{ 
          opacity: isEditing ? 0.35 : 1, 
          cursor: isEditing ? 'not-allowed' : 'pointer',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          background: 'none',
          borderRadius: '4px',
          color: 'var(--text)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      {/* Home Button */}
      <button
        className="header-btn"
        onClick={onGoHome}
        disabled={isEditing}
        title="Go to Homepage"
        style={{ 
          opacity: isEditing ? 0.35 : 1, 
          cursor: isEditing ? 'not-allowed' : 'pointer',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          background: 'none',
          borderRadius: '4px',
          color: 'var(--text)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>
    </div>
  );
}
