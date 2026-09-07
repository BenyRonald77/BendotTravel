import React, { useState, useEffect, useRef } from 'react';
import { useDialog } from '../../context/DialogContext';
import {
  AlertTriangle,
  Trash2,
  AlertOctagon,
  Info,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  X
} from 'lucide-react';

export const DialogContainer: React.FC = () => {
  const { activeDialog, closeDialog } = useDialog();
  const [inputValue, setInputValue] = useState('');
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (activeDialog) {
      setInputValue(activeDialog.inputDefaultValue || '');
      // Focus appropriate element
      setTimeout(() => {
        if (activeDialog.showInput && inputRef.current) {
          inputRef.current.focus();
        } else if (confirmBtnRef.current) {
          confirmBtnRef.current.focus();
        }
      }, 50);
    }
  }, [activeDialog]);

  // Keyboard shortcut: Escape to close, Enter to submit
  useEffect(() => {
    if (!activeDialog) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog(activeDialog.showInput ? null : false);
      } else if (e.key === 'Enter') {
        // If textarea, allow Enter without submitting unless Ctrl/Cmd + Enter
        if (activeDialog.inputType === 'textarea' && !e.ctrlKey && !e.metaKey) {
          return;
        }
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialog, inputValue, closeDialog]);

  if (!activeDialog) return null;

  const handleConfirm = () => {
    if (activeDialog.showInput) {
      closeDialog(inputValue);
    } else {
      closeDialog(true);
    }
  };

  const handleCancel = () => {
    closeDialog(activeDialog.showInput ? null : false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && activeDialog.dismissOnBackdrop) {
      handleCancel();
    }
  };

  // Icon mapping
  const renderIcon = () => {
    const variant = activeDialog.variant || 'warning';
    const iconType = activeDialog.icon;

    if (iconType === 'trash') return <Trash2 size={28} />;
    if (iconType === 'refresh') return <RotateCcw size={28} />;
    if (iconType === 'shield') return <ShieldAlert size={28} />;
    if (iconType === 'check') return <CheckCircle2 size={28} />;

    switch (variant) {
      case 'danger':
        return <AlertOctagon size={28} />;
      case 'warning':
        return <AlertTriangle size={28} />;
      case 'success':
        return <CheckCircle2 size={28} />;
      case 'info':
        return <Info size={28} />;
      case 'primary':
      default:
        return <HelpCircle size={28} />;
    }
  };

  const variant = activeDialog.variant || 'warning';

  return (
    <div
      className="dialog-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className={`dialog-card dialog-${variant}`}>
        {/* Top Close Button */}
        <button
          className="dialog-close-btn"
          onClick={handleCancel}
          aria-label="Tutup dialog"
        >
          <X size={18} />
        </button>

        <div className="dialog-body-layout">
          {/* Glowing Icon Halo Badge */}
          <div className={`dialog-icon-badge ${variant}`}>
            <div className="dialog-icon-inner">{renderIcon()}</div>
            <div className="dialog-icon-halo" />
          </div>

          {/* Text Content */}
          <div className="dialog-content-area">
            <h3 id="dialog-title" className="dialog-title">
              {activeDialog.title}
            </h3>

            {typeof activeDialog.message === 'string' ? (
              <p className="dialog-message">{activeDialog.message}</p>
            ) : (
              <div className="dialog-message">{activeDialog.message}</div>
            )}

            {/* Optional Input Prompt */}
            {activeDialog.showInput && (
              <div className="dialog-input-wrap">
                {activeDialog.inputLabel && (
                  <label className="dialog-input-label">{activeDialog.inputLabel}</label>
                )}
                {activeDialog.inputType === 'textarea' ? (
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    className="dialog-input dialog-textarea"
                    placeholder={activeDialog.inputPlaceholder || 'Ketik catatan di sini...'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    rows={3}
                  />
                ) : (
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type={activeDialog.inputType || 'text'}
                    className="dialog-input"
                    placeholder={activeDialog.inputPlaceholder || 'Ketik di sini...'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="dialog-footer">
          {activeDialog.showCancel && (
            <button
              type="button"
              className={`dialog-btn-cancel ${activeDialog.cancelButtonClass || ''}`}
              onClick={handleCancel}
            >
              {activeDialog.cancelText || 'Batal'}
            </button>
          )}
          <button
            ref={confirmBtnRef}
            type="button"
            className={`dialog-btn-confirm dialog-btn-${variant} ${activeDialog.confirmButtonClass || ''}`}
            onClick={handleConfirm}
          >
            {activeDialog.confirmText || 'Konfirmasi'}
          </button>
        </div>
      </div>
    </div>
  );
};
