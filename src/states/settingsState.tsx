'use client';


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Configs
import * as gene_config from '@/config/general';

/**
 * Get browser default darkmode state
 */
export function getSysDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export interface SettingsStates {
  /**
   * User settings about the darkmode
   */
  darkModeSetting: 'light' | 'dark' | 'auto';
  /**
   * Property. Calculated darkmode state.
   */
  darkMode: boolean;
}

export interface SettingsActions {
  setDarkModeSetting: (darkMode: 'light' | 'dark' | 'auto') => void;
  setDarkModeProperty: (darkMode: boolean) => void;
}

export const useSettingsState = create<SettingsStates & SettingsActions>()(
  persist(immer(
    (set, get) => ({
      darkModeSetting: 'auto',
      darkMode: getSysDarkMode(),

      setDarkModeSetting(darkMode) {
        set((st) => {
          // update darkmode settings
          st.darkModeSetting = darkMode;
          // calc darkmode state based on settings
          if (darkMode == 'dark') {
            st.darkMode = true;
          }
          else if (darkMode == 'light') {
            st.darkMode = false;
          }
          else {
            st.darkMode = getSysDarkMode();
          }
        });
      },

      setDarkModeProperty(darkMode) {
        set((st) => { st.darkMode = darkMode; })
      }
    }
    )), {
    name: 'sys_settings', // name of the item in the storage (must be unique)
  },),
);