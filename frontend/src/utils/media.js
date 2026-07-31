export const getYoutubeThumbnail = (url) => {
  if (!url) return null;
  let videoId = null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    videoId = match[2];
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

export const getExtractedImages = (results) => {
  const list = [];
  results.forEach(link => {
    if (link.typeCode === 'img' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(link.url)) {
      list.push({ src: link.url, title: link.title || 'Untitled Image', parentLink: link });
    }
    if (link.notes) {
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match;
      while ((match = imgRegex.exec(link.notes)) !== null) {
        list.push({ src: match[1], title: link.title || 'Embedded Image', parentLink: link });
      }
    }
  });
  return list;
};

export const getExtractedVideos = (results) => {
  const list = [];
  results.forEach(link => {
    if (link.typeCode === 'vid' || /youtube\.com|youtu\.be|vimeo\.com/i.test(link.url)) {
      list.push({ src: link.url, title: link.title || 'Untitled Video', parentLink: link });
    }
    if (link.notes) {
      const videoRegex = /<video[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match;
      while ((match = videoRegex.exec(link.notes)) !== null) {
        list.push({ src: match[1], title: link.title || 'Embedded Video', parentLink: link });
      }
      const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match2;
      while ((match2 = iframeRegex.exec(link.notes)) !== null) {
        const src = match2[1];
        if (/youtube\.com|youtu\.be|vimeo\.com/i.test(src)) {
          list.push({ src, title: link.title || 'Embedded Video', parentLink: link });
        }
      }
    }
  });
  return list;
};

export const getCleanTextExcerpt = (htmlContent, maxWords = 60) => {
  if (!htmlContent) return '';
  const cleanText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return cleanText;
  return words.slice(0, maxWords).join(' ') + '...';
};
