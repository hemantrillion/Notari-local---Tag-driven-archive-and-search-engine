import React from 'react';

export default function HomeDashboard({
  searchMode,
  setSearchMode,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  isSearchSubmitted,
  setIsSearchSubmitted,
  showHomeSuggestions,
  setShowHomeSuggestions,
  homeActiveSuggestionIndex,
  setHomeActiveSuggestionIndex,
  activeSearchTab,
  setActiveSearchTab,
  tags,
  taggedLinks,
  recentShowCount,
  setRecentShowCount,
  handleSearch,
  setIsVirtualKeyboardOpen,
  setActiveViewLink,
  setDetailMode,
  displayUrl,
  formatDate,
  formatTime,
  getCleanTextExcerpt,
  navigateTo,
  activeTab
}) {
  return (
    <div id="home-dashboard" className="home-scroll-layout">
      {/* Search Box absolute centered */}
      <div 
        id="search-container"
        className={`search-container ${searchMode ? 'focused' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div id="app-branding" className="app-branding">A Sap Link</div>
        
        <div className="search-bar-wrapper" style={{ position: 'relative' }}>
          <input
            id="search-input"
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
        onClick={(e) => e.stopPropagation()}
      >
        {isSearchSubmitted ? (
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
                            setActiveViewLink(link);
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
                                setActiveViewLink(link);
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
  );
}
