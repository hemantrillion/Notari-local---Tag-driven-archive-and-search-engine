import React from 'react';

/**
 * CreateSourceModal - Floating Window component for Registering a New Source
 * Isolated with default theme styling.
 */
export default function CreateSourceModal({
  newSourceOpen,
  setNewSourceOpen,
  newSourceName,
  setNewSourceName,
  newSourceCode,
  setNewSourceCode,
  newSourcePattern,
  setNewSourcePattern,
  newSourceError,
  setNewSourceError,
  handleCreateSourceSubmit
}) {
  if (!newSourceOpen) return null;

  return (
    <div 
      className="tag-editor-overlay default-theme-isolated"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3%'
      }}
      onClick={() => setNewSourceOpen(false)}
    >
      <div 
        className="tag-editor-dialog" 
        style={{
          width: '90%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card, #ffffff)',
          color: 'var(--text-color, #111111)',
          borderRadius: '1.25rem',
          padding: '5% 6%',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: 700 }}>
          Create New Source
        </h3>

        {newSourceError && (
          <div style={{ color: '#d93025', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            {newSourceError}
          </div>
        )}

        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>
            Source Name / Title
          </label>
          <input 
            type="text" 
            className="input-field" 
            style={{ 
              padding: '0.65rem 0.85rem', 
              width: '100%', 
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #ccc)',
              boxSizing: 'border-box',
              fontSize: '0.95rem'
            }}
            placeholder="e.g. wikipedia"
            value={newSourceName} 
            onChange={(e) => {
              setNewSourceName(e.target.value);
              setNewSourceError('');
            }}
          />
        </div>

        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>
            Source Code (3 Letters)
          </label>
          <input 
            type="text" 
            className="input-field" 
            style={{ 
              padding: '0.65rem 0.85rem', 
              width: '100%', 
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #ccc)',
              boxSizing: 'border-box',
              fontFamily: 'monospace',
              fontSize: '0.95rem'
            }}
            placeholder="e.g. wik"
            maxLength={3}
            value={newSourceCode} 
            onChange={(e) => {
              setNewSourceCode(e.target.value.toLowerCase().replace(/[^a-z]/g, ''));
              setNewSourceError('');
            }}
          />
        </div>

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>
            Match URL Pattern (Domain)
          </label>
          <input 
            type="text" 
            className="input-field" 
            style={{ 
              padding: '0.65rem 0.85rem', 
              width: '100%', 
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #ccc)',
              boxSizing: 'border-box',
              fontSize: '0.95rem'
            }}
            placeholder="e.g. wikipedia.org"
            value={newSourcePattern} 
            onChange={(e) => {
              setNewSourcePattern(e.target.value);
              setNewSourceError('');
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '5%' }}>
          <button 
            className="white-theme-btn" 
            style={{ 
              flex: 1, 
              padding: '0.65rem', 
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => setNewSourceOpen(false)}
          >
            Cancel
          </button>
          <button 
            className="white-theme-btn primary" 
            style={{ 
              flex: 1, 
              padding: '0.65rem', 
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: '#1a73e8',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={handleCreateSourceSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
