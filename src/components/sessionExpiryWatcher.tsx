"use client";

import { useSessionExpiry } from "@/hooks/useSessionExpiry";

export const SessionExpiryWatcher = () => {
  useSessionExpiry();
  return null;
};