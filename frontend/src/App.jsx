import { useState, useEffect, useRef } from 'react';
import NavigationControls from './components/NavigationControls';
import WebsiteDetailView from './components/WebsiteDetailView';
import MediaPlayerModal from './components/MediaPlayerModal';
import SidebarDrawerModal from './components/floating-windows/SidebarDrawerModal';
import CreateTagModal from './components/floating-windows/CreateTagModal';
import CreateSourceModal from './components/floating-windows/CreateSourceModal';
import TagEditorModal from './components/floating-windows/TagEditorModal';

import HomeDashboard from './components/dashboards/HomeDashboard';
import UntaggedDashboard from './components/dashboards/UntaggedDashboard';
import TaggedDashboard from './components/dashboards/TaggedDashboard';
import TagsRegistryDashboard from './components/dashboards/TagsRegistryDashboard';
import SourcesRegistryDashboard from './components/dashboards/SourcesRegistryDashboard';
import ProfileDashboard from './components/dashboards/ProfileDashboard';
import ThemesDashboard from './components/dashboards/ThemesDashboard';
import LogsDashboard from './components/dashboards/LogsDashboard';

const THEME_OPTIONS = [
  { id: 'default', name: 'Default' },
  { id: 'bento_grid', name: 'Bento Grid' },
  { id: 'brutalism', name: 'Brutalism' },
  { id: 'maximalism', name: 'Maximalism' },
  { id: 'minimalism', name: 'Minimalism' },
  { id: 'claymorphism', name: 'Claymorphism' },
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
  const [isLocalStorageEnabled, setIsLocalStorageEnabled] = useState(true);

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

  useEffect(() => {
    document.body.className = `mode-${themeMode} theme-${appTheme}`;
  }, [themeMode, appTheme]);

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

          {/* Global Webpage Detail View */}
          {activeViewLink ? (
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
            <>
              {activeTab === 'home' && (
                <HomeDashboard
                  searchMode={searchMode}
                  setSearchMode={setSearchMode}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  isSearchSubmitted={isSearchSubmitted}
                  setIsSearchSubmitted={setIsSearchSubmitted}
                  showHomeSuggestions={showHomeSuggestions}
                  setShowHomeSuggestions={setShowHomeSuggestions}
                  homeActiveSuggestionIndex={homeActiveSuggestionIndex}
                  setHomeActiveSuggestionIndex={setHomeActiveSuggestionIndex}
                  activeSearchTab={activeSearchTab}
                  setActiveSearchTab={setActiveSearchTab}
                  tags={tags}
                  taggedLinks={taggedLinks}
                  recentShowCount={recentShowCount}
                  setRecentShowCount={setRecentShowCount}
                  handleSearch={handleSearch}
                  setIsVirtualKeyboardOpen={setIsVirtualKeyboardOpen}
                  setActiveViewLink={setActiveViewLink}
                  setDetailMode={setDetailMode}
                  displayUrl={displayUrl}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getCleanTextExcerpt={getCleanTextExcerpt}
                  navigateTo={navigateTo}
                  activeTab={activeTab}
                />
              )}

              {activeTab === 'untagged' && (
                <UntaggedDashboard
                  untaggedLinks={untaggedLinks}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  setActiveEditLinkId={setActiveEditLinkId}
                  handleDeleteLink={handleDeleteLink}
                  setActiveViewLink={setActiveViewLink}
                  setDetailMode={setDetailMode}
                />
              )}

              {activeTab === 'tagged' && (
                <TaggedDashboard
                  taggedLinks={taggedLinks}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  copiedLinkId={copiedLinkId}
                  setCopiedLinkId={setCopiedLinkId}
                  setActiveEditLinkId={setActiveEditLinkId}
                  handleDeleteLink={handleDeleteLink}
                  setActiveViewLink={setActiveViewLink}
                  setDetailMode={setDetailMode}
                  setActivePlayerLink={setActivePlayerLink}
                />
              )}

              {activeTab === 'tags' && (
                <TagsRegistryDashboard
                  tags={tags}
                  links={links}
                  setNewTagOpen={setNewTagOpen}
                  handleDeleteTag={handleDeleteTag}
                />
              )}

              {activeTab === 'sources' && (
                <SourcesRegistryDashboard
                  sources={sources}
                  links={links}
                  setNewSourceOpen={setNewSourceOpen}
                  handleDeleteSource={handleDeleteSource}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileDashboard
                  isLocalStorageEnabled={isLocalStorageEnabled}
                  setIsLocalStorageEnabled={setIsLocalStorageEnabled}
                  THEME_OPTIONS={THEME_OPTIONS}
                  appTheme={appTheme}
                  themeMode={themeMode}
                  changeTheme={changeTheme}
                />
              )}

              {activeTab === 'themes' && (
                <ThemesDashboard
                  THEME_OPTIONS={THEME_OPTIONS}
                  appTheme={appTheme}
                  themeMode={themeMode}
                  changeTheme={changeTheme}
                />
              )}

              {activeTab === 'logs' && (
                <LogsDashboard
                  auditLogs={auditLogs}
                  auditLogsLoading={auditLogsLoading}
                  fetchAuditLogs={fetchAuditLogs}
                  logsSubTab={logsSubTab}
                  setLogsSubTab={setLogsSubTab}
                />
              )}
            </>
          )}
        </div>

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
        </div>
      </div>
  );
}

export default App;
