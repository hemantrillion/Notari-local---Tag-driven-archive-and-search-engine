import { useState, useEffect, useRef } from 'react';
import NavigationControls from './components/NavigationControls';
import SidebarDrawerModal from './components/floating-windows/SidebarDrawerModal';
import CreateTagModal from './components/floating-windows/CreateTagModal';
import CreateSourceModal from './components/floating-windows/CreateSourceModal';
import TagEditorModal from './components/floating-windows/TagEditorModal';

const THEME_OPTIONS = [
  { id: 'default', name: 'Default' },
  { id: 'spatial_ui', name: 'Spatial UI' },
  { id: 'bento_grid', name: 'Bento Grid' },
  { id: 'liquid_glass', name: 'Liquid Glass' },
  { id: 'brutalism', name: 'Brutalism' },
  { id: 'maximalism', name: 'Maximalism' },
  { id: 'minimalism', name: 'Minimalism' },
  { id: 'claymorphism', name: 'Claymorphism' },
  { id: 'glassmorphism', name: 'Glassmorphism' },
  { id: 'neomorphism', name: 'Neomorphism' },
  { id: 'skeumorphism', name: 'Skeumorphism' },
];

const API_BASE = 'http://localhost:5005/api';

// Initial preloaded popular YouTube videos dataset
const YOUTUBE_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)', category: 'music' },
  { id: 'ke2Xj2X91LQ', title: 'Express.js & React App Architecture Walkthrough', category: 'coding' },
  { id: 's2mDyMS19t4', title: 'React JS Full Course for Beginners - 2026 Edition', category: 'coding' },
  { id: '35EQXmHKZYs', title: 'Learn Next.js App Router in 15 Minutes', category: 'coding' },
  { id: 'hQc_Y0Z7HIE', title: 'How to Make Crispy Garlic Potatoes - Chef Recipes', category: 'cooking' },
  { id: 'F182XG7yV1E', title: 'Gordon Ramsay Cooking the Ultimate Steak', category: 'cooking' },
  { id: 'fX7tPZ2qB-4', title: 'Science of Gravity and Spacetime explained simply', category: 'science' },
];

function App() {
  // Navigation & Data States (Right Panel)
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'untagged' | 'profile'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [recentShowCount, setRecentShowCount] = useState(10);
  const [activeEditLinkId, setActiveEditLinkId] = useState(null);

  // Search States (Right Panel)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Simulated Mobile Phone States (Left Panel)
  const [phoneApp, setPhoneApp] = useState('home'); // 'home' | 'browser'
  const [phoneShareOpen, setPhoneShareOpen] = useState(false);
  const [phoneShareUrl, setPhoneShareUrl] = useState('');
  const [browserUrlInput, setBrowserUrlInput] = useState('https://en.m.wikipedia.org');
  const [browserIframeUrl, setBrowserIframeUrl] = useState('http://localhost:5001/api/proxy?url=https%3A%2F%2Fen.m.wikipedia.org');
  
  // YouTube App Search inside Phone
  const [ytAppQuery, setYtAppQuery] = useState('');
  const [phoneYtVideos, setPhoneYtVideos] = useState(YOUTUBE_VIDEOS);
  
  // Tag Editor states
  const [editUrlId, setEditUrlId] = useState('');
  const [editTagLabel, setEditTagLabel] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [editNotes, setEditNotes] = useState('');
  const [editError, setEditError] = useState('');

  // Tags Registry Database state
  const [tags, setTags] = useState([]);

  // Create Tag states
  const [newTagOpen, setNewTagOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagError, setNewTagError] = useState('');

  // Inline tag creation states inside Tag Editor
  const [isCreatingTagInline, setIsCreatingTagInline] = useState(false);
  const [inlineTagName, setInlineTagName] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // Auto-complete suggestion overlay state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [showHomeSuggestions, setShowHomeSuggestions] = useState(false);
  const [homeActiveSuggestionIndex, setHomeActiveSuggestionIndex] = useState(-1);
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState('all');
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [activeViewLink, setActiveViewLink] = useState(null);
  const [detailMode, setDetailMode] = useState('view');
  const [detailTitle, setDetailTitle] = useState('');
  const [detailNotes, setDetailNotes] = useState('');
  const [activePlayerLink, setActivePlayerLink] = useState(null);
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem('appTheme') || 'default');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const changeTheme = (newTheme) => {
    setAppTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
    const themeObj = THEME_OPTIONS.find(t => t.id === newTheme);
    const themeName = themeObj ? themeObj.name : newTheme;
    showToast(`Theme changed to ${themeName}`);
  };

  const toggleThemeMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
    showToast(`${newMode === 'light' ? 'Light' : 'Dark'} mode enabled`);
  };
  const [viewHistory, setViewHistory] = useState([]);

  const navigateTo = (tab, viewLink = null) => {
    setViewHistory((prev) => [...prev, { tab: activeTab, viewLink: activeViewLink }]);
    setActiveTab(tab);
    setActiveViewLink(viewLink);
  };

  const handleGoBack = () => {
    if (viewHistory.length > 0) {
      const last = viewHistory[viewHistory.length - 1];
      setViewHistory((prev) => prev.slice(0, -1));
      setActiveTab(last.tab);
      setActiveViewLink(last.viewLink);
    } else {
      if (activeViewLink) {
        setActiveViewLink(null);
      } else if (activeTab !== 'home') {
        setActiveTab('home');
      }
    }
  };
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);
  const [logsSubTab, setLogsSubTab] = useState('change'); // 'change' | 'audit'

  // Editor rich text ref
  const editorRef = useRef(null);

  // Desktop browse file attachment ref
  const fileInputRef = useRef(null);

  // Editor format active states
  const [editorState, setEditorState] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  // Sources Registry Database states
  const [sources, setSources] = useState([]);
  const [editingSourceCode, setEditingSourceCode] = useState(null);
  const [newSourceCodeValue, setNewSourceCodeValue] = useState('');
  const [sourceEditError, setSourceEditError] = useState('');

  // Tags Registry Database edit states
  const [editingTagCode, setEditingTagCode] = useState(null);
  const [newTagLabelValue, setNewTagLabelValue] = useState('');
  const [tagEditError, setTagEditError] = useState('');

  // Create Source states
  const [newSourceOpen, setNewSourceOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceCode, setNewSourceCode] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceError, setNewSourceError] = useState('');

  // Fetch all link archive items
  const fetchLinks = async () => {
    try {
      const response = await fetch(`${API_BASE}/links`);
      const resData = await response.json();
      if (resData.success) {
        setLinks(resData.data);
      }
    } catch (err) {
      console.error('Failed to fetch links:', err);
    }
  };

  // Fetch all registered tags
  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_BASE}/tags`);
      const resData = await response.json();
      if (resData.success) {
        setTags(resData.data);
      }
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  // Fetch all registered sources
  const fetchSources = async () => {
    try {
      const response = await fetch(`${API_BASE}/sources`);
      const resData = await response.json();
      if (resData.success) {
        setSources(resData.data);
      }
    } catch (err) {
      console.error('Failed to fetch sources:', err);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    setAuditLogsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/audit-logs`);
      const resData = await response.json();
      if (Array.isArray(resData)) {
        setAuditLogs(resData);
      } else if (resData.data) {
        setAuditLogs(resData.data);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setAuditLogsLoading(false);
    }
  };

  // Search querying
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE}/search?q=${encodeURIComponent(query)}`
      );
      const resData = await response.json();
      if (resData.success) {
        setSearchResults(resData.data);
      }
    } catch (err) {
      console.error('Failed to execute search:', err);
    }
  };

  useEffect(() => {
    fetchLinks();
    fetchTags();
    fetchSources();
  }, []);
  useEffect(() => {
    if (activeViewLink) {
      setDetailTitle(activeViewLink.title || 'Untitled Page');
      setDetailNotes(activeViewLink.notes || '');
    }
  }, [activeViewLink]);
  useEffect(() => {
    document.querySelector('.search-input')?.blur();
    setSearchMode(false);
    setIsVirtualKeyboardOpen(false);
  }, [activeTab]);

  // Sync address input when navigation messages are sent from inside the proxied iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data && event.data.type === 'IFRAME_NAVIGATED') {
        setBrowserUrlInput(event.data.url);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  // Load selected editing link details into Tag Editor states
  useEffect(() => {
    if (activeEditLinkId) {
      const link = links.find((l) => l.id === activeEditLinkId) || searchResults.find((l) => l.id === activeEditLinkId);
      if (link) {
        setEditUrlId(link.readableCode);
        setEditTagLabel(link.tagLabel || '');
        const fallbackTags = link.primaryTag && link.primaryTag !== '0000' ? [{ code: link.primaryTag, label: link.tagLabel }] : [];
        setEditTags(link.tags || fallbackTags);
        setTagSearchQuery('');
        setActiveSuggestionIndex(-1);
        setEditNotes(link.notes || '');
        setEditTitle(link.title || '');
        setEditError('');
      }
    }
  }, [activeEditLinkId]);

  const updateActiveTags = (newTags) => {
    setEditTags(newTags);
    const firstTag = newTags.length > 0 ? newTags[0] : { code: '0000', label: 'untagged' };
    setEditTagLabel(firstTag.code === '0000' ? 'untagged' : firstTag.label);
    
    const parts = editUrlId.split('-');
    if (parts.length >= 6) {
      parts[2] = firstTag.code;
      setEditUrlId(parts.join('-'));
    }
  };

  // Handle Share Trigger from phone browser
  const handleTriggerBrowserShare = (url) => {
    setPhoneShareUrl(url);
    setPhoneShareOpen(true);
  };

  const submitShareTagLater = async () => {
    try {
      const response = await fetch(`${API_BASE}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: phoneShareUrl }),
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        showToast('Added to Untagged List!');
        setPhoneShareOpen(false);
        fetchLinks();
        fetchTags();
        fetchSources();
      } else {
        showToast(resData.error || 'Failed to share', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    }
  };

  const submitShareTagNow = async () => {
    try {
      const response = await fetch(`${API_BASE}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: phoneShareUrl }),
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setPhoneShareOpen(false);
        setLinks((prev) => [resData.data, ...prev]);
        setActiveEditLinkId(resData.data.id);
        fetchLinks();
        fetchTags();
        fetchSources();
      } else {
        showToast(resData.error || 'Failed to share', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    }
  };

  const handleUpdateLinkContent = async (id, title, notes, styleSettings = null) => {
    try {
      const payload = { title, notes };
      if (styleSettings) {
        payload.styleSettings = styleSettings;
      }
      const response = await fetch(`${API_BASE}/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      if (resData.success) {
        setLinks(prev => prev.map(l => l.id === id ? { ...l, ...resData.data } : l));
        setActiveViewLink(prev => prev && prev.id === id ? { ...prev, ...resData.data } : prev);
      }
    } catch (err) {
      console.error('Failed to update page content:', err);
    }
  };

  const handleDeleteLink = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_BASE}/links/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showToast('Record deleted');
        fetchLinks();
        fetchTags();
        fetchSources();
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleBackgroundClick = () => {
    if (document.activeElement && document.activeElement.classList.contains('search-input')) {
      return;
    }
    setSearchMode(false);
    setIsVirtualKeyboardOpen(false);
    setDrawerOpen(false);
  };

  // Filter tagged vs untagged links
  const taggedLinks = links.filter((l) => l.primaryTag !== '0000');
  const untaggedLinks = links.filter((l) => l.primaryTag === '0000');

  // Simulated virtual keyboard key press
  const handleKeyboardPress = (char) => {
    if (char === 'SPACE') {
      setSearchQuery((prev) => {
        const newVal = prev + ' ';
        setShowHomeSuggestions(true);
        setHomeActiveSuggestionIndex(-1);
        setIsSearchSubmitted(false);
        return newVal;
      });
    } else if (char === 'BACKSPACE') {
      setSearchQuery((prev) => {
        const newVal = prev.slice(0, -1);
        setShowHomeSuggestions(true);
        setHomeActiveSuggestionIndex(-1);
        setIsSearchSubmitted(false);
        return newVal;
      });
    } else if (char === 'CLOSE' || char === 'DONE') {
      setIsVirtualKeyboardOpen(false);
      setShowHomeSuggestions(false);
      setIsSearchSubmitted(true);
      handleSearch(searchQuery);
    } else {
      setSearchQuery((prev) => {
        const newVal = prev + char;
        setShowHomeSuggestions(true);
        setHomeActiveSuggestionIndex(-1);
        setIsSearchSubmitted(false);
        return newVal;
      });
    }
  };

  const loadBookmark = (url) => {
    setBrowserUrlInput(url);
    setBrowserIframeUrl(`http://localhost:5005/api/proxy?url=${encodeURIComponent(url)}`);
  };

  const handleBrowserGo = () => {
    let url = browserUrlInput.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    setBrowserUrlInput(url);
    setBrowserIframeUrl(`http://localhost:5005/api/proxy?url=${encodeURIComponent(url)}`);
  };

  // Live YouTube search submit handler
  const handleYtAppSearchSubmit = async (e) => {
    e.preventDefault();
    if (!ytAppQuery.trim()) {
      setPhoneYtVideos(YOUTUBE_VIDEOS);
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/youtube/search?q=${encodeURIComponent(ytAppQuery)}`);
      const resData = await response.json();
      if (resData.success) {
        setPhoneYtVideos(resData.data);
      }
    } catch (err) {
      console.error('Failed to search YouTube:', err);
    }
  };

  // Format Helper: ISO date string to DD-MM-YYYY
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const DD = String(d.getDate()).padStart(2, '0');
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const YYYY = d.getFullYear();
    return `${DD}-${MM}-${YYYY}`;
  };

  // Format Helper: ISO date string to HH:MM:SS
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  // Save edits inside Tag Editor
  const handleSaveTagEditor = async () => {
    const finalNotes = editNotes;

    // 1. Resolve any unsaved text in the tagSearchQuery input box
    let finalTags = [...editTags];
    if (tagSearchQuery.trim() !== '') {
      const cleanSearch = tagSearchQuery.trim();
      const matched = tags.find(t => t.label.toLowerCase() === cleanSearch.toLowerCase());
      if (matched) {
        if (!finalTags.some(t => t.code === matched.code)) {
          finalTags.push(matched);
        }
      } else {
        // Automatically create the new tag
        try {
          const createRes = await fetch(`${API_BASE}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label: cleanSearch })
          });
          const createData = await createRes.json();
          if (createRes.ok && createData.data) {
            finalTags.push(createData.data);
            await fetchTags(); // refresh tag database registry
          } else {
            setEditError(createData.error || 'Failed to create tag');
            showToast(createData.error || 'Failed to create tag', 'error');
            return;
          }
        } catch (err) {
          setEditError('Server connection error.');
          showToast('Server connection error.', 'error');
          return;
        }
      }
    }

    // 2. Sync computed primary tag code back to URL ID manual override
    const firstTag = finalTags.length > 0 ? finalTags[0] : { code: '0000', label: 'untagged' };
    let finalReadableCode = editUrlId;
    const parts = editUrlId.split('-');
    if (parts.length >= 6) {
      parts[2] = firstTag.code;
      finalReadableCode = parts.join('-');
    }

    // 3. Validate manual URL ID syntax
    const regex = /^[a-z]{3}-[a-z]{3}-[a-z0-9]{4}-\d{2}-\d{4}-\d{3}$/;
    if (!regex.test(finalReadableCode)) {
      setEditError('Cannot be tagged');
      showToast('Cannot be tagged', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/links/${activeEditLinkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readableCode: finalReadableCode,
          tags: finalTags,
          notes: finalNotes,
          title: editTitle
        })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setActiveEditLinkId(null);
        showToast('Tag saved successfully!');
        fetchLinks();
        fetchTags();
        fetchSources();
      } else {
        setEditError(resData.error || 'Cannot be tagged');
        showToast(resData.error || 'Cannot be tagged', 'error');
      }
    } catch (err) {
      setEditError('Cannot be tagged');
      showToast('Cannot be tagged', 'error');
    }
  };

  const handleCreateTagSubmit = async () => {
    const cleanLabel = newTagLabel.trim().toLowerCase();
    if (!cleanLabel) {
      setNewTagError('Tag label cannot be empty.');
      return;
    }
    const regex = /^[a-z][a-z0-9\s]*$/;
    if (!regex.test(cleanLabel)) {
      setNewTagError('Tag label must start with a letter and contain only lowercase letters, numbers, or spaces.');
      return;
    }

    const exists = tags.some(t => t.label.toLowerCase() === cleanLabel);
    if (exists) {
      setNewTagError('This tag already exists.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: cleanLabel })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setNewTagOpen(false);
        fetchTags();
      } else {
        setNewTagError(resData.error || 'Failed to create tag.');
      }
    } catch (err) {
      setNewTagError('Server connection error.');
    }
  };

  const handleCreateSourceSubmit = async () => {
    const cleanName = newSourceName.trim().toLowerCase();
    const cleanCode = newSourceCode.trim().toLowerCase();
    const cleanUrl = newSourceUrl.trim().toLowerCase();

    if (!cleanName || !cleanCode) {
      setNewSourceError('Source name and code are required.');
      return;
    }

    const codeRegex = /^[a-z]{3}$/;
    if (!codeRegex.test(cleanCode)) {
      setNewSourceError('Source code must be exactly 3 lowercase letters.');
      return;
    }

    const nameRegex = /^[a-z][a-z0-9\s]*$/;
    if (!nameRegex.test(cleanName)) {
      setNewSourceError('Source name must start with a letter and contain only lowercase letters, numbers, or spaces.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, code: cleanCode, url: cleanUrl })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setNewSourceOpen(false);
        setNewSourceName('');
        setNewSourceCode('');
        setNewSourceUrl('');
        setNewSourceError('');
        fetchSources();
      } else {
        setNewSourceError(resData.error || 'Failed to create source.');
      }
    } catch (err) {
      setNewSourceError('Server connection error.');
    }
  };

  // Update visual active state of formatting buttons
  const updateEditorActiveStates = () => {
    setEditorState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  };

  // Apply custom font size inside contentEditable selection
  const applyFontSize = (size) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = size;
    span.appendChild(range.extractContents());
    range.insertNode(span);
  };

  // Apply custom font family inside contentEditable selection
  const applyFontFamily = (family) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontFamily = family;
    span.appendChild(range.extractContents());
    range.insertNode(span);
  };

  // Intercept Paste events in contentEditable to enforce max-width on images
  const handlePaste = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        e.preventDefault(); // Stop default full-size paste
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          // Enforce max-width: 320px inline styling and responsive aspect ratio
          const imgHtml = `<img src="${event.target.result}" style="max-width: 320px; height: auto; border-radius: 6px; display: block; margin: 8px 0;" />`;
          document.execCommand('insertHTML', false, imgHtml);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle uploading files (images, audio, video) from desktop
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (file.type.startsWith('image/')) {
        // Enforce max-width: 320px for image
        const imgHtml = `<img src="${dataUrl}" style="max-width: 320px; height: auto; border-radius: 6px; display: block; margin: 8px 0;" />`;
        document.execCommand('insertHTML', false, imgHtml);
      } else if (file.type.startsWith('audio/')) {
        const audioHtml = `<audio controls src="${dataUrl}" style="max-width: 100%; display: block; margin: 8px 0;"></audio>`;
        document.execCommand('insertHTML', false, audioHtml);
      } else if (file.type.startsWith('video/')) {
        // Enforce max-width: 320px for video
        const videoHtml = `<video controls src="${dataUrl}" style="max-width: 320px; height: auto; border-radius: 6px; display: block; margin: 8px 0;"></video>`;
        document.execCommand('insertHTML', false, videoHtml);
      } else {
        const linkHtml = `<span style="background-color: #e8f0fe; color: #1a73e8; padding: 3px 8px; border-radius: 12px; font-size: 11px; margin: 4px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #1a73e8; font-family: sans-serif;" contenteditable="false">📎 ${file.name}</span>&nbsp;`;
        document.execCommand('insertHTML', false, linkHtml);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className={`split-layout theme-${appTheme} mode-${themeMode}`}>
      
      {/* ========================================================
          LEFT SIDE: MOCK PHONE SCREEN (PROPORTION LOCKED TO 2:0.9)
          ======================================================== */}
      <div className="phone-side">
        <div className="phone-screen">
          
          {/* 1. Phone Launcher / Home Screen */}
          {phoneApp === 'home' && (
            <div className="phone-home">
              <div className="phone-app-grid">
                <div 
                  className="phone-app-icon" 
                  style={{ backgroundColor: '#ffffff', border: '1px solid #ddd', color: '#1a73e8' }}
                  onClick={() => {
                    setPhoneApp('browser');
                    loadBookmark('https://en.m.wikipedia.org');
                  }}
                >
                  <span style={{ fontSize: '20px' }}>🌐</span>
                  <span style={{ color: '#202124', fontSize: '9px', fontWeight: 'bold' }}>Browser</span>
                </div>

                <div 
                  className="phone-app-icon" 
                  style={{ backgroundColor: '#ff0000' }}
                  onClick={() => setPhoneApp('youtube')}
                >
                  <span style={{ fontSize: '20px' }}>▶</span>
                  <span style={{ fontSize: '9px', fontWeight: 'bold' }}>YouTube</span>
                </div>

                <div 
                  className="phone-app-icon" 
                  style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                  onClick={() => {
                    setPhoneApp('browser');
                    loadBookmark('https://www.instagram.com');
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📸</span>
                  <span style={{ fontSize: '9px', fontWeight: 'bold' }}>Instagram</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', color: '#5f6368', fontSize: '11px' }}>
                Tap an app to open real mobile sites inside simulator
              </div>
            </div>
          )}

          {/* 2. Interactive Browser view (Loads sites via proxy) */}
          {phoneApp === 'browser' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Browser Address Bar & Actions */}
              <div style={{ padding: '8px', borderBottom: '1px solid #dadce0', background: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button className="btn-sm" style={{ padding: '4px 8px' }} onClick={() => setPhoneApp('home')}>
                    Home
                  </button>
                  <input
                    type="text"
                    style={{ flex: 1, padding: '4px 8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                    value={browserUrlInput}
                    onChange={(e) => setBrowserUrlInput(e.target.value)}
                    placeholder="Type URL..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleBrowserGo();
                    }}
                  />
                  <button className="btn-sm" style={{ padding: '4px 8px' }} onClick={handleBrowserGo}>
                    Go
                  </button>
                  <button 
                    className="btn-sm" 
                    style={{ padding: '4px 8px', backgroundColor: '#34a853' }} 
                    onClick={() => handleTriggerBrowserShare(browserUrlInput)}
                    title="Share Page"
                  >
                    ↗️
                  </button>
                </div>

                {/* Preloaded bookmarks */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', fontSize: '10px' }}>
                  <span style={{ color: '#666', alignSelf: 'center', marginRight: '2px' }}>Quick links:</span>
                  <button style={{ background: '#e8f0fe', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }} onClick={() => loadBookmark('https://m.youtube.com')}>
                    YouTube
                  </button>
                  <button style={{ background: '#e8f0fe', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }} onClick={() => loadBookmark('https://www.instagram.com')}>
                    Instagram
                  </button>
                  <button style={{ background: '#e8f0fe', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }} onClick={() => loadBookmark('https://en.m.wikipedia.org')}>
                    Wikipedia
                  </button>
                  <button style={{ background: '#e8f0fe', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }} onClick={() => loadBookmark('https://news.ycombinator.com')}>
                    HackerNews
                  </button>
                </div>
              </div>

              {/* Real Web Render Viewport */}
              <div style={{ flex: 1, backgroundColor: '#ffffff', position: 'relative' }}>
                <iframe
                  src={browserIframeUrl}
                  title="Mobile Browser Viewport"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
          )}

          {/* 3. YouTube Mobile (Loads Real Live YouTube Embed Players) */}
          {phoneApp === 'youtube' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0f0f0f', color: '#ffffff' }}>
              
              {/* YouTube App Header */}
              <div style={{ padding: '10px 12px', backgroundColor: '#212121', borderBottom: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#ff0000', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ▶ <span style={{ color: '#ffffff', fontSize: '13px' }}>YouTube</span>
                  </span>
                  <button className="btn-sm" style={{ padding: '4px 8px' }} onClick={() => setPhoneApp('home')}>
                    Home
                  </button>
                </div>
                
                {/* Search videos inside YouTube */}
                <form onSubmit={handleYtAppSearchSubmit}>
                  <input 
                    type="text" 
                    placeholder="🔍 Search videos..." 
                    style={{ width: '100%', padding: '6px 10px', fontSize: '11px', border: 'none', borderRadius: '16px', background: '#383838', color: '#fff', boxSizing: 'border-box' }}
                    value={ytAppQuery}
                    onChange={(e) => setYtAppQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Video List Grid (Real YouTube embeds playing live) */}
              <div className="mock-app-body" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {phoneYtVideos.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#888', padding: '24px 0', fontSize: '12px' }}>
                    No videos found matching "{ytAppQuery}"
                  </div>
                ) : (
                  phoneYtVideos.map(video => (
                    <div key={video.id} style={{ background: '#212121', padding: '8px', borderRadius: '8px', border: '1px solid #333' }}>
                      <iframe 
                        width="100%" 
                        height="160" 
                        src={`https://www.youtube.com/embed/${video.id}`} 
                        title={video.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        style={{ borderRadius: '4px' }}
                      />
                      <div style={{ padding: '8px 0 0' }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#fff', lineHeight: '1.3', height: '32px', overflow: 'hidden' }}>
                          {video.title}
                        </div>
                        <button 
                          className="btn-sm" 
                          style={{ marginTop: '8px', width: '100%', backgroundColor: '#ff0000', fontWeight: 'bold' }}
                          onClick={() => handleTriggerBrowserShare(`https://www.youtube.com/watch?v=${video.id}`)}
                        >
                          Share Video
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. Instagram Mobile (Loads Real Instagram Posts) */}
          {phoneApp === 'instagram' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000000', color: '#ffffff' }}>
              
              {/* Instagram App Header */}
              <div className="mock-app-header" style={{ backgroundColor: '#000000', color: '#ffffff', borderBottom: '1px solid #222' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'serif', letterSpacing: '0.5px' }}>Instagram</span>
                <button className="btn-sm" style={{ padding: '4px 8px' }} onClick={() => setPhoneApp('home')}>Home</button>
              </div>

              {/* Reels Feed using actual embed layouts */}
              <div className="mock-app-body" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Reel Post 1 */}
                <div style={{ border: '1px solid #222', borderRadius: '12px', padding: '12px', background: '#111' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#333' }} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>cooking_delights</span>
                  </div>
                  
                  {/* Real Instagram photo source simulation */}
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop" 
                    alt="Cooking Reel" 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                  />
                  
                  <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '8px' }}>
                    Crispy Garlic Butter Potatoes Recipe! 🥔🔥
                  </div>
                  <button 
                    className="btn-sm" 
                    style={{ width: '100%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', fontWeight: 'bold' }}
                    onClick={() => handleTriggerBrowserShare('https://www.instagram.com/p/C9_GarlicPotatoes/')}
                  >
                    Share Reel Link
                  </button>
                </div>

                {/* Reel Post 2 */}
                <div style={{ border: '1px solid #222', borderRadius: '12px', padding: '12px', background: '#111' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#333' }} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>tech_guru</span>
                  </div>
                  
                  <img 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop" 
                    alt="Gaming Setup" 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                  />
                  
                  <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '8px' }}>
                    Rate this minimalist coding setup! 💻⌨️
                  </div>
                  <button 
                    className="btn-sm" 
                    style={{ width: '100%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', fontWeight: 'bold' }}
                    onClick={() => handleTriggerBrowserShare('https://www.instagram.com/p/C9_MinimalSetup/')}
                  >
                    Share Post Link
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Simulated Phone Share Dialog (No Authentication) */}
          {phoneShareOpen && (
            <div className="phone-share-overlay animate-fade">
              <div className="phone-share-dialog">
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', textAlign: 'center' }}>
                  Share to Link Keeper
                </h4>
                
                <div className="input-group" style={{ marginBottom: '14px' }}>
                  <span className="input-label" style={{ fontSize: '10px' }}>URL to Send</span>
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ padding: '8px', fontSize: '11px' }}
                    value={phoneShareUrl} 
                    onChange={(e) => setPhoneShareUrl(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="white-theme-btn" style={{ flex: 1, padding: '8px' }} onClick={submitShareTagLater}>
                    Tag Later
                  </button>
                  <button className="white-theme-btn primary" style={{ flex: 1, padding: '8px' }} onClick={submitShareTagNow}>
                    Tag Now
                  </button>
                </div>
                
                <button 
                  className="delete-btn" 
                  style={{ display: 'block', margin: '8px auto 0', color: '#888', fontSize: '11px' }}
                  onClick={() => setPhoneShareOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================
          RIGHT SIDE: THE LINK KEEPER APP
          ======================================================== */}
      <div className="app-side" onClick={handleBackgroundClick}>
        
        {/* 1. Static Top Header Bar */}
        <header className="app-header" onClick={(e) => e.stopPropagation()}>
          <div className="header-left">
            <button 
              className="header-btn" 
              onClick={() => {
                setDrawerOpen(true);
                document.querySelector('.search-input')?.blur();
              }}
              title="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <NavigationControls
              isEditing={false}
              onGoBack={handleGoBack}
              onGoHome={() => {
                setActiveTab('home');
                setActiveViewLink(null);
                setIsSearchSubmitted(false);
                setSearchQuery('');
              }}
            />
            <div className="header-title">
              {activeTab === 'home' ? '' : activeTab}
            </div>
          </div>
          
          <div className="header-right">
            <button 
              className="header-btn" 
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('profile');
                setSearchMode(false);
              }}
              title="Profile"
            >
              <div className="avatar">u</div>
            </button>
          </div>
        </header>

        {/* Modular Sidebar Drawer Floating Window */}
        <SidebarDrawerModal
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          activeTab={activeTab}
          navigateTo={navigateTo}
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}
          fetchAuditLogs={fetchAuditLogs}
          showToast={showToast}
        />

        {/* 2. Inner scrollable content area below header */}
        <div className="app-content">
          {/* Dim backdrop overlay behind search */}
          <div className={`search-backdrop ${searchMode ? 'visible' : ''}`} />

        {/* Home Feed Content (Search Box & Recent Additions) */}
        {activeTab === 'home' && (
          activeViewLink ? (
            <WebsiteDetailView 
              link={activeViewLink}
              detailMode={detailMode}
              setDetailMode={setDetailMode}
              detailTitle={detailTitle}
              setDetailTitle={setDetailTitle}
              detailNotes={detailNotes}
              setDetailNotes={setDetailNotes}
              onBack={() => setActiveViewLink(null)}
              onOpenPlayer={(url) => setActivePlayerLink(url)}
              onSave={async (title, notes) => {
                await handleUpdateLinkContent(activeViewLink.id, title, notes);
                setDetailMode('view');
              }}
              onSaveStyles={async (styleSettings) => {
                await handleUpdateLinkContent(activeViewLink.id, activeViewLink.title, activeViewLink.notes, styleSettings);
              }}
            />
          ) : (
            <div className="home-scroll-layout">
{/* Search Box absolute centered */}
            <div 
              className={`search-container ${searchMode ? 'focused' : ''}`}
              onClick={(e) => e.stopPropagation()} // Prevent closing on click inside search
            >
              <div className="app-branding">A Sap Link</div>
              
              <div className="search-bar-wrapper" style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search tags, URLs, or notes..."
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    if (!val.trim()) {
                      setSearchResults([]);
                      setIsSearchSubmitted(false);
                    } else {
                      setIsSearchSubmitted(false);
                    }
                    setShowHomeSuggestions(true);
                    setHomeActiveSuggestionIndex(-1);
                  }}
                  onFocus={() => {
                    setSearchMode(true);
                    setIsVirtualKeyboardOpen(true);
                    setShowHomeSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowHomeSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    const lastPart = searchQuery.split(/[|,]/).pop().trim().toLowerCase();
                    const currentTokens = searchQuery.split(/[|,]/).map(p => p.trim().toLowerCase()).filter(Boolean);
                    const filtered = tags.filter(t => 
                      lastPart && 
                      t.label.toLowerCase().includes(lastPart) &&
                      !currentTokens.slice(0, -1).includes(t.label.toLowerCase())
                    );
                    if (filtered.length > 0) {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setHomeActiveSuggestionIndex(prev => {
                          const nextIndex = prev + 1;
                          return nextIndex >= filtered.length ? 0 : nextIndex;
                        });
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setHomeActiveSuggestionIndex(prev => {
                          const nextIndex = prev - 1;
                          return nextIndex < 0 ? filtered.length - 1 : nextIndex;
                        });
                      } else if (e.key === 'Enter') {
                        if (homeActiveSuggestionIndex >= 0 && homeActiveSuggestionIndex < filtered.length) {
                          e.preventDefault();
                          const selectedTag = filtered[homeActiveSuggestionIndex];
                          const parts = searchQuery.split(/[|,]/);
                          parts.pop();
                          parts.push(selectedTag.label);
                          const newQuery = parts.map(p => p.trim()).filter(Boolean).join(' | ') + ' | ';
                          setSearchQuery(newQuery);
                          setShowHomeSuggestions(false);
                          setHomeActiveSuggestionIndex(-1);
                        } else {
                          // Submit search and close keyboard!
                          setIsVirtualKeyboardOpen(false);
                          setShowHomeSuggestions(false);
                          setIsSearchSubmitted(true);
                          handleSearch(searchQuery);
                        }
                      } else if (e.key === 'Escape') {
                        setShowHomeSuggestions(false);
                        setHomeActiveSuggestionIndex(-1);
                      }
                    } else if (e.key === 'Enter') {
                      // Submit search and close keyboard even if no suggestions match!
                      setIsVirtualKeyboardOpen(false);
                      setShowHomeSuggestions(false);
                      setIsSearchSubmitted(true);
                      handleSearch(searchQuery);
                    }
                  }}
                />
                {searchQuery && (
                  <button 
                    className="search-send-btn" 
                    title="Submit Search"
                    onClick={() => {
                      setShowHomeSuggestions(false);
                      setIsVirtualKeyboardOpen(false);
                      setSearchMode(true);
                      setIsSearchSubmitted(true);
                      handleSearch(searchQuery);
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                )}

                {showHomeSuggestions && searchQuery.trim() !== '' && (
                  <div 
                    className="suggestions-overlay-list"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      maxHeight: '150px',
                      overflowY: 'auto',
                      zIndex: 110,
                      marginTop: '4px'
                    }}
                  >
                    {(() => {
                      const lastPart = searchQuery.split(/[|,]/).pop().trim().toLowerCase();
                      const currentTokens = searchQuery.split(/[|,]/).map(p => p.trim().toLowerCase()).filter(Boolean);
                      const filtered = tags.filter(t => 
                        lastPart && 
                        t.label.toLowerCase().includes(lastPart) &&
                        !currentTokens.slice(0, -1).includes(t.label.toLowerCase())
                      );
                      if (filtered.length === 0) return null;
                      return filtered.map((t, idx) => {
                        const isSelected = idx === homeActiveSuggestionIndex;
                        return (
                          <div 
                            key={t.code}
                            style={{
                              padding: '8px 12px',
                              fontSize: '13px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? '#e8f0fe' : '#ffffff',
                              borderBottom: '1px solid #f1f3f4',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              textAlign: 'left'
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                            }}
                            onClick={() => {
                              const parts = searchQuery.split(/[|,]/);
                              parts.pop();
                              parts.push(t.label);
                              const newQuery = parts.map(p => p.trim()).filter(Boolean).join(' | ') + ' | ';
                              setSearchQuery(newQuery);
                              setShowHomeSuggestions(false);
                              setHomeActiveSuggestionIndex(-1);
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f3f4'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isSelected ? '#e8f0fe' : '#ffffff'; }}
                          >
                            <span style={{ fontWeight: '500', color: 'var(--text)' }}>{t.label}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tag ({t.code})</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Additions / Search results starting at 75% height */}
            <div 
              className={`recent-feed-container ${searchMode && !isSearchSubmitted ? 'hidden' : ''}`}
              onClick={(e) => e.stopPropagation()} // Prevent background dismiss
            >
              {isSearchSubmitted ? (
                /* GOOGLE-STYLE SEARCH RESULTS */
                <div>
                  {/* Google-style Tabs */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      gap: '32px', 
                      borderBottom: '1px solid #ebebeb', 
                      paddingBottom: '8px', 
                      marginBottom: '16px',
                      overflowX: 'auto',
                      scrollbarWidth: 'none'
                    }}
                  >
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'images', label: 'Images' },
                      { id: 'videos', label: 'Videos' }
                    ].map(t => {
                      const isActive = activeSearchTab === t.id;
                      return (
                        <span 
                          key={t.id}
                          onClick={() => setActiveSearchTab(t.id)}
                          style={{
                            fontSize: '13px',
                            fontWeight: isActive ? '600' : '400',
                            color: isActive ? '#1a73e8' : '#70757a',
                            cursor: 'pointer',
                            paddingBottom: '8px',
                            borderBottom: isActive ? '3px solid #1a73e8' : '3px solid transparent',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {t.label}
                        </span>
                      );
                    })}
                  </div>

                  {(() => {
                    const filteredSearchResults = searchResults.filter(link => {
                      if (activeSearchTab === 'images') {
                        return (
                          link.typeCode === 'img' || 
                          /\.(jpg|jpeg|png|gif|webp|svg)/i.test(link.url) ||
                          /<img[^>]+src=/i.test(link.notes || '')
                        );
                      }
                      if (activeSearchTab === 'videos') {
                        return (
                          link.typeCode === 'vid' || 
                          /youtube\.com|youtu\.be|vimeo\.com/i.test(link.url) ||
                          /<(video|iframe)[^>]+src=/i.test(link.notes || '')
                        );
                      }
                      if (activeSearchTab === 'new') {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        return new Date(link.createdAt) >= sevenDaysAgo;
                      }
                      return true;
                    });
                    return (
                      <>
                        {filteredSearchResults.length === 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100px', padding: '40px 0' }}>
                            <p style={{ fontSize: '14px', color: 'var(--text-color)', margin: 0, fontWeight: '500' }}>
                              Did not find and relatable content.
                            </p>
                          </div>
                        ) : (
                          filteredSearchResults.map(link => {
                            const imageSrc = activeSearchTab === 'images' ? (
                              /\.(jpg|jpeg|png|gif|webp|svg)/i.test(link.url) ? link.url :
                              (link.notes || '').match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ||
                              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop'
                            ) : null;

                            const videoEmbedSrc = activeSearchTab === 'videos' ? (
                              /youtube\.com|youtu\.be/i.test(link.url) ? (
                                `https://www.youtube.com/embed/${link.url.includes('v=') ? link.url.split('v=')[1].split('&')[0] : link.url.split('/').pop()}`
                              ) : (link.notes || '').match(/<(video|iframe)[^>]+src=["']([^"']+)["']/i)?.[1]
                            ) : null;

                            return (
                              <div 
                                key={link.id} 
                                className="result-card animate-fade"
                                onClick={() => {
                                  navigateTo(activeTab, link);
                                  setDetailMode('view');
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                  <span className="result-breadcrumb" style={{ margin: 0 }}>
                                    {link.from} &gt; {link.tags && link.tags.length > 0 ? link.tags.map(t => t.label).join(' | ') : (link.tagLabel || 'untagged')}
                                  </span>
                                  <span style={{ color: '#70757a', fontSize: '12px' }}>•</span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{link.readableCode}</span>
                                </div>

                                {/* Media Rendering for Images / Videos Search Tabs */}
                                {activeSearchTab === 'images' && imageSrc && (
                                  <div style={{ marginBottom: '10px' }}>
                                    <img 
                                      src={imageSrc} 
                                      alt={link.title || 'Image Preview'} 
                                      style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} 
                                    />
                                  </div>
                                )}

                                {activeSearchTab === 'videos' && videoEmbedSrc && (
                                  <div style={{ marginBottom: '10px' }}>
                                    <iframe 
                                      src={videoEmbedSrc} 
                                      title={link.title || 'Video Player'}
                                      style={{ width: '100%', height: '220px', borderRadius: '8px', border: 'none' }}
                                      allowFullScreen
                                    />
                                  </div>
                                )}

                                <div style={{ marginBottom: '4px' }}>
                                  <a 
                                    href="#" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      navigateTo(activeTab, link);
                                      setDetailMode('view');
                                    }}
                                    className="result-title-link" 
                                    style={{ fontSize: '15px', fontWeight: '600', color: '#1a73e8', textDecoration: 'none' }}
                                  >
                                    {link.title || 'Untitled Page'}
                                  </a>
                                </div>
                                <div 
                                  className="result-excerpt" 
                                  style={{ fontSize: '13px', color: 'var(--text-muted, #5f6368)', lineHeight: '1.5', marginTop: '6px' }}
                                >
                                  {getCleanTextExcerpt(link.notes)}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                /* RECENT ADDITIONS FEED */
                <div>
                  <div className="feed-header">Recent Additions</div>
                  {taggedLinks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '24px 0' }}>
                      No tagged links saved. Use the simulated phone to share posts!
                    </div>
                  ) : (
                    <>
                      {taggedLinks.slice(0, recentShowCount).map((link) => (
                        <div 
                          key={link.id} 
                          className="result-card animate-fade"
                          onClick={() => {
                            setActiveViewLink(link);
                            setDetailMode('view');
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="result-breadcrumb">
                            {link.from} &gt; {link.tags && link.tags.length > 0 ? link.tags.map(t => t.label).join(' | ') : (link.tagLabel || 'untagged')}
                          </span>
                          <div style={{ marginBottom: '4px' }}>
                            <a 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveViewLink(link);
                                setDetailMode('view');
                              }}
                              className="result-title-link" 
                              style={{ fontSize: '15px', fontWeight: '600', color: '#1a73e8', textDecoration: 'none' }}
                            >
                              {link.title || 'Untitled Page'}
                            </a>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <a 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveViewLink(link);
                                setDetailMode('view');
                              }}
                              style={{ fontSize: '12px', color: '#70757a', textDecoration: 'none', wordBreak: 'break-all' }}
                            >
                              {displayUrl(link.url)}
                            </a>
                          </div>
                          <div className="result-meta" style={{ fontSize: '11px', color: '#70757a' }}>
                            <span>{formatDate(link.createdAt)} {formatTime(link.createdAt)}</span>
                          </div>
                        </div>
                      ))}

                      {taggedLinks.length > recentShowCount && recentShowCount < 20 && (
                        <button 
                          className="white-theme-btn" 
                          style={{ width: '100%', marginTop: '12px', padding: '8px' }}
                          onClick={() => setRecentShowCount(20)}
                        >
                          Show More
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            </div>
          )
        )}

        {/* Untagged Table Screen */}
        {activeTab === 'untagged' && (
          <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>


            <div style={{ overflowX: 'auto', flex: 1 }}>
              {untaggedLinks.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>
                  No untagged records found.
                </div>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>URL ID</th>
                      <th>Clean URL</th>
                      <th>Date Added</th>
                      <th>Time Added</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {untaggedLinks.map((link) => (
                      <tr key={link.id}>
                        <td>
                          <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{link.readableCode}</div>
                        </td>
                        <td>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ fontSize: '12px', color: '#1a73e8', textDecoration: 'none', wordBreak: 'break-all' }}
                          >
                            {link.url}
                          </a>
                        </td>
                        <td>{formatDate(link.createdAt)}</td>
                        <td>{formatTime(link.createdAt)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              className="btn-sm"
                              onClick={() => setActiveEditLinkId(link.id)}
                            >
                              Add Tag
                            </button>
                            <button 
                              className="btn-sm-danger"
                              onClick={(e) => handleDeleteLink(link.id, e)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tagged Table Screen */}
        {activeTab === 'tagged' && (
          <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>


            <div style={{ overflowX: 'auto', flex: 1 }}>
              {taggedLinks.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>
                  No tagged records found.
                </div>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>URL ID</th>
                      <th>Heading</th>
                      <th>Clean URL</th>
                      <th>Tag</th>
                      <th>Date Added</th>
                      <th>Time Added</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taggedLinks.map((link) => (
                      <tr key={link.id}>
                        <td>
                          <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{link.readableCode}</div>
                        </td>
                        <td>
                          {(() => {
                            const titleText = link.title || 'No Title';
                            const truncatedTitle = titleText.length > 25 ? titleText.substring(0, 25) + '...' : titleText;
                            return (
                              <div className="text-hover-container" style={{ fontSize: '12px', fontWeight: '500', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {truncatedTitle}
                                <div className="text-tooltip-box">
                                  {titleText}
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td>
                          {(() => {
                            const truncatedUrl = link.url.length > 30 ? link.url.substring(0, 30) + '...' : link.url;
                            const isCopied = copiedLinkId === link.id;
                            return (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', maxWidth: '240px' }}>
                                <div className="text-hover-container" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ fontSize: '12px', color: '#1a73e8', textDecoration: 'none' }}
                                  >
                                    {truncatedUrl}
                                  </a>
                                  <div className="text-tooltip-box">
                                    {link.url}
                                  </div>
                                </div>
                                <button
                                  title={isCopied ? "Copied!" : "Copy URL"}
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: isCopied ? 1 : 0.6,
                                    transition: 'opacity 0.2s'
                                  }}
                                  onMouseEnter={(e) => { if (!isCopied) e.currentTarget.style.opacity = 1; }}
                                  onMouseLeave={(e) => { if (!isCopied) e.currentTarget.style.opacity = 0.6; }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigator.clipboard.writeText(link.url);
                                    setCopiedLinkId(link.id);
                                    setTimeout(() => setCopiedLinkId(null), 1500);
                                  }}
                                >
                                  {isCopied ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f9d58" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                  )}
                                </button>
                                <button
                                  title="Open Preview Player"
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.6,
                                    transition: 'opacity 0.2s',
                                    marginLeft: '4px'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.6; }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActivePlayerLink(link.url);
                                  }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                  </svg>
                                </button>
                              </div>
                            );
                          })()}
                        </td>
                        <td>
                          {(() => {
                            const activeTags = link.tags && link.tags.length > 0
                              ? link.tags
                              : (link.tagLabel && link.tagLabel !== 'untagged'
                                  ? [{ code: link.primaryTag || '0000', label: link.tagLabel }]
                                  : []);

                            return (
                              <div 
                                className="tags-hover-container" 
                                style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center', position: 'relative', cursor: 'pointer' }}
                              >
                                {activeTags.length > 0 ? (
                                  <>
                                    {activeTags.slice(0, 2).map(t => (
                                      <span key={t.code} style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                        {t.label}
                                      </span>
                                    ))}
                                    {activeTags.length > 2 && (
                                      <span style={{ fontSize: '11px', color: '#1a73e8', backgroundColor: '#e8f0fe', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                        +{activeTags.length - 2}
                                      </span>
                                    )}
                                    <div className="tags-tooltip-box">
                                      {activeTags.map(t => t.label).join(' | ')}
                                    </div>
                                  </>
                                ) : (
                                  <span style={{ backgroundColor: '#f1f3f4', color: '#5f6368', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                    untagged
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td>{formatDate(link.createdAt)}</td>
                        <td>{formatTime(link.createdAt)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              className="btn-sm"
                              onClick={() => setActiveEditLinkId(link.id)}
                            >
                              Edit Tag
                            </button>
                            <button 
                              className="btn-sm-danger"
                              onClick={(e) => handleDeleteLink(link.id, e)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tags Database Registry Screen */}
        {activeTab === 'tags' && (
          <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>


            {tagEditError && (
              <div style={{ color: 'var(--danger)', fontSize: '13px', fontWeight: 'bold', marginTop: '12px' }}>
                {tagEditError}
              </div>
            )}

            <div style={{ overflowX: 'auto', flex: 1 }}>
              {tags.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>
                  No tags found in registry.
                </div>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Tag ID</th>
                      <th>Tag Label</th>
                      <th>Number of Links</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map((tag) => {
                      const uses = links.filter((l) => {
                        if (l.primaryTag === tag.code) return true;
                        if (l.tags && l.tags.some(t => t.code === tag.code)) return true;
                        return false;
                      }).length;
                      const isEditing = editingTagCode === tag.code;

                      return (
                        <tr key={tag.code}>
                          <td>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: tag.code === '0000' ? '#888' : '#1a73e8' }}>
                              {tag.code}
                            </span>
                          </td>
                          <td>
                            {isEditing ? (
                              <input 
                                type="text"
                                className="input-field"
                                style={{ width: '120px', padding: '4px', fontSize: '12px' }}
                                value={newTagLabelValue}
                                onChange={(e) => {
                                  setNewTagLabelValue(e.target.value);
                                  setTagEditError('');
                                }}
                              />
                            ) : (
                              <span style={{ fontWeight: '500' }}>
                                {tag.label || 'untagged'}
                              </span>
                            )}
                          </td>
                          <td>{uses}</td>
                          <td>
                            {tag.code === '0000' ? (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Default (Locked)</span>
                            ) : isEditing ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                  className="btn-sm" 
                                  style={{ backgroundColor: '#34a853', padding: '4px 8px' }}
                                  onClick={async () => {
                                    const cleanLabel = newTagLabelValue.trim().toLowerCase();
                                    if (!cleanLabel) {
                                      setTagEditError('Tag label cannot be empty');
                                      return;
                                    }
                                    try {
                                      const response = await fetch(`${API_BASE}/tags/${tag.code}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ label: cleanLabel })
                                      });
                                      const resData = await response.json();
                                      if (response.ok && resData.success) {
                                        setEditingTagCode(null);
                                        fetchTags();
                                        fetchLinks();
                                      } else {
                                        setTagEditError(resData.error || 'Failed to edit tag');
                                      }
                                    } catch (err) {
                                      setTagEditError('Server connection error');
                                    }
                                  }}
                                >
                                  Save
                                </button>
                                <button 
                                  className="btn-sm" 
                                  style={{ backgroundColor: '#888', padding: '4px 8px' }}
                                  onClick={() => setEditingTagCode(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : uses === 0 ? (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  className="btn-sm" 
                                  style={{ padding: '4px 8px' }}
                                  onClick={() => {
                                    setEditingTagCode(tag.code);
                                    setNewTagLabelValue(tag.label);
                                    setTagEditError('');
                                  }}
                                >
                                  Edit Tag
                                </button>
                                <button 
                                  className="btn-sm-danger" 
                                  style={{ padding: '4px 8px' }}
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`${API_BASE}/tags/${tag.code}`, {
                                        method: 'DELETE'
                                      });
                                      const resData = await response.json();
                                      if (response.ok && resData.success) {
                                        showToast('Tag deleted');
                                        fetchTags();
                                      } else {
                                        setTagEditError(resData.error || 'Failed to delete tag');
                                      }
                                    } catch (err) {
                                      setTagEditError('Server connection error');
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Locked (In Use)</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Hovering action button to add new tag */}
            <button 
              className="floating-btn add-tag-btn" 
              style={{
                position: 'absolute',
                bottom: '48px',
                right: '48px',
                backgroundColor: '#1a73e8',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                fontSize: '24px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              onClick={(e) => {
                e.stopPropagation();
                setNewTagOpen(true);
                setNewTagLabel('');
                setNewTagError('');
              }}
            >
              ＋
            </button>
          </div>
        )}
        {/* Sources Database Registry Screen */}
        {activeTab === 'sources' && (
          <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>


            {sourceEditError && (
              <div style={{ color: 'var(--danger)', fontSize: '13px', fontWeight: 'bold', marginTop: '12px' }}>
                {sourceEditError}
              </div>
            )}

            <div style={{ overflowX: 'auto', flex: 1 }}>
              {sources.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '40px 0' }}>
                  No sources found in registry.
                </div>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Source Code</th>
                      <th>Source Name</th>
                      <th>Number of Uses</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((source) => {
                      const uses = links.filter((l) => l.sourceCode === source.code).length;
                      const isEditing = editingSourceCode === source.code;

                      return (
                        <tr key={source.code}>
                          <td>
                            {isEditing ? (
                              <input 
                                type="text"
                                className="input-field"
                                style={{ width: '60px', padding: '4px', fontSize: '12px', fontFamily: 'monospace' }}
                                value={newSourceCodeValue}
                                maxLength={3}
                                onChange={(e) => {
                                  setNewSourceCodeValue(e.target.value.toLowerCase().replace(/[^a-z]/g, ''));
                                  setSourceEditError('');
                                }}
                              />
                            ) : (
                              <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#1a73e8' }}>
                                {source.code}
                              </span>
                            )}
                          </td>
                          <td>
                            <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                              {source.name}
                            </span>
                          </td>
                          <td>{uses}</td>
                          <td>
                            {isEditing ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                  className="btn-sm" 
                                  style={{ backgroundColor: '#34a853', padding: '4px 8px' }}
                                  onClick={async () => {
                                    if (newSourceCodeValue.length !== 3) {
                                      setSourceEditError('Code must be exactly 3 lowercase letters');
                                      return;
                                    }
                                    try {
                                      const response = await fetch(`${API_BASE}/sources/${source.code}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ newCode: newSourceCodeValue })
                                      });
                                      const resData = await response.json();
                                      if (response.ok && resData.success) {
                                        setEditingSourceCode(null);
                                        fetchSources();
                                        fetchLinks();
                                      } else {
                                        setSourceEditError(resData.error || 'Failed to edit code');
                                      }
                                    } catch (err) {
                                      setSourceEditError('Server connection error');
                                    }
                                  }}
                                >
                                  Save
                                </button>
                                <button 
                                  className="btn-sm" 
                                  style={{ backgroundColor: '#888', padding: '4px 8px' }}
                                  onClick={() => setEditingSourceCode(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              uses === 0 ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    className="btn-sm" 
                                    style={{ padding: '4px 8px' }}
                                    onClick={() => {
                                      setEditingSourceCode(source.code);
                                      setNewSourceCodeValue(source.code);
                                      setSourceEditError('');
                                    }}
                                  >
                                    Edit Code
                                  </button>
                                  <button 
                                    className="btn-sm-danger" 
                                    style={{ padding: '4px 8px' }}
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(`${API_BASE}/sources/${source.code}`, {
                                          method: 'DELETE'
                                        });
                                        const resData = await response.json();
                                        if (response.ok && resData.success) {
                                          showToast('Source deleted');
                                          fetchSources();
                                        } else {
                                          setSourceEditError(resData.error || 'Failed to delete source');
                                        }
                                      } catch (err) {
                                        setSourceEditError('Server connection error');
                                      }
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Locked (In Use)</span>
                              )
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Hovering action button to add new source */}
            <button 
              className="floating-btn add-source-btn" 
              style={{
                position: 'absolute',
                bottom: '48px',
                right: '48px',
                backgroundColor: '#1a73e8',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                fontSize: '24px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              onClick={(e) => {
                e.stopPropagation();
                setNewSourceOpen(true);
                setNewSourceName('');
                setNewSourceCode('');
                setNewSourceUrl('');
                setNewSourceError('');
              }}
            >
              ＋
            </button>
          </div>
        )}

        {/* User Profile View */}
        {activeTab === 'profile' && (
          <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Simulating Link Keeper settings page.
            </p>
            
            <div style={{ borderTop: '1px solid var(--border)', padding: '16px 0' }}>
              <strong>Username:</strong> LinkKeeperTester
            </div>
            <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', marginBottom: '24px' }}>
              <strong>Device Connected:</strong> Desktop Simulator
            </div>

            {/* Storage Settings Section */}
            <div style={{ padding: '0 0 24px 0', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 'bold' }}>Storage Settings</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                Manage local storage archiving configuration.
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '14px 16px', 
                backgroundColor: 'var(--bg-card)', 
                borderRadius: '8px', 
                border: 'var(--card-border)', 
                boxShadow: 'var(--box-shadow)'
              }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>Local Storage Archiving</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Status: {isLocalStorageEnabled ? 'Enabled (Active)' : 'Disabled'}
                  </div>
                </div>
                
                <button
                  className={`white-theme-btn ${isLocalStorageEnabled ? 'primary' : ''}`}
                  style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '600' }}
                  onClick={() => {
                    const nextVal = !isLocalStorageEnabled;
                    setIsLocalStorageEnabled(nextVal);
                    localStorage.setItem('isLocalStorageEnabled', String(nextVal));
                    showToast(nextVal ? 'Local Storage Enabled' : 'Local Storage Disabled');
                  }}
                >
                  {isLocalStorageEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            {/* Theme Settings Section in Profile */}
            <div style={{ padding: '0 0 24px 0', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 'bold' }}>Theme Settings</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                Select visual style theme with live app previews.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {THEME_OPTIONS.map((theme) => {
                  const isActive = appTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`theme-${theme.id} mode-${themeMode}`}
                      onClick={() => changeTheme(theme.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isActive ? '2px solid #1a73e8' : '1px solid var(--border)',
                        backgroundColor: 'var(--bg-card)',
                        cursor: 'pointer',
                        boxShadow: 'var(--box-shadow)',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-color)' }}>
                          {theme.name}
                        </span>
                        {isActive && (
                          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1a73e8', padding: '2px 10px', borderRadius: '12px' }}>
                            Active
                          </span>
                        )}
                      </div>

                      <div style={{ padding: '10px', borderRadius: '8px', border: '1px dashed var(--border)', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ height: '8px', width: '65%', backgroundColor: 'var(--accent, #1a73e8)', borderRadius: '4px' }} />
                        <div style={{ height: '6px', width: '90%', backgroundColor: 'var(--text-muted, #888)', borderRadius: '4px', opacity: 0.5 }} />
                        <div style={{ height: '6px', width: '40%', backgroundColor: 'var(--text-muted, #888)', borderRadius: '4px', opacity: 0.3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Themes Dashboard View */}
        {activeTab === 'themes' && (
          <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Live Interactive App View Preview Box */}
            <div 
              className={`live-theme-preview-box theme-${appTheme} mode-${themeMode}`}
              style={{
                padding: '1.5rem',
                borderRadius: '1.25rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text)',
                marginBottom: '2rem',
                boxShadow: 'var(--box-shadow)',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, marginBottom: '0.5rem', fontWeight: 700 }}>
                Live App View Preview ({THEME_OPTIONS.find(t => t.id === appTheme)?.name} - {themeMode.toUpperCase()} Mode)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                  Sample Webpage / Link Search
                </h2>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: 'var(--accent)', color: '#ffffff', fontWeight: 600 }}>
                  Tag: programming
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Sample Card Item</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>https://example.com/demo-link</div>
                </div>
                <div style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>SERP Media Card</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Extracted image asset preview</div>
                </div>
              </div>
            </div>

            {/* 11 Theme Options in 2-Column Wide Rectangle Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              {THEME_OPTIONS.map((theme) => {
                const isActive = appTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    className={`theme-selection-card theme-${theme.id} mode-${themeMode}`}
                    onClick={() => changeTheme(theme.id)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '1.25rem',
                      border: isActive ? '2.5px solid var(--accent, #1a73e8)' : '1px solid var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      cursor: 'pointer',
                      boxShadow: 'var(--box-shadow)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-color, var(--text))' }}>
                      {theme.name}
                    </span>
                    {isActive && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1a73e8', padding: '0.35rem 0.85rem', borderRadius: '1rem' }}>
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Logs View (Dual Sub-Tabs: Change Logs & Audit Logs - NO EMOJIS) */}
        {activeTab === 'logs' && (
          <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                System change and audit activity records.
              </p>
              <button
                className="white-theme-btn"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={fetchAuditLogs}
                disabled={auditLogsLoading}
              >
                {auditLogsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {/* Sub-Tab Navigation Toggle with Live Counts (No Emojis) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <button
                className={`white-theme-btn ${logsSubTab === 'change' ? 'primary' : ''}`}
                style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px' }}
                onClick={() => setLogsSubTab('change')}
              >
                Change Logs ({auditLogs.filter(l => ['UPDATE_LINK', 'UPDATE_TAG'].includes(l.action)).length})
              </button>
              <button
                className={`white-theme-btn ${logsSubTab === 'audit' ? 'primary' : ''}`}
                style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px' }}
                onClick={() => setLogsSubTab('audit')}
              >
                Audit Logs ({auditLogs.length})
              </button>
            </div>

            {auditLogsLoading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>Loading activity logs...</p>
            ) : (
              <div>
                {/* 1. Change Logs View */}
                {logsSubTab === 'change' && (
                  <div>
                    {auditLogs.filter(l => ['UPDATE_LINK', 'UPDATE_TAG'].includes(l.action)).length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No change logs recorded yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {auditLogs
                          .filter(l => ['UPDATE_LINK', 'UPDATE_TAG'].includes(l.action))
                          .map((log) => (
                            <div
                              key={log.id}
                              style={{
                                padding: '14px 16px',
                                backgroundColor: 'var(--bg-card)',
                                borderRadius: '10px',
                                border: 'var(--card-border)',
                                boxShadow: 'var(--box-shadow)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                                <span
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    backgroundColor: 'rgba(26,115,232,0.15)',
                                    color: '#1a73e8',
                                    letterSpacing: '0.4px',
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  EDITED
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  {new Date(log.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: '500' }}>
                                {log.details}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Full Audit Logs View */}
                {logsSubTab === 'audit' && (
                  <div>
                    {auditLogs.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No audit logs recorded yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {auditLogs.map((log) => (
                          <div
                            key={log.id}
                            style={{
                              padding: '14px 16px',
                              backgroundColor: 'var(--bg-card)',
                              borderRadius: '10px',
                              border: 'var(--card-border)',
                              boxShadow: 'var(--box-shadow)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  padding: '2px 8px',
                                  borderRadius: '20px',
                                  backgroundColor:
                                    log.action.includes('DELETE') ? 'rgba(217,83,79,0.15)' :
                                    log.action.includes('UPDATE') ? 'rgba(26,115,232,0.15)' :
                                    'rgba(52,168,83,0.15)',
                                  color:
                                    log.action.includes('DELETE') ? '#c0392b' :
                                    log.action.includes('UPDATE') ? '#1a73e8' :
                                    '#1e8449',
                                  letterSpacing: '0.4px',
                                  textTransform: 'uppercase'
                                }}
                              >
                                {log.action.replace('_', ' ')}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                              {log.details}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Transparent keyboard backdrop overlay */}
        {isVirtualKeyboardOpen && (
          <div 
            className="keyboard-overlay-backdrop animate-fade"
            onClick={(e) => {
              e.stopPropagation();
              setIsVirtualKeyboardOpen(false);
              document.querySelector('.search-input')?.blur();
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              zIndex: 9,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
          />
        )}

        {/* Virtual Keyboard Mockup */}
        <div 
          className={`virtual-keyboard ${isVirtualKeyboardOpen ? 'visible' : ''}`}
          onClick={(e) => e.stopPropagation()} // Prevent dismiss when tapping keyboard
        >
          <div className="keyboard-row">
            {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
              <div key={k} className="key" onClick={() => handleKeyboardPress(k)}>{k}</div>
            ))}
          </div>
          <div className="keyboard-row">
            {['A','S','D','F','G','H','J','K','L'].map(k => (
              <div key={k} className="key" onClick={() => handleKeyboardPress(k)}>{k}</div>
            ))}
          </div>
          <div className="keyboard-row">
            <div className="key special" onClick={() => handleKeyboardPress('BACKSPACE')}>⌫</div>
            {['Z','X','C','V','B','N','M'].map(k => (
              <div key={k} className="key" onClick={() => handleKeyboardPress(k)}>{k}</div>
            ))}
            <div className="key special" onClick={() => handleKeyboardPress('DONE')}>DONE</div>
          </div>
          <div className="keyboard-row">
            <div className="key space" onClick={() => handleKeyboardPress('SPACE')}>SPACE</div>
          </div>
        </div>

        {/* Modular Floating Window: Tag Editor */}
        <TagEditorModal
          activeEditLinkId={activeEditLinkId}
          setActiveEditLinkId={setActiveEditLinkId}
          editingLink={links.find(l => l.id === activeEditLinkId)}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editUrl={links.find(l => l.id === activeEditLinkId)?.url || ''}
          editPrimaryTagLabel={editTagLabel}
          setEditPrimaryTagLabel={setEditTagLabel}
          editTags={editTags}
          setEditTags={setEditTags}
          editTypeError={editTypeError}
          editSourceCode={editSourceCode}
          setEditSourceCode={setEditSourceCode}
          editTypeCode={editTypeCode}
          setEditTypeCode={setEditTypeCode}
          editReadableCode={editUrlId}
          setEditReadableCode={setEditUrlId}
          editNotes={editNotes}
          setEditNotes={setEditNotes}
          editError={editError}
          setEditError={setEditError}
          allTags={tags}
          allSources={sources}
          handleSaveEdit={handleSaveTagEditor}
          handleRemoveTag={(tagCode) => {
            const nextTags = editTags.filter(tag => tag.code !== tagCode);
            updateActiveTags(nextTags);
          }}
          handleAddTag={(tagLabel) => {
            if (!tagLabel.trim()) return;
            const existing = tags.find(t => t.label.toLowerCase() === tagLabel.trim().toLowerCase());
            const code = existing ? existing.code : 'new';
            const nextTags = [...editTags.filter(t => t.code !== '0000'), { code, label: tagLabel.trim() }];
            updateActiveTags(nextTags);
          }}
        />

        {/* Modular Floating Windows: Create Tag & Create Source */}
        <CreateTagModal
          newTagOpen={newTagOpen}
          setNewTagOpen={setNewTagOpen}
          newTagLabel={newTagLabel}
          setNewTagLabel={setNewTagLabel}
          newTagError={newTagError}
          setNewTagError={setNewTagError}
          handleCreateTagSubmit={handleCreateTagSubmit}
        />

        <CreateSourceModal
          newSourceOpen={newSourceOpen}
          setNewSourceOpen={setNewSourceOpen}
          newSourceName={newSourceName}
          setNewSourceName={setNewSourceName}
          newSourceCode={newSourceCode}
          setNewSourceCode={setNewSourceCode}
          newSourcePattern={newSourceUrl}
          setNewSourcePattern={setNewSourceUrl}
          newSourceError={newSourceError}
          setNewSourceError={setNewSourceError}
          handleCreateSourceSubmit={handleCreateSourceSubmit}
        />
        {activePlayerLink && (
          <MediaPlayerModal 
            url={activePlayerLink} 
            onClose={() => setActivePlayerLink(null)} 
          />
        )}

        </div> {/* closes app-content */}
      </div>
    </div>
  );
}

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

const getCleanTextExcerpt = (htmlContent, maxWords = 60) => {
  if (!htmlContent) return '';
  const cleanText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return cleanText;
  return words.slice(0, maxWords).join(' ') + '...';
};

function WebsiteDetailView({ 
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

  return (
    <div className="website-detail-page animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 24px 24px 24px', boxSizing: 'border-box' }}>
      {/* Navigation & Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
        <button 
          className="white-theme-btn" 
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', padding: '6px 16px', fontWeight: 'bold' }}
        >
          ←
        </button>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`white-theme-btn ${detailMode === 'view' ? 'active' : ''}`}
            onClick={() => setDetailMode('view')}
            style={{ fontSize: '13px', padding: '6px 12px', backgroundColor: detailMode === 'view' ? '#e8f0fe' : '', color: detailMode === 'view' ? '#1a73e8' : '' }}
          >
            Default View
          </button>
          <button 
            className={`white-theme-btn ${detailMode === 'design' ? 'active' : ''}`}
            onClick={() => setDetailMode('design')}
            style={{ fontSize: '13px', padding: '6px 12px', backgroundColor: detailMode === 'design' ? '#e8f0fe' : '', color: detailMode === 'design' ? '#1a73e8' : '' }}
          >
            Design Page
          </button>
          <button 
            className={`white-theme-btn ${detailMode === 'edit' ? 'active' : ''}`}
            onClick={() => setDetailMode('edit')}
            style={{ fontSize: '13px', padding: '6px 12px', backgroundColor: detailMode === 'edit' ? '#e8f0fe' : '', color: detailMode === 'edit' ? '#1a73e8' : '' }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Content Panel */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {detailMode === 'view' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0', color: 'var(--text)' }}>
              {link.title || 'Untitled Page'}
            </h1>
            
            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <strong>Url:</strong> 
              <span style={{ color: '#1a73e8', wordBreak: 'break-all' }}>
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
                style={{ padding: '2px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                {copied ? '✔ Copied' : 'Copy'}
              </button>
              
              {/* Open Button */}
              <button 
                className="white-theme-btn"
                onClick={() => onOpenPlayer(link.url)}
                style={{ padding: '2px 8px', fontSize: '11px', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
              >
                Open
              </button>
            </div>

            <div 
              className="word-editor-preview"
              style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', borderTop: '1px solid #f1f3f4', paddingTop: '16px' }}
              dangerouslySetInnerHTML={{ __html: link.notes || '<p style="color: #888; font-style: italic;">No context notes written yet.</p>' }}
            />
          </div>
        )}

        {detailMode === 'design' && (
          /* Frontend Customizer Playground */
          <WebsiteFrontendPlayground 
            link={link} 
            onSave={onSaveStyles}
          />
        )}

        {detailMode === 'edit' && (
          /* Inline Edit View (Change title and Context notes without opening anything new) */
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
              
              {/* Inline word editor toolbars */}
              <div className="editor-toolbar" style={{ display: 'flex', gap: '4px', border: '1px solid var(--border)', borderBottom: 'none', padding: '6px', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', backgroundColor: '#f8f9fa' }}>
                <button 
                  type="button" 
                  className="toolbar-btn" 
                  style={{ fontWeight: 'bold', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer' }} 
                  onClick={() => document.execCommand('bold')}
                >
                  B
                </button>
                <button 
                  type="button" 
                  className="toolbar-btn" 
                  style={{ fontStyle: 'italic', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer' }} 
                  onClick={() => document.execCommand('italic')}
                >
                  I
                </button>
                <button 
                  type="button" 
                  className="toolbar-btn" 
                  style={{ textDecoration: 'underline', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer' }} 
                  onClick={() => document.execCommand('underline')}
                >
                  U
                </button>
              </div>

              <div 
                contentEditable
                placeholder="Write page context here..."
                style={{
                  border: '1px solid var(--border)',
                  borderBottomLeftRadius: '6px',
                  borderBottomRightRadius: '6px',
                  padding: '12px',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  overflowY: 'auto',
                  outline: 'none',
                  minHeight: '200px',
                  boxSizing: 'border-box',
                  lineHeight: '1.5'
                }}
                onBlur={(e) => setDetailNotes(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: link.notes || '' }}
              />
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

function WebsiteFrontendPlayground({ link, onSave }) {
  const currentStyles = link.styleSettings || {
    backgroundColor: '#ffffff',
    textColor: '#202124',
    fontFamily: 'Inter, sans-serif',
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

  // Background templates
  const BG_TEMPLATES = [
    { name: 'White', bg: '#ffffff', text: '#202124' },
    { name: 'Cosmic Violet', bg: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', text: '#ffffff' },
    { name: 'Sunset Peach', bg: 'linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)', text: '#ffffff' },
    { name: 'Teal Forest', bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', text: '#ffffff' },
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
                  padding: '8px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: t.bg,
                  color: t.text,
                  cursor: 'pointer',
                  fontWeight: '600',
                  textAlign: 'left',
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)'
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Typography */}
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

        <button
          className="white-theme-btn primary"
          style={{ marginTop: 'auto', padding: '10px', fontSize: '13px', backgroundColor: '#1a73e8', color: '#ffffff' }}
          onClick={() => {
            onSave({
              backgroundColor: bg,
              textColor: textCol,
              fontFamily: font,
              cardStyle: card,
              alignment: align,
              containerWidth: width
            });
            alert('Design saved successfully!');
          }}
        >
          Save Layout
        </button>
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
            backgroundColor: card === 'glass' ? 'rgba(255, 255, 255, 0.25)' : card === 'flat' ? '#ffffff' : 'transparent',
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

function MediaPlayerModal({ url, onClose }) {
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

export default App;
