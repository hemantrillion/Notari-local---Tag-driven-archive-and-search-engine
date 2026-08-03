import React from 'react';

/**
 * CreateTagModal - Floating Window component for Creating a New Tag
 * Isolated with default theme styling.
 */
export default function CreateTagModal({
  newTagOpen,
  setNewTagOpen,
  newTagLabel,
  setNewTagLabel,
  newTagError,
  setNewTagError,
  handleCreateTagSubmit
}) {
  if (!newTagOpen) return null;

  return (
    <div 
      className="tag-editor-overlay default-theme-isolated" 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3%'
      }}
      onClick={(e) => {
        e.stopPropagation();
        setNewTagOpen(false);
      }}
    >
      <div 
        className="tag-editor-dialog" 
        style={{
          width: '90%',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-card, #ffffff)',
          color: 'var(--text-color, #111111)',
          borderRadius: '1rem',
          padding: '24px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: 700 }}>
          Create New Tag
        </h3>

        {newTagError && (
          <div style={{ color: '#d93025', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            {newTagError}
          </div>
        )}

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>
            Tag Label
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
            placeholder="e.g. recipes, coding"
            value={newTagLabel} 
            onChange={(e) => {
              setNewTagLabel(e.target.value);
              setNewTagError('');
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
            onClick={() => setNewTagOpen(false)}
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
            onClick={handleCreateTagSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
