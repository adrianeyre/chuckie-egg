// Vitest equivalent of the Create React App setup: the matcher import moved from
// `@testing-library/jest-dom/extend-expect` to a Vitest-specific entry point in
// jest-dom 6, which registers the matchers on Vitest's `expect` rather than Jest's.
import '@testing-library/jest-dom/vitest';

window.matchMedia =
	window.matchMedia ||
	((query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList);
