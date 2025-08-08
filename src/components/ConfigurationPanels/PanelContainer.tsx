"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";
import { PanelContent } from "./PanelContent";

interface PanelContainerProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  defaultExpanded?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function PanelContainer({
  title,
  icon,
  description,
  defaultExpanded = false,
  className,
  children,
}: PanelContainerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        "border-l-4 border-l-blue-500/30 hover:border-l-blue-500",
        "shadow-sm hover:shadow-md",
        className
      )}
    >
      <PanelHeader
        title={title}
        icon={icon}
        description={description}
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
      />
      <PanelContent isExpanded={isExpanded}>
        {children}
      </PanelContent>
    </Card>
  );
}