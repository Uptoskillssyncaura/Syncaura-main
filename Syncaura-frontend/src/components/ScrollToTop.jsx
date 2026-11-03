import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const sectionId = hash.replace("#", "");
      let attempts = 0;
      const maxAttempts = 50;

      const tryScroll = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
          requestAnimationFrame(() => {
            window.dispatchEvent(new Event("scroll"));
          });
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryScroll, 100);
        }
      };

      tryScroll();
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}