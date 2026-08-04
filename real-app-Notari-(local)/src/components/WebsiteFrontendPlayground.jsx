import { useState } from 'react';

export default function WebsiteFrontendPlayground({ link, onSave }) {
  const currentStyles = link.styleSettings || {
    backgroundColor: 'transparent',
    textColor: 'inherit',
    fontFamily: 'var(--font-family)',
    cardStyle: 'flat',
    alignment: 'left',
    containerWidth: '700px'
  };

  const [bg, setBg] = useState(currentStyles.backgroundColor);
  const [textCol, setTextCol] = useState(currentStyles.textColor);
  const [font, setFont] = useState(currentStyles.fontFamily);
  const [card, setCard] = useState(currentStyles.cardStyle);
  const [align, setAlign] = useState(currentStyles.alignment);
  const [width, setWidth] = useState(currentStyles.containerWidth);

  // Background templates (Multi-shade layered gradient vectors matching the reference image designs)
  const BG_TEMPLATES = [
    { name: 'Sky Blue Layers', bg: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 35%, #0052d4 70%, #4364f7 100%)', text: '#ffffff' },
    { name: 'Mustard Waves', bg: 'linear-gradient(135deg, #ffc500 0%, #f5af19 50%, #c21500 100%)', text: '#ffffff' },
    { name: 'Lime Stripes', bg: 'linear-gradient(90deg, #9dcd5a 0%, #34a853 30%, #9dcd5a 60%, #34a853 90%)', text: '#ffffff' },
    { name: 'Ruby Chevron', bg: 'linear-gradient(135deg, #ff0844 0%, #ffb199 50%, #ff0844 100%)', text: '#ffffff' },
    { name: 'Dark Cyberpunk', bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', text: '#00ffcc' }
  ];

  const FONTS = [
    { name: 'Inter (Sans-Serif)', value: 'Inter, sans-serif' },
    { name: 'Playfair Display (Serif)', value: '"Playfair Display", serif' },
    { name: 'Outfit (Rounded)', value: 'Outfit, sans-serif' },
    { name: 'Courier Prime (Monospace)', value: '"Courier Prime", monospace' }
  ];

  const CARDS = [
    { name: 'Flat Card', value: 'flat' },
    { name: 'Glassmorphic Card', value: 'glass' },
    { name: 'Minimal Borderless', value: 'minimal' }
  ];

  const ALIGNMENTS = [
    { name: 'Left Aligned', value: 'left' },
    { name: 'Centered', value: 'center' }
  ];

  const WIDTHS = [
    { name: 'Narrow (500px)', value: '500px' },
    { name: 'Medium (700px)', value: '700px' },
    { name: 'Wide (95%)', value: '95%' }
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 220px)', boxSizing: 'border-box' }}>
      {/* Left Control Panel */}
      <div style={{ width: '280px', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '16px', border: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Design Tools</h3>
        
        {/* Background Templates */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#5f6368', display: 'block', marginBottom: '8px' }}>Theme & Background</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {BG_TEMPLATES.map(t => (
              <button
                key={t.name}
                onClick={() => {
                  setBg(t.bg);
                  setTextCol(t.text);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  background: '#ffffff',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: t.bg, border: '1px solid #ddd' }} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Custom Solid Background Color Picker */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#5f6368', display: 'block', marginBottom: '6px' }}>Custom Background</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="color" 
              value={bg.startsWith('linear-gradient') ? '#ffffff' : bg} 
              onChange={(e) => setBg(e.target.value)} 
              style={{ width: '40px', height: '28px', border: '1px solid var(--border)', borderRadius: '4px', padding: '0', cursor: 'pointer', background: 'none' }}
            />
            <input 
              type="text" 
              value={bg} 
              onChange={(e) => setBg(e.target.value)} 
              style={{ flex: 1, padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        {/* Custom Font Color Picker */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#5f6368', display: 'block', marginBottom: '6px' }}>Custom Font Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="color" 
              value={textCol} 
              onChange={(e) => setTextCol(e.target.value)} 
              style={{ width: '40px', height: '28px', border: '1px solid var(--border)', borderRadius: '4px', padding: '0', cursor: 'pointer', background: 'none' }}
            />
            <input 
              type="text" 
              value={textCol} 
              onChange={(e) => setTextCol(e.target.value)} 
              style={{ flex: 1, padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        {/* Font Selection */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#5f6368', display: 'block', marginBottom: '4px' }}>Typography</label>
          <select 
            value={font}
            onChange={(e) => setFont(e.target.value)}
            style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
          >
            {FONTS.map(f => (
              <option key={f.value} value={f.value}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Card Style */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#5f6368', display: 'block', marginBottom: '4px' }}>Container Layout</label>
          <select 
            value={card}
            onChange={(e) => setCard(e.target.value)}
            style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
          >
            {CARDS.map(c => (
              <option key={c.value} value={c.value}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Alignment */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#5f6368', display: 'block', marginBottom: '4px' }}>Text Alignment</label>
          <select 
            value={align}
            onChange={(e) => setAlign(e.target.value)}
            style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
          >
            {ALIGNMENTS.map(a => (
              <option key={a.value} value={a.value}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Width */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#5f6368', display: 'block', marginBottom: '4px' }}>Content Width</label>
          <select 
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
          >
            {WIDTHS.map(w => (
              <option key={w.value} value={w.value}>{w.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            className="white-theme-btn"
            style={{ flex: 1, padding: '10px', fontSize: '13px' }}
            onClick={() => {
              setBg('transparent');
              setTextCol('inherit');
              setFont('var(--font-family)');
              setCard('flat');
              setAlign('left');
              setWidth('700px');
              onSave({
                backgroundColor: 'transparent',
                textColor: 'inherit',
                fontFamily: 'var(--font-family)',
                cardStyle: 'flat',
                alignment: 'left',
                containerWidth: '700px'
              });
            }}
          >
            Reset Theme
          </button>

          <button
            className="white-theme-btn primary"
            style={{ flex: 1, padding: '10px', fontSize: '13px', backgroundColor: '#1a73e8', color: '#ffffff' }}
            onClick={() => {
              onSave({
                backgroundColor: bg,
                textColor: textCol,
                fontFamily: font,
                cardStyle: card,
                alignment: align,
                containerWidth: width
              });
            }}
          >
            Save Layout
          </button>
        </div>
      </div>

      {/* Right Live Preview Frame */}
      <div 
        style={{
          flex: 1,
          border: '1px solid var(--border)',
          borderRadius: '8px',
          background: bg,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Dynamic Card Container based on styles */}
        <div
          style={{
            width: width,
            maxWidth: '100%',
            backgroundColor: card === 'glass' ? 'rgba(255, 255, 255, 0.25)' : card === 'flat' ? 'var(--bg-white)' : 'transparent',
            backdropFilter: card === 'glass' ? 'blur(12px)' : 'none',
            border: card === 'glass' ? '1px solid rgba(255, 255, 255, 0.3)' : card === 'flat' ? '1px solid var(--border)' : 'none',
            borderRadius: card === 'minimal' ? '0' : '16px',
            boxShadow: card === 'minimal' ? 'none' : '0 10px 30px rgba(0,0,0,0.06)',
            padding: '40px',
            boxSizing: 'border-box',
            color: textCol,
            fontFamily: font,
            textAlign: align,
            transition: 'all 0.3s ease'
          }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
            {link.title || 'Untitled Page'}
          </h1>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '24px', wordBreak: 'break-all' }}>
            URL: {link.url}
          </div>
          <div 
            style={{ fontSize: '15px', lineHeight: '1.7' }}
            dangerouslySetInnerHTML={{ __html: link.notes || '<p style="font-style: italic; opacity: 0.5;">No context notes written yet.</p>' }}
          />
        </div>
      </div>
    </div>
  );
}
