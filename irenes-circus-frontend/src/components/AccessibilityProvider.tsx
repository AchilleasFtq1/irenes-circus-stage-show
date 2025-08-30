import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setFontSize: (value: 'small' | 'medium' | 'large') => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Check for user's motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check for user's contrast preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${fontSize}`);
  }, [reducedMotion, highContrast, fontSize]);

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const value = {
    reducedMotion,
    highContrast,
    fontSize,
    setReducedMotion,
    setHighContrast,
    setFontSize,
    announceToScreenReader,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility Settings Panel Component
export const AccessibilityPanel: React.FC<{ className?: string }> = ({ className = "" }) => {
  const {
    reducedMotion,
    highContrast,
    fontSize,
    setReducedMotion,
    setHighContrast,
    setFontSize,
  } = useAccessibility();

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        ♿ Accessibility Settings
      </h3>
      
      <div className="space-y-4">
        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="reduced-motion" className="font-medium text-gray-900">
              Reduce Motion
            </label>
            <p className="text-sm text-gray-500">
              Minimize animations and transitions
            </p>
          </div>
          <input
            id="reduced-motion"
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="high-contrast" className="font-medium text-gray-900">
              High Contrast
            </label>
            <p className="text-sm text-gray-500">
              Increase color contrast for better visibility
            </p>
          </div>
          <input
            id="high-contrast"
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        {/* Font Size */}
        <div>
          <label htmlFor="font-size" className="block font-medium text-gray-900 mb-2">
            Font Size
          </label>
          <select
            id="font-size"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium (Default)</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Skip to content link
export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-rock-amber text-rock-black px-4 py-2 rounded font-bold z-[9999]
        focus:outline-none focus:ring-2 focus:ring-rock-rust
      "
    >
      Skip to main content
    </a>
  );
};

// Focus trap component for modals
export const FocusTrap: React.FC<{ children: React.ReactNode; active: boolean }> = ({ 
  children, 
  active 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
};
