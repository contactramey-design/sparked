"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "@/lib/supabase/env";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

type SupabaseContextValue = {
  supabase: SupabaseClient;
};

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => {
    const { url, anonKey } = getPublicSupabaseConfig();
    return createBrowserClient(url, anonKey);
  }, []);

  const value = useMemo(() => ({ supabase }), [supabase]);

  return (
    <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
  );
}

export function useSupabase(): SupabaseContextValue {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return ctx;
}
