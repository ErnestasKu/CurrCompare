import { useEffect } from "react";

// shortened hook for hiding component on outside click
function useClickOutside(ref, handler, type = "click") {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener(type, listener);
    return () => document.removeEventListener(type, listener);
  }, [ref, handler]);
}

export default useClickOutside;
