import React from 'react';

export type DialogVariant = 'danger' | 'warning' | 'info' | 'success' | 'primary';

export interface DialogOptions {
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  icon?: 'trash' | 'alert' | 'info' | 'check' | 'refresh' | 'shield';
  showCancel?: boolean;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  dismissOnBackdrop?: boolean;
  // Prompt input support
  showInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputDefaultValue?: string;
  inputType?: 'text' | 'password' | 'textarea';
}

export interface PromptOptions {
  title: string;
  message?: React.ReactNode;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  inputType?: 'text' | 'password' | 'textarea';
}

export interface ActiveDialog extends DialogOptions {
  id: string;
  resolve: (value: any) => void;
}
