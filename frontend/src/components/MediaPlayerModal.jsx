export default function MediaPlayerModal({ url, onClose }) {
  const getEmbedInfo = (linkUrl) => {
    if (!linkUrl) return { type: 'web', src: '' };

    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = linkUrl.match(ytRegex);
    if (ytMatch) {
      return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1` };
    }

    const insRegex = /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i;
    const insMatch = linkUrl.match(insRegex);
    if (insMatch) {
      return { type: 'instagram', src: `https://www.instagram.com/p/${insMatch[1]}/embed` };
    }

    return { type: 'web', src: linkUrl };
  };

  const { type, src } = getEmbedInfo(url);

  return (
    <div 
      className="tag-editor-overlay animate-fade"
      style={{ zIndex: 130 }}
      onClick={onClose}
    >
      <div 
        className="tag-editor-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '850px',
          height: '75%',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
          borderRadius: '16px',
          backgroundColor: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: '#161b22',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '500', opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
            Previewing: {url}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '12px', color: '#58a6ff', textDecoration: 'none', fontWeight: '500' }}
            >
              Open in tab ↗
            </a>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '18px',
                cursor: 'pointer',
                fontWeight: 'bold',
                padding: '4px 8px'
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: '#000000', position: 'relative' }}>
          {type === 'youtube' && (
            <iframe 
              src={src}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          )}
          {type === 'instagram' && (
            <iframe 
              src={src}
              allowtransparency="true"
              frameBorder="0"
              scrolling="no"
              style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
            />
          )}
          {type === 'web' && (
            <iframe 
              src={src}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
