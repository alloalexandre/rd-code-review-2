/**
 * ⚠️ Demonstration Purpose Only ⚠️
 * This file is an example of how to set up a Zustand store for theme management (light/dark mode).
 * It should be REMOVED in production and replaced with your actual store logic.
 *
 * ----------------------------------------------------------------------------
 * What this does:
 * - Defines a Zustand store with a single piece of state: `theme`.
 * - Provides actions to toggle or set the theme explicitly.
 *
 * How to use:
 * 1. Import the store into a React component.
 * 2. Access state and actions using the store hook.
 * 3. Example:
 *
 *    import useThemeStore from './example.store';
 *
 *    function ThemeToggleButton() {
 *      const { theme, toggleTheme } = useThemeStore();
 *
 *      return (
 *        <button onClick={toggleTheme}>
 *          Current theme: {theme} (click to toggle)
 *        </button>
 *      );
 *    }
 *
 * Why Zustand:
 * - Very lightweight (no boilerplate like Redux).
 * - State lives outside React’s component tree, so no prop drilling.
 * - Simple API: define a store once, use it anywhere.
 * ----------------------------------------------------------------------------
 */

import { create } from "zustand";

export const useThemeStore = create((set) => ({
	theme: "light", // default theme

	toggleTheme: () =>
		set((/** @type {{ theme: string; }} */ state) => ({
			theme: state.theme === "light" ? "dark" : "light",
		})),

	setTheme: (/** @type {any} */ newTheme) =>
		set(() => ({
			theme: newTheme,
		})),
}));
