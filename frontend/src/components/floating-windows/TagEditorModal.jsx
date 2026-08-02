import React from 'react';
import WordEditor from '../WordEditor';

/**
 * TagEditorModal - Floating Window component for Tag & Link Editing
 * Isolated with default theme styling.
 */
export default function TagEditorModal({
  activeEditLinkId,
  setActiveEditLinkId,
  editingLink,
  editTitle,
  setEditTitle,
  editUrl,
  editPrimaryTagLabel,
  setEditPrimaryTagLabel,
  editTags,
  setEditTags,
  editReadableCode,
  setEditReadableCode,
  editNotes,
  setEditNotes,
  editError,
  setEditError,
  allTags,
  allSources,
  handleSaveEdit,
  handleRemoveTag,
  handleAddTag
}) {
  if (activeEditLinkId === null) return null;

  const urlIdParts = (editReadableCode || 'web-web-0000-01-0126-000').split('-');
  const currentSourceCode = urlIdParts[0] || 'web';
  const currentTypeCode = urlIdParts[1] || 'web';

  const handleSourceChange = (newSource) => {
    const parts = urlIdParts.length >= 6 ? [...urlIdParts] : ['web', 'web', '0000', '01', '0126', '000'];
    parts[0] = newSource;
    setEditReadableCode(parts.join('-'));
  };

  const handleTypeChange = (newType) => {
    const parts = urlIdParts.length >= 6 ? [...urlIdParts] : ['web', 'web', '0000', '01', '0126', '000'];
    parts[1] = newType;
    setEditReadableCode(parts.join('-'));
  };

  return (
    <div 
      className="tag-editor-overlay default-theme-isolated" 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2%'
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveEditLinkId(null);
      }}
    >
      <div 
        className="tag-editor-dialog" 
        style={{
          width: '94%',
          maxWidth: '720px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-card, #ffffff)',
          color: 'var(--text-color, #111111)',
          borderRadius: '1.25rem',
          padding: '4% 5%',
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 700 }}>
          Tag Editor
        </h3>
        
        {editError && (
          <div style={{ color: '#d93025', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            {editError}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Side-by-side URL ID and Source URL */}
          <div style={{ display: 'flex', gap: '4%' }}>
            <div style={{ flex: 1 }}>
              <label className="input-label" style={{ fontWeight: 600, fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
                URL ID (Identifier)
              </label>
              <input 
                type="text" 
                className="input-field" 
                style={{ padding: '0.55rem', width: '100%', borderRadius: '0.4rem', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'monospace' }}
                value={editReadableCode}
                onChange={(e) => {
                  setEditReadableCode(e.target.value);
                  setEditError('');
                }}
              />
            </div>
            <div style={{ flex: 1.5 }}>
              <label className="input-label" style={{ fontWeight: 600, fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
                Source URL
              </label>
              <input 
                type="text" 
                className="input-field" 
                disabled
                style={{ padding: '0.55rem', width: '100%', borderRadius: '0.4rem', border: '1px solid #eee', backgroundColor: '#f5f5f5', color: '#666', boxSizing: 'border-box' }}
                value={editUrl}
              />
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="input-label" style={{ fontWeight: 600, fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
              Title
            </label>
            <input 
              type="text" 
              className="input-field" 
              style={{ padding: '0.55rem', width: '100%', borderRadius: '0.4rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
              placeholder="Enter page title..."
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>

          {/* Associated Tags Pills */}
          <div>
            <label className="input-label" style={{ fontWeight: 600, fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
              Associated Tags
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {editTags.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#888' }}>untagged</span>
              ) : (
                editTags.map((t) => (
                  <span 
                    key={t.code} 
                    style={{ 
                      padding: '0.25rem 0.6rem', 
                      borderRadius: '1rem', 
                      backgroundColor: '#e8f0fe', 
                      color: '#1a73e8', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {t.label}
                    {editTags.length > 1 && (
                      <span 
                        style={{ cursor: 'pointer', fontWeight: 'bold' }} 
                        onClick={() => handleRemoveTag && handleRemoveTag(t.code)}
                      >
                        ×
                      </span>
                    )}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Tag Label Input & Add Tag */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label className="input-label" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
                Tag Label
              </label>
              <button 
                type="button"
                style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}
                onClick={() => handleAddTag && handleAddTag(editPrimaryTagLabel)}
              >
                + Add Tag
              </button>
            </div>
            <input 
              type="text" 
              className="input-field" 
              style={{ padding: '0.55rem', width: '100%', borderRadius: '0.4rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
              placeholder="e.g. recipes, coding"
              value={editPrimaryTagLabel}
              onChange={(e) => setEditPrimaryTagLabel(e.target.value)}
            />
          </div>

          {/* Type & Source Dropdowns */}
          <div style={{ display: 'flex', gap: '4%' }}>
            <div style={{ flex: 1 }}>
              <label className="input-label" style={{ fontWeight: 600, fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
                Type
              </label>
              <select 
                className="input-field"
                style={{ padding: '0.55rem', width: '100%', borderRadius: '0.4rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
                value={currentTypeCode}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="doc">Document (doc)</option>
                <option value="vid">Video (vid)</option>
                <option value="img">Image (img)</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label className="input-label" style={{ fontWeight: 600, fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
                Source
              </label>
              <select 
                className="input-field"
                style={{ padding: '0.55rem', width: '100%', borderRadius: '0.4rem', border: '1px solid #ccc', boxSizing: 'border-box' }}
                value={currentSourceCode}
                onChange={(e) => handleSourceChange(e.target.value)}
              >
                {(allSources || []).map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes Body (Word Editor) */}
          <div>
            <label className="input-label" style={{ fontWeight: 600, fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
              Notes
            </label>
            <WordEditor 
              value={editNotes} 
              onChange={setEditNotes} 
            />
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', gap: '4%', marginTop: '1.25rem' }}>
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
            onClick={() => setActiveEditLinkId(null)}
          >
            Close
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
            onClick={handleSaveEdit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
