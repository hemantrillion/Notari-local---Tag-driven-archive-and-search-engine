import { useState } from 'react';
import WordEditor from './WordEditor';
import WebsiteFrontendPlayground from './WebsiteFrontendPlayground';

export default function WebsiteDetailView({ 
  link, 
  detailMode, 
  setDetailMode, 
  detailTitle, 
  setDetailTitle, 
  detailNotes, 
  setDetailNotes, 
  onBack, 
  onOpenPlayer,
  onSave, 
  onSaveStyles 
}) {
  const [copied, setCopied] = useState(false);

  const displayUrl = (urlStr) => {
    if (!urlStr) return '';
    if (urlStr.length <= 25) {
      return <span style={{ color: 'inherit' }}>{urlStr}</span>;
    }
    const first25 = urlStr.slice(0, 25);
    const next5 = urlStr.slice(25, 30);
    const hasMore = urlStr.length > 30;
    return (
      <span>
        <span style={{ color: 'inherit' }}>{first25}</span>
        <span style={{ opacity: 0.5, color: 'inherit' }}>{next5}</span>
        {hasMore && <span style={{ opacity: 0.7, color: 'inherit' }}>...</span>}
      </span>
    );
  };

  const styles = link.styleSettings || {
    backgroundColor: 'transparent',
    textColor: 'inherit',
    fontFamily: 'var(--font-family)',
    cardStyle: 'flat',
    alignment: 'left',
    containerWidth: '700px'
  };

  return (
    <div id="website-detail-view" className="website-detail-page animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 24px 24px 24px', boxSizing: 'border-box', background: detailMode === 'edit' ? 'var(--bg-app)' : styles.backgroundColor, color: detailMode === 'edit' ? 'var(--text)' : styles.textColor, fontFamily: styles.fontFamily, transition: 'all 0.25s ease' }}>
      {/* web mints Toolbar Container */}
      <div 
        id="web-mints-toolbar"
        className="web-mints-toolbar"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          borderBottom: '1px solid var(--border)', 
          marginTop: '2rem',
          paddingTop: '1.5rem',
          paddingBottom: '1rem', 
          marginBottom: '2rem' 
        }}
      >
        <div className="web-mints-group" style={{ display: 'flex', gap: '3%' }}>
          <button 
            className={`white-theme-btn ${detailMode === 'view' ? 'active' : ''}`}
            onClick={() => setDetailMode('view')}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600 }}
          >
            Default View
          </button>
          <button 
            className={`white-theme-btn ${detailMode === 'design' ? 'active' : ''}`}
            onClick={() => setDetailMode('design')}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600 }}
          >
            Design Page
          </button>
          <button 
            className={`white-theme-btn ${detailMode === 'edit' ? 'active' : ''}`}
            onClick={() => setDetailMode('edit')}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600 }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Content Panel */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {detailMode === 'view' && (
          <div style={{ textAlign: styles.alignment }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0', color: 'inherit', fontFamily: 'inherit' }}>
              {link.title || 'Untitled Page'}
            </h1>
            
            <div style={{ fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: styles.alignment === 'center' ? 'center' : 'flex-start' }}>
              <strong style={{ color: 'inherit' }}>Url:</strong> 
              <span style={{ color: 'inherit', textDecoration: 'underline', wordBreak: 'break-all', marginRight: '8px' }}>
                {displayUrl(link.url)}
              </span>
              
              {/* Copy Button */}
              <button 
                className="white-theme-btn" 
                onClick={() => {
                  navigator.clipboard.writeText(link.url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                style={{ padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f9d58" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style={{ color: '#0f9d58', fontWeight: 'bold' }}>Copied</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              {/* Open Button */}
              <button 
                className="white-theme-btn primary"
                onClick={() => onOpenPlayer(link.url)}
                style={{ padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Open</span>
              </button>
            </div>

            <div 
              className="word-editor-preview"
              style={{ fontSize: '14px', lineHeight: '1.6', color: 'inherit', borderTop: '1px solid var(--border)', paddingTop: '16px', fontFamily: 'inherit', textAlign: styles.alignment }}
              dangerouslySetInnerHTML={{ __html: link.notes || '<p style="color: inherit; opacity: 0.5; font-style: italic;">No context notes written yet.</p>' }}
            />
          </div>
        )}

        {detailMode === 'design' && (
          <WebsiteFrontendPlayground 
            link={link} 
            onSave={onSaveStyles}
          />
        )}

        {detailMode === 'edit' && (
          <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 'bold', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                Page Title
              </label>
              <input 
                type="text"
                className="input-field"
                style={{ padding: '10px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
                value={detailTitle}
                onChange={(e) => setDetailTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 'bold', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                Page Context (Word Editor)
              </label>
              <WordEditor value={detailNotes} onChange={setDetailNotes} placeholder="Write page context here..." />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="white-theme-btn primary"
                style={{ backgroundColor: '#1a73e8', color: '#ffffff', padding: '8px 16px' }}
                onClick={() => onSave(detailTitle, detailNotes)}
              >
                Save Changes
              </button>
              <button 
                className="white-theme-btn"
                style={{ padding: '8px 16px' }}
                onClick={() => {
                  setDetailTitle(link.title || '');
                  setDetailNotes(link.notes || '');
                  setDetailMode('view');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
