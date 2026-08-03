/**
 * Theme Registry - Definitions for 8 Active Design Environments
 * Each theme supports both Light and Dark mode options.
 */

export const THEME_DEFINITIONS = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean modern baseline design system',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    light: {
      bgApp: '#f8f9fa',
      bgHeader: '#ffffff',
      bgCard: '#ffffff',
      textColor: '#111827',
      textMuted: '#6b7280',
      borderColor: '#e5e7eb',
      accentColor: '#1a73e8',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    },
    dark: {
      bgApp: '#121212',
      bgHeader: '#1e1e1e',
      bgCard: '#1e1e1e',
      textColor: '#f3f4f6',
      textMuted: '#9ca3af',
      borderColor: '#374151',
      accentColor: '#4285f4',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
    }
  },
  {
    id: 'bento_grid',
    name: 'Bento Grid',
    description: 'Structured grid cards with bold rounded pill boundaries',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    light: {
      bgApp: '#f1f5f9',
      bgHeader: '#ffffff',
      bgCard: '#ffffff',
      textColor: '#0f172a',
      textMuted: '#64748b',
      borderColor: '#cbd5e1',
      accentColor: '#0284c7',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    dark: {
      bgApp: '#090d16',
      bgHeader: '#0f172a',
      bgCard: '#1e293b',
      textColor: '#f8fafc',
      textMuted: '#94a3b8',
      borderColor: '#334155',
      accentColor: '#38bdf8',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
    }
  },
  {
    id: 'brutalism',
    name: 'Brutalism',
    description: 'Stark high-contrast 3px solid borders and hard shadows',
    fontFamily: "'Space Grotesk', monospace",
    light: {
      bgApp: '#fffbe6',
      bgHeader: '#ffffff',
      bgCard: '#ffffff',
      textColor: '#000000',
      textMuted: '#333333',
      borderColor: '#000000',
      accentColor: '#ff4757',
      boxShadow: '5px 5px 0px #000000'
    },
    dark: {
      bgApp: '#121212',
      bgHeader: '#1e1e1e',
      bgCard: '#1e1e1e',
      textColor: '#ffffff',
      textMuted: '#cccccc',
      borderColor: '#ffffff',
      accentColor: '#ff6b81',
      boxShadow: '5px 5px 0px #ffffff'
    }
  },
  {
    id: 'maximalism',
    name: 'Maximalism',
    description: 'Expressive vivid colors, bold patterns and saturated accents',
    fontFamily: "'Syne', sans-serif",
    light: {
      bgApp: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
      bgHeader: '#ffffff',
      bgCard: '#ffffff',
      textColor: '#2d3436',
      textMuted: '#636e72',
      borderColor: '#fd79a8',
      accentColor: '#6c5ce7',
      boxShadow: '0 10px 25px rgba(108, 92, 231, 0.25)'
    },
    dark: {
      bgApp: 'linear-gradient(135deg, #2d132c 0%, #801336 50%, #ee4540 100%)',
      bgHeader: '#170519',
      bgCard: '#2d132c',
      textColor: '#f8f9fa',
      textMuted: '#e0a899',
      borderColor: '#ee4540',
      accentColor: '#c72c41',
      boxShadow: '0 10px 25px rgba(238, 69, 64, 0.4)'
    }
  },
  {
    id: 'minimalism',
    name: 'Minimalism',
    description: 'Monochrome precision, subtle grays and airy whitespace',
    fontFamily: "'Inter', sans-serif",
    light: {
      bgApp: '#ffffff',
      bgHeader: '#ffffff',
      bgCard: '#fafafa',
      textColor: '#111111',
      textMuted: '#777777',
      borderColor: '#eeeeee',
      accentColor: '#000000',
      boxShadow: 'none'
    },
    dark: {
      bgApp: '#050505',
      bgHeader: '#050505',
      bgCard: '#0d0d0d',
      textColor: '#eeeeee',
      textMuted: '#777777',
      borderColor: '#1a1a1a',
      accentColor: '#ffffff',
      boxShadow: 'none'
    }
  },
  {
    id: 'claymorphism',
    name: 'Claymorphism',
    description: 'Soft 3D inflated clay cards with dual inner/outer shadows',
    fontFamily: "'Fredoka', sans-serif",
    light: {
      bgApp: '#e0e5ec',
      bgHeader: '#e0e5ec',
      bgCard: '#e0e5ec',
      textColor: '#2d3748',
      textMuted: '#718096',
      borderColor: 'transparent',
      accentColor: '#4299e1',
      boxShadow: '8px 8px 16px #b8b9be, -8px -8px 16px #ffffff'
    },
    dark: {
      bgApp: '#1a202c',
      bgHeader: '#1a202c',
      bgCard: '#1a202c',
      textColor: '#f7fafc',
      textMuted: '#a0aec0',
      borderColor: 'transparent',
      accentColor: '#63b3ed',
      boxShadow: '8px 8px 16px #12161f, -8px -8px 16px #222a39'
    }
  },
  {
    id: 'neomorphism',
    name: 'Neomorphism',
    description: 'Extruded soft surface highlights and inset shadows',
    fontFamily: "'Poppins', sans-serif",
    light: {
      bgApp: '#e0e5ec',
      bgHeader: '#e0e5ec',
      bgCard: '#e0e5ec',
      textColor: '#333333',
      textMuted: '#666666',
      borderColor: 'transparent',
      accentColor: '#3182ce',
      boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff'
    },
    dark: {
      bgApp: '#24292e',
      bgHeader: '#24292e',
      bgCard: '#24292e',
      textColor: '#f6f8fa',
      textMuted: '#959da5',
      borderColor: 'transparent',
      accentColor: '#58a6ff',
      boxShadow: '6px 6px 12px #181b1f, -6px -6px 12px #30373d'
    }
  },
  {
    id: 'skeumorphism',
    name: 'Skeumorphism',
    description: 'Tactile gradients, metallic sheen and debossed inset panels',
    fontFamily: "'Georgia', serif",
    light: {
      bgApp: 'linear-gradient(to bottom, #e2e2e2 0%, #dbdbdb 50%, #d1d1d1 100%)',
      bgHeader: 'linear-gradient(to bottom, #ffffff 0%, #f1f1f1 100%)',
      bgCard: 'linear-gradient(to bottom, #ffffff 0%, #f6f6f6 100%)',
      textColor: '#222222',
      textMuted: '#555555',
      borderColor: '#b5b5b5',
      accentColor: '#2b5797',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 5px rgba(0,0,0,0.2)'
    },
    dark: {
      bgApp: 'linear-gradient(to bottom, #2b2b2b 0%, #212121 100%)',
      bgHeader: 'linear-gradient(to bottom, #3a3a3a 0%, #2b2b2b 100%)',
      bgCard: 'linear-gradient(to bottom, #333333 0%, #282828 100%)',
      textColor: '#eeeeee',
      textMuted: '#aaaaaa',
      borderColor: '#181818',
      accentColor: '#4a90e2',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 3px 8px rgba(0,0,0,0.6)'
    }
  }
];
