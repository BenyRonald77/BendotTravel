import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { DialogOptions, PromptOptions, ActiveDialog, DialogVariant } from '../types/dialog';

export interface DialogContextType {
  activeDialog: ActiveDialog | null;
  confirm: (options: DialogOptions | string) => Promise<boolean>;
  alert: (options: DialogOptions | string) => Promise<void>;
  prompt: (options: PromptOptions | string) => Promise<string | null>;
  closeDialog: (result?: any) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);
  const resolverRef = useRef<((value: any) => void) | null>(null);

  const closeDialog = useCallback((result: any = false) => {
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
    setActiveDialog(null);
  }, []);

  const confirm = useCallback((options: DialogOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      // If there's an existing dialog, resolve it with false first
      if (resolverRef.current) {
        resolverRef.current(false);
      }
      resolverRef.current = resolve;

      let normalizedOptions: DialogOptions;
      if (typeof options === 'string') {
        normalizedOptions = {
          title: 'Konfirmasi Tindakan',
          message: options,
          confirmText: 'Ya, Lanjutkan',
          cancelText: 'Batal',
          variant: 'warning',
          showCancel: true
        };
      } else {
        const defaultConfirmText =
          options.variant === 'danger'
            ? 'Ya, Hapus'
            : options.variant === 'warning'
            ? 'Ya, Lanjutkan'
            : 'Konfirmasi';

        normalizedOptions = {
          confirmText: defaultConfirmText,
          cancelText: 'Batal',
          variant: options.variant || 'warning',
          showCancel: options.showCancel !== false,
          dismissOnBackdrop: options.dismissOnBackdrop !== false,
          ...options
        };
      }

      setActiveDialog({
        ...normalizedOptions,
        id: `dlg-${Date.now()}`,
        resolve
      });
    });
  }, []);

  const alert = useCallback((options: DialogOptions | string): Promise<void> => {
    return new Promise((resolve) => {
      if (resolverRef.current) {
        resolverRef.current(false);
      }
      resolverRef.current = () => resolve();

      let normalizedOptions: DialogOptions;
      if (typeof options === 'string') {
        normalizedOptions = {
          title: 'Pemberitahuan',
          message: options,
          confirmText: 'Mengerti',
          variant: 'info',
          showCancel: false,
          dismissOnBackdrop: true
        };
      } else {
        normalizedOptions = {
          confirmText: 'Mengerti',
          variant: options.variant || 'info',
          showCancel: false,
          dismissOnBackdrop: options.dismissOnBackdrop !== false,
          ...options
        };
      }

      setActiveDialog({
        ...normalizedOptions,
        id: `dlg-${Date.now()}`,
        resolve: () => resolve()
      });
    });
  }, []);

  const prompt = useCallback((options: PromptOptions | string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (resolverRef.current) {
        resolverRef.current(null);
      }
      resolverRef.current = resolve;

      let normalizedOptions: DialogOptions;
      if (typeof options === 'string') {
        normalizedOptions = {
          title: options,
          message: '',
          confirmText: 'Simpan',
          cancelText: 'Batal',
          variant: 'primary',
          showCancel: true,
          showInput: true,
          inputDefaultValue: '',
          dismissOnBackdrop: false
        };
      } else {
        normalizedOptions = {
          title: options.title,
          message: options.message || '',
          confirmText: options.confirmText || 'Simpan',
          cancelText: options.cancelText || 'Batal',
          variant: options.variant || 'primary',
          showCancel: true,
          showInput: true,
          inputPlaceholder: options.placeholder,
          inputDefaultValue: options.defaultValue || '',
          inputType: options.inputType || 'text',
          dismissOnBackdrop: false
        };
      }

      setActiveDialog({
        ...normalizedOptions,
        id: `dlg-${Date.now()}`,
        resolve
      });
    });
  }, []);

  return (
    <DialogContext.Provider
      value={{
        activeDialog,
        confirm,
        alert,
        prompt,
        closeDialog
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
