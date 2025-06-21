import React, { useEffect, useState } from "react";

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { message, type } = e.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener("show-toast", handler);
    return () => window.removeEventListener("show-toast", handler);
  }, []);

  return (
    <div className="toast toast-top toast-end fixed z-50 top-4 right-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert alert-${toast.type} shadow-lg mb-2`}
        >
          <div>
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
