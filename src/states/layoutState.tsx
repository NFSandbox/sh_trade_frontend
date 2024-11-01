'use client';


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useStore } from './useStore';

// Configs
import * as gene_config from '@/config/general';
import { useEffect } from 'react';

export interface LayoutStates {
  showHeader: boolean;
  title?: string;
  displayTitle?: string;
}

export interface LayoutActions {
  /**
   * Set the new title of header.
   */
  setTitle: (title?: string) => void;
  /**
   * Control if the header is visible
   */
  setShowHeader: (showHeader: boolean) => void;
  /**
   * Get dispaly title string of header
   */
  getHeaderDispalyTitle: () => string;
}

export const useLayoutState = create<LayoutStates & LayoutActions>()(
  immer(
    (set, get) => ({
      showHeader: true,
      title: undefined,
      displayTitle: `${gene_config.appName}`,

      setTitle(title) {
        set((state) => {
          state.title = title;
        });
        set((state) => {
          state.displayTitle = get().getHeaderDispalyTitle();
        })
      },

      setShowHeader(showHeader) {
        set((state) => {
          state.showHeader = showHeader;
        })
      },

      getHeaderDispalyTitle() {
        let str = gene_config.appName;
        const title = get().title;
        if (title !== undefined) {
          str = title + ' - ' + str;
        }

        return str;
      },
    }
    ))
);

/**
 * React hook that set the title of the header.
 */
export function useHeaderTitle(title?: string) {
  const setTitle = useLayoutState((st) => st.setTitle);
  useEffect(function () {
    setTitle(title);
  }, []);
}