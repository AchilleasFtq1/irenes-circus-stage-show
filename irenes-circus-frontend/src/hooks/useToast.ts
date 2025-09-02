import React, { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
  persistent?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Global toast state - using a simple approach without Context for now
let toastState: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener([...toastState]));
};

export const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: Toast = {
    ...toast,
    id,
    duration: toast.duration ?? 5000,
  };

  toastState = [...toastState, newToast];
  notifyListeners();

  // Auto-remove toast after duration (unless persistent)
  if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }
};

export const removeToast = (id: string) => {
  toastState = toastState.filter(toast => toast.id !== id);
  notifyListeners();
};

export const clearAllToasts = () => {
  toastState = [];
  notifyListeners();
};

// Hook to use toast functionality
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toastState);

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, [subscribe]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    // Convenience methods
    success: (message: string, title?: string) => addToast({ type: 'success', message, title }),
    error: (message: string, title?: string) => addToast({ type: 'error', message, title, duration: 8000 }),
    warning: (message: string, title?: string) => addToast({ type: 'warning', message, title }),
    info: (message: string, title?: string) => addToast({ type: 'info', message, title }),
  };
};
