import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, variant = 'success') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, variant }]);
    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
        {toasts.map((t) => (
          <div key={t.id} className={`toast show align-items-center text-bg-${t.variant} border-0 mb-2`} role="alert">
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => dismissToast(t.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
