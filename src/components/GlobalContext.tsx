"use client";

import type React from "react";
import { createContext } from "react";
import { type GlobalSettings, SITE_SETTINGS } from "@/config/site";

// Global settings are now static (no Strapi). See src/config/site.ts.
export type GlobalSettingsType = GlobalSettings;

export const GlobalContext = createContext<GlobalSettingsType>(SITE_SETTINGS);

type GlobalProviderProps = {
  children: React.ReactNode;
};

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  return <GlobalContext.Provider value={SITE_SETTINGS}>{children}</GlobalContext.Provider>;
};
