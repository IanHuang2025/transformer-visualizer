"use client";

import React, { useRef, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PanelContentProps {
  isExpanded: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PanelContent({ isExpanded, children, className }: PanelContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentElement = contentRef.current;
    const innerElement = innerRef.current;
    
    if (!contentElement || !innerElement) return;

    if (isExpanded) {
      // Expanding: set max-height to the content height
      const height = innerElement.scrollHeight;
      contentElement.style.maxHeight = `${height}px`;
      
      // Clean up after animation completes
      const timer = setTimeout(() => {
        contentElement.style.maxHeight = 'none';
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      // Collapsing: first set explicit height, then animate to 0
      const height = innerElement.scrollHeight;
      contentElement.style.maxHeight = `${height}px`;
      
      // Force a reflow to ensure the height is set
      contentElement.scrollTop;
      
      // Then animate to 0
      requestAnimationFrame(() => {
        contentElement.style.maxHeight = '0px';
      });
    }
  }, [isExpanded]);

  return (
    <div
      ref={contentRef}
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        !isExpanded && "max-h-0"
      )}
    >
      <CardContent ref={innerRef} className={cn("pt-4 pb-6", className)}>
        <div className={cn(
          "transition-opacity duration-200",
          isExpanded ? "opacity-100" : "opacity-0"
        )}>
          {children}
        </div>
      </CardContent>
    </div>
  );
}