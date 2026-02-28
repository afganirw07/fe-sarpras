// hooks/useSessionExpiry.ts
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

export const useSessionExpiry = () => {
  const { data: session, status } = useSession();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (status === "authenticated") {
      wasAuthenticated.current = true;
    }

    // If was authenticated but now unauthenticated = session expired
    if (status === "unauthenticated" && wasAuthenticated.current) {
      localStorage.setItem("theme", "light");
      // Optional: reset theme di DOM juga
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      
      wasAuthenticated.current = false;
    }
  }, [status]);
};