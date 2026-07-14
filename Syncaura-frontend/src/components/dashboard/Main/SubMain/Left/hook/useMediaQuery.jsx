import { useEffect, useState } from "react";

const getInitialMatch = (query) => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(query).matches;
};

/**
 * useMediaQuery
 *
 * Returns `true` when the supplied CSS media query matches the current viewport.
 * This hook is SSR-safe and removes the listener automatically on unmount.
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => getInitialMatch(query));

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    }

    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, [query]);

  return matches;
};

/**
 * useIsMobile
 *
 * Convenience helper for screens below the md breakpoint.
 */
export const useIsMobile = () => useMediaQuery("(max-width: 767.98px)");

/**
 * useIsTablet
 *
 * Convenience helper for screens between md and lg.
 */
export const useIsTablet = () =>
  useMediaQuery("(min-width: 768px) and (max-width: 1023.98px)");

/**
 * useIsDesktop
 *
 * Convenience helper for screens at the lg breakpoint and above.
 */
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

export default useMediaQuery;