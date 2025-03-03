//! src/lib/hooks/useInView.ts

import { useEffect, useState } from "react";

//* Custom hook to check if an element is in view
export function useInView(
  ref: React.RefObject<HTMLElement | null>,
  margin: string = "0px"
) {
  //* State to track visibility
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    //* Exit if ref is not assigned
    if (!ref.current) return;

    //* Create an IntersectionObserver to observe visibility changes
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting), //* Update state based on intersection
      { rootMargin: margin } //* Set margin for intersection
    );

    observer.observe(ref.current); //* Start observing the element
    return () => observer.disconnect(); //* Cleanup observer on unmount
  }, [ref, margin]); //* Re-run effect if ref or margin changes

  return isVisible; //* Return visibility state
}
