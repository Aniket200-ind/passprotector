//! src/components/InViewSection.tsx

"use client";

import React, { useRef } from "react";
import { useInView } from "@/lib/hooks/useInView";

/**
 * Component to conditionally render content based on visibility in the viewport using IntersectionObserver
 * @param children The content to be displayed when in view
 * @param rootMargin Margin around the root element for intersection observer
 * @param fallback The content to be displayed when not in view
 * @param className Additional classes to apply to the container div
 */
export function InViewSection({
  children, //* The content to be displayed when in view
  rootMargin = "200px", //* Margin around the root element for intersection observer
  fallback, //* The content to be displayed when not in view
  className = "",
}: {
  children: React.ReactNode;
  rootMargin?: string;
  fallback: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null); //* Reference to the container div
  const isInView = useInView(ref, rootMargin); //* Custom hook to check if the element is in view

  return (
    <div ref={ref} className={className}>
      {/** Render children if in view, otherwise render fallback */}
      {isInView ? children : fallback}
    </div>
  );
}
