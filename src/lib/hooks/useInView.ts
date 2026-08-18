//! src/lib/hooks/useInView.ts

import { useEffect, useState } from "react";

export function useInView(
  ref: React.RefObject<HTMLElement | null>,
  margin: string = "0px",
) {
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    //* Exit if ref is not assigned
    if (!ref.current) return;

    //* Create an IntersectionObserver to observe visibility changes
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      }, //* Update state based on intersection
      { rootMargin: margin },
    );

    observer.observe(ref.current); //* Start observing the element
    return () => observer.disconnect(); //* Cleanup observer on unmount
  }, [ref, margin]);

  return hasEnteredView;
}
