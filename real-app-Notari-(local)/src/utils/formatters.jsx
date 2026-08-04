import React from 'react';

/**
 * Shared Formatter Utilities
 * Provides safe formatting functions for URLs, dates, times, and text excerpts.
 */

export const displayUrl = (urlStr) => {
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

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).replace(/\//g, '/');
  } catch (e) {
    return dateString || '';
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return dateString || '';
  }
};

export const getCleanTextExcerpt = (htmlString, maxLength = 120) => {
  if (!htmlString) return '';
  const text = htmlString.replace(/<[^>]+>/g, '').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
