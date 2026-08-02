import { useRef, useState, useEffect } from 'react';

export default function WordEditor({ value, onChange, placeholder = "Write notes here..." }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [overlayPos, setOverlayPos] = useState({ top: 0, left: 0 });

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateSelectionStates = () => {
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
    } catch (e) {}
  };

  useEffect(() => {
    const onSelChange = () => {
      if (document.activeElement === editorRef.current) {
        updateSelectionStates();
      }
    };
    document.addEventListener('selectionchange', onSelChange);
    return () => document.removeEventListener('selectionchange', onSelChange);
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  useEffect(() => {
    if (selectedImg && editorRef.current) {
      const rect = selectedImg.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      setOverlayPos({
        top: rect.top - editorRect.top + editorRef.current.scrollTop - 40,
        left: rect.left - editorRect.left + (rect.width / 2) - 100
      });
    }
  }, [selectedImg]);

  const insertHTMLAtSavedRange = (html, savedRange) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
      
      savedRange.deleteContents();
      const el = document.createElement('div');
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node, lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      savedRange.insertNode(frag);
      if (lastNode) {
        const newRange = savedRange.cloneRange();
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
      onChange(editorRef.current.innerHTML);
      return;
    }

    // Fallback: append
    editorRef.current.innerHTML += html;
    onChange(editorRef.current.innerHTML);
  };

  const handleFileUpload = (e) => {
    const selection = window.getSelection();
    let savedRange = null;
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRange = range.cloneRange();
      }
    }

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        let html = '';
        if (file.type.startsWith('image/')) {
          html = `<img src="${dataUrl}" style="max-width: 320px; height: auto; border-radius: 6px; display: block; margin: 8px 0;" alt="${file.name}" />`;
        } else if (file.type.startsWith('audio/')) {
          html = `<audio controls src="${dataUrl}" style="max-width: 100%; display: block; margin: 8px 0;"></audio>`;
        } else if (file.type.startsWith('video/')) {
          html = `<video controls src="${dataUrl}" style="max-width: 320px; height: auto; border-radius: 6px; display: block; margin: 8px 0;"></video>`;
        } else {
          html = `<span style="background-color: #e8f0fe; color: #1a73e8; padding: 3px 8px; border-radius: 12px; font-size: 11px; margin: 4px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #1a73e8; font-family: sans-serif;" contenteditable="false">📎 ${file.name}</span>&nbsp;`;
        }
        insertHTMLAtSavedRange(html, savedRange);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handlePaste = (e) => {
    const selection = window.getSelection();
    let savedRange = null;
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRange = range.cloneRange();
      }
    }

    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        e.preventDefault();
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgHtml = `<img src="${event.target.result}" style="max-width: 320px; height: auto; border-radius: 6px; display: block; margin: 8px 0;" />`;
          insertHTMLAtSavedRange(imgHtml, savedRange);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const applyFontSize = (size) => {
    document.execCommand('fontSize', false, '7');
    if (editorRef.current) {
      const fontElements = editorRef.current.getElementsByTagName('font');
      for (let el of fontElements) {
        if (el.size === '7') {
          el.removeAttribute('size');
          el.style.fontSize = size;
        }
      }
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyFontFamily = (family) => {
    document.execCommand('fontName', false, family);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorClick = (e) => {
    if (e.target.tagName === 'IMG') {
      setSelectedImg(e.target);
    } else {
      setSelectedImg(null);
    }
  };

  const handleCut = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      navigator.clipboard.writeText(selection.toString());
      document.execCommand('delete');
      onChange(editorRef.current.innerHTML);
    } else if (selectedImg) {
      navigator.clipboard.writeText(selectedImg.outerHTML);
      selectedImg.remove();
      setSelectedImg(null);
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCopy = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      navigator.clipboard.writeText(selection.toString());
    } else if (selectedImg) {
      navigator.clipboard.writeText(selectedImg.outerHTML);
    }
  };

  const handlePasteBtn = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const selection = window.getSelection();
        let savedRange = null;
        if (selection.rangeCount) {
          const range = selection.getRangeAt(0);
          if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
            savedRange = range.cloneRange();
          }
        }
        insertHTMLAtSavedRange(text, savedRange);
      }
    } catch (err) {
      alert("Pasting from clipboard blocked. Please press Ctrl+V directly inside the editor.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <div className="editor-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--border)', padding: '6px', backgroundColor: '#f8f9fa', alignItems: 'center' }}>
        <button 
          type="button" 
          className={`toolbar-btn ${isBold ? 'active' : ''}`} 
          style={{ fontWeight: 'bold', padding: '4px 8px', border: 'none', background: isBold ? '#dadada' : 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            document.execCommand('bold');
            updateSelectionStates();
            if (editorRef.current) onChange(editorRef.current.innerHTML);
          }}
        >
          B
        </button>
        <button 
          type="button" 
          className={`toolbar-btn ${isItalic ? 'active' : ''}`} 
          style={{ fontStyle: 'italic', padding: '4px 8px', border: 'none', background: isItalic ? '#dadada' : 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            document.execCommand('italic');
            updateSelectionStates();
            if (editorRef.current) onChange(editorRef.current.innerHTML);
          }}
        >
          I
        </button>
        <button 
          type="button" 
          className={`toolbar-btn ${isUnderline ? 'active' : ''}`} 
          style={{ textDecoration: 'underline', padding: '4px 8px', border: 'none', background: isUnderline ? '#dadada' : 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }} 
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            document.execCommand('underline');
            updateSelectionStates();
            if (editorRef.current) onChange(editorRef.current.innerHTML);
          }}
        >
          U
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: '#ccc', margin: '0 4px' }} />

        <button 
          type="button" 
          className="toolbar-btn" 
          style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px' }} 
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleCut}
        >
          Cut
        </button>
        <button 
          type="button" 
          className="toolbar-btn" 
          style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px' }} 
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleCopy}
        >
          Copy
        </button>
        <button 
          type="button" 
          className="toolbar-btn" 
          style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '11px' }} 
          onMouseDown={(e) => e.preventDefault()}
          onClick={handlePasteBtn}
        >
          Paste
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: '#ccc', margin: '0 4px' }} />

        <select 
          className="input-field" 
          style={{ padding: '2px 4px', fontSize: '11px', width: '90px', height: '26px', cursor: 'pointer', borderRadius: '4px' }}
          onChange={(e) => {
            applyFontFamily(e.target.value);
            if (editorRef.current) editorRef.current.focus();
          }}
          defaultValue=""
        >
          <option value="" disabled>Font Style</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Courier New, monospace">Monospace</option>
          <option value="Times New Roman, serif">Times New Roman</option>
        </select>

        <select 
          className="input-field" 
          style={{ padding: '2px 4px', fontSize: '11px', width: '70px', height: '26px', cursor: 'pointer', borderRadius: '4px' }}
          onChange={(e) => {
            applyFontSize(e.target.value);
            if (editorRef.current) editorRef.current.focus();
          }}
          defaultValue=""
        >
          <option value="" disabled>Size</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="18px">18px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
        </select>

        <div style={{ width: '1px', height: '16px', backgroundColor: '#ccc', margin: '0 4px' }} />

        <button 
          type="button" 
          className="header-btn" 
          style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', height: '28px' }}
          title="Bullet List"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            document.execCommand('insertUnorderedList', false, null);
            if (editorRef.current) onChange(editorRef.current.innerHTML);
          }}
        >
          • List
        </button>
        
        <div style={{ width: '1px', height: '16px', backgroundColor: '#ccc', margin: '0 4px' }} />

        {/* Text Color Picker */}
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', cursor: 'pointer', fontSize: '11px' }} title="Font Color">
          <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>A</span>
          <input 
            type="color" 
            style={{ width: '20px', height: '20px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
            onChange={(e) => {
              document.execCommand('foreColor', false, e.target.value);
              if (editorRef.current) onChange(editorRef.current.innerHTML);
            }}
          />
        </label>

        {/* Highlight / Background Color Picker */}
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', cursor: 'pointer', fontSize: '11px' }} title="Highlight Color">
          <span style={{ backgroundColor: '#ffeb3b', color: '#000', padding: '0 4px', borderRadius: '2px', fontWeight: 'bold' }}>H</span>
          <input 
            type="color" 
            style={{ width: '20px', height: '20px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
            onChange={(e) => {
              document.execCommand('hiliteColor', false, e.target.value);
              if (editorRef.current) onChange(editorRef.current.innerHTML);
            }}
          />
        </label>

        <div style={{ width: '1px', height: '16px', backgroundColor: '#ccc', margin: '0 4px' }} />

        <button 
          type="button" 
          className="header-btn" 
          style={{ padding: '4px 8px', borderRadius: '4px', height: '26px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
          title="Attach Image, Video, or Audio file"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
          Attach
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*,audio/*,video/*"
          multiple
          onChange={handleFileUpload} 
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        onClick={(e) => {
          handleEditorClick(e);
          updateSelectionStates();
        }}
        onKeyUp={updateSelectionStates}
        onInput={() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
        onBlur={() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
        placeholder={placeholder}
        style={{
          minHeight: '180px',
          padding: '12px',
          fontSize: '13px',
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: '1.5'
        }}
      />

      {selectedImg && (
        <div style={{
          position: 'absolute',
          top: `${overlayPos.top}px`,
          left: `${overlayPos.left}px`,
          backgroundColor: '#202124',
          color: '#ffffff',
          padding: '4px 8px',
          borderRadius: '20px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          {['25%', '50%', '75%', '100%'].map(size => (
            <button
              key={size}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
              onClick={() => {
                selectedImg.style.width = size;
                selectedImg.style.maxWidth = '100%';
                onChange(editorRef.current.innerHTML);
                setTimeout(() => {
                  if (selectedImg) {
                    const rect = selectedImg.getBoundingClientRect();
                    const editorRect = editorRef.current.getBoundingClientRect();
                    setOverlayPos({
                      top: rect.top - editorRect.top + editorRef.current.scrollTop - 40,
                      left: rect.left - editorRect.left + (rect.width / 2) - 100
                    });
                  }
                }, 50);
              }}
            >
              {size}
            </button>
          ))}
          <div style={{ width: '1px', height: '12px', backgroundColor: '#5f6368' }} />
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ff4d4f',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: '2px 6px'
            }}
            onClick={() => {
              selectedImg.remove();
              setSelectedImg(null);
              onChange(editorRef.current.innerHTML);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
