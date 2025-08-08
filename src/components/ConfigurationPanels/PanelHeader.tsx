"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PanelHeaderProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function PanelHeader({
  title,
  icon,
  description,
  isExpanded,
  onToggle,
}: PanelHeaderProps) {
  return (
    <CardHeader className="pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 text-blue-600">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm font-semibold text-gray-800 truncate">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs mt-1 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "h-8 w-8 p-0 flex-shrink-0 ml-2",
            "hover:bg-blue-50 hover:text-blue-700",
            "transition-all duration-200"
          )}
          aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </CardHeader>
  );
}