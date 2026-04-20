"use client";

import { create } from "zustand";

type ToastState = {
  type: "success" | "error";
  message: string;
};

type UiStore = {
  toast: ToastState | null;
  isProductModalOpen: boolean;
  setProductModalOpen: (isOpen: boolean) => void;
  showToast: (toast: ToastState) => void;
  clearToast: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  toast: null,
  isProductModalOpen: false,
  setProductModalOpen: (isOpen) => set({ isProductModalOpen: isOpen }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));
