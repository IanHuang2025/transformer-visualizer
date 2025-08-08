"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  X, 
  BookOpen, 
  Lightbulb, 
  Target, 
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export interface EducationalTooltipContent {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  keyPoints?: string[];
  analogies?: string[];
  commonMistakes?: string[];
  learnMoreUrl?: string;
  interactiveTips?: string[];
}

interface EducationalTooltipProps {
  content: EducationalTooltipContent;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'both';
  showDifficultyBadge?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EducationalTooltip({
  content,
  children,
  placement = 'top',
  trigger = 'both',
  showDifficultyBadge = true,
  className = "",
  size = 'md'
}: EducationalTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "max-w-xs",
    md: "max-w-md",
    lg: "max-w-lg"
  };

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-blue-100 text-blue-800 border-blue-200",
    advanced: "bg-purple-100 text-purple-800 border-purple-200"
  };

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newTop = 0;
      let newLeft = 0;

      switch (placement) {
        case 'top':
          newTop = triggerRect.top - tooltipRect.height - 12;
          newLeft = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          newTop = triggerRect.bottom + 12;
          newLeft = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          newTop = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          newLeft = triggerRect.left - tooltipRect.width - 12;
          break;
        case 'right':
          newTop = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          newLeft = triggerRect.right + 12;
          break;
      }

      // Boundary adjustments
      if (newLeft < 12) newLeft = 12;
      if (newLeft + tooltipRect.width > viewportWidth - 12) {
        newLeft = viewportWidth - tooltipRect.width - 12;
      }
      if (newTop < 12) newTop = 12;
      if (newTop + tooltipRect.height > viewportHeight - 12) {
        newTop = viewportHeight - tooltipRect.height - 12;
      }

      setPosition({ top: newTop, left: newLeft });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible, placement]);

  const handleMouseEnter = () => {
    if (trigger === 'hover' || trigger === 'both') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' || trigger === 'both') {
      setIsVisible(false);
      setShowDetails(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trigger === 'click' || trigger === 'both') {
      setIsVisible(!isVisible);
      if (!isVisible) {
        setShowDetails(false);
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setShowDetails(false);
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        setShowDetails(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className={`relative inline-flex items-center gap-1 cursor-help ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
        {showDifficultyBadge && (
          <Badge className={`text-xs ${difficultyColors[content.difficulty]}`}>
            {content.difficulty}
          </Badge>
        )}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 ${sizeClasses[size]} pointer-events-auto`}
          style={{ top: position.top, left: position.left }}
        >
          <Card className="shadow-lg border border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    {content.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${difficultyColors[content.difficulty]}`}>
                      {content.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {content.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {content.description}
                </p>

                {/* Key Points - Always visible */}
                {content.keyPoints && content.keyPoints.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-800 mb-1 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Key Points:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {content.keyPoints.slice(0, showDetails ? undefined : 2).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Toggle Details Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleDetails}
                  className="text-xs h-6 px-2 text-blue-600 hover:text-blue-800"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show More
                    </>
                  )}
                </Button>

                {/* Detailed Content - Collapsible */}
                {showDetails && (
                  <div className="space-y-3 border-t pt-3">
                    {/* Analogies */}
                    {content.analogies && content.analogies.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-800 mb-1 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-yellow-500" />
                          Think of it like:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {content.analogies.map((analogy, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-yellow-500 mt-0.5">•</span>
                              {analogy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {content.commonMistakes && content.commonMistakes.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-800 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-orange-500" />
                          Avoid these mistakes:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {content.commonMistakes.map((mistake, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-orange-500 mt-0.5">•</span>
                              {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive Tips */}
                    {content.interactiveTips && content.interactiveTips.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-800 mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3 text-purple-500" />
                          Try this:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {content.interactiveTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-purple-500 mt-0.5">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Learn More Link */}
                    {content.learnMoreUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-7"
                        onClick={() => window.open(content.learnMoreUrl, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Learn More
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}