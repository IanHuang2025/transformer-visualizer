"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  TrendingUp, 
  ArrowRight, 
  X, 
  Sparkles,
  Eye,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export interface ContextualSuggestion {
  id: string;
  type: 'tip' | 'try-this' | 'did-you-know' | 'warning' | 'achievement';
  title: string;
  content: string;
  action?: {
    text: string;
    callback: () => void;
  };
  priority: 'low' | 'medium' | 'high';
  triggers: string[]; // What user actions trigger this suggestion
  conditions: ContextCondition[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dismissible: boolean;
  autoShow?: boolean;
  delay?: number; // Show after N milliseconds
}

export interface ContextCondition {
  type: 'user-level' | 'panel-active' | 'setting-value' | 'time-spent' | 'action-count';
  key?: string;
  value?: any;
  operator?: 'equals' | 'greater' | 'less' | 'contains' | 'not-equals';
}

export interface UserContext {
  level: 'beginner' | 'intermediate' | 'advanced';
  activePanels: string[];
  settings: Record<string, any>;
  actions: Array<{ action: string; timestamp: number; context?: any }>;
  timeSpent: number;
  achievements: string[];
  dismissedSuggestions: string[];
}

interface ContextualSuggestionsProps {
  suggestions: ContextualSuggestion[];
  userContext: UserContext;
  onSuggestionDismiss: (suggestionId: string) => void;
  onSuggestionAction: (suggestionId: string, action: () => void) => void;
  maxVisible?: number;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export function ContextualSuggestions({
  suggestions,
  userContext,
  onSuggestionDismiss,
  onSuggestionAction,
  maxVisible = 3,
  position = 'bottom-right'
}: ContextualSuggestionsProps) {
  const [visibleSuggestions, setVisibleSuggestions] = useState<ContextualSuggestion[]>([]);
  const [displayQueue, setDisplayQueue] = useState<ContextualSuggestion[]>([]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4'
  };

  const typeIcons = {
    'tip': Lightbulb,
    'try-this': TrendingUp,
    'did-you-know': Sparkles,
    'warning': AlertCircle,
    'achievement': CheckCircle
  };

  const typeColors = {
    'tip': 'border-yellow-200 bg-yellow-50',
    'try-this': 'border-blue-200 bg-blue-50', 
    'did-you-know': 'border-purple-200 bg-purple-50',
    'warning': 'border-orange-200 bg-orange-50',
    'achievement': 'border-green-200 bg-green-50'
  };

  // Check if a suggestion meets its conditions
  const checkConditions = (suggestion: ContextualSuggestion): boolean => {
    return suggestion.conditions.every(condition => {
      switch (condition.type) {
        case 'user-level':
          const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return levelOrder[userContext.level] >= levelOrder[condition.value as 'beginner' | 'intermediate' | 'advanced'];
        
        case 'panel-active':
          return userContext.activePanels.includes(condition.value);
        
        case 'setting-value':
          if (!condition.key) return false;
          const settingValue = userContext.settings[condition.key];
          switch (condition.operator) {
            case 'equals': return settingValue === condition.value;
            case 'not-equals': return settingValue !== condition.value;
            case 'greater': return settingValue > condition.value;
            case 'less': return settingValue < condition.value;
            case 'contains': return String(settingValue).includes(condition.value);
            default: return settingValue === condition.value;
          }
        
        case 'time-spent':
          switch (condition.operator) {
            case 'greater': return userContext.timeSpent > condition.value;
            case 'less': return userContext.timeSpent < condition.value;
            default: return userContext.timeSpent >= condition.value;
          }
        
        case 'action-count':
          const actionCount = userContext.actions.filter(a => 
            condition.key ? a.action === condition.key : true
          ).length;
          switch (condition.operator) {
            case 'greater': return actionCount > condition.value;
            case 'less': return actionCount < condition.value;
            default: return actionCount >= condition.value;
          }
        
        default:
          return true;
      }
    });
  };

  // Filter and prioritize suggestions
  useEffect(() => {
    const eligibleSuggestions = suggestions.filter(suggestion => {
      // Check if dismissed
      if (userContext.dismissedSuggestions.includes(suggestion.id)) {
        return false;
      }
      
      // Check difficulty level
      const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      if (levelOrder[suggestion.difficulty] > levelOrder[userContext.level]) {
        return false;
      }
      
      // Check conditions
      return checkConditions(suggestion);
    });

    // Sort by priority and check for triggers
    const triggeredSuggestions = eligibleSuggestions.filter(suggestion => {
      if (suggestion.autoShow) return true;
      
      return suggestion.triggers.some(trigger => {
        return userContext.actions.some(action => 
          action.action.includes(trigger) && 
          Date.now() - action.timestamp < 10000 // Within last 10 seconds
        );
      });
    });

    // Sort by priority
    const sortedSuggestions = triggeredSuggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Add to display queue
    const newSuggestions = sortedSuggestions.filter(s => 
      !displayQueue.find(ds => ds.id === s.id) && 
      !visibleSuggestions.find(vs => vs.id === s.id)
    );

    if (newSuggestions.length > 0) {
      setDisplayQueue(prev => [...prev, ...newSuggestions]);
    }
  }, [suggestions, userContext, displayQueue, visibleSuggestions]);

  // Process display queue
  useEffect(() => {
    if (displayQueue.length > 0 && visibleSuggestions.length < maxVisible) {
      const nextSuggestion = displayQueue[0];
      const delay = nextSuggestion.delay || 0;
      
      const timer = setTimeout(() => {
        setVisibleSuggestions(prev => {
          // Check if suggestion is already visible
          if (prev.find(s => s.id === nextSuggestion.id)) {
            return prev;
          }
          if (prev.length < maxVisible) {
            return [...prev, nextSuggestion];
          }
          return prev;
        });
        setDisplayQueue(prev => prev.slice(1));
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [displayQueue, visibleSuggestions, maxVisible]);

  const handleDismiss = (suggestionId: string) => {
    setVisibleSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    onSuggestionDismiss(suggestionId);
  };

  const handleAction = (suggestion: ContextualSuggestion) => {
    if (suggestion.action) {
      onSuggestionAction(suggestion.id, suggestion.action.callback);
      handleDismiss(suggestion.id);
    }
  };

  if (visibleSuggestions.length === 0) return null;

  return (
    <div className={`fixed z-30 space-y-3 ${positionClasses[position]} max-w-sm`}>
      {visibleSuggestions.map((suggestion, index) => {
        const Icon = typeIcons[suggestion.type];
        
        return (
          <Card 
            key={`${suggestion.id}-${index}`}
            className={`shadow-lg border-2 transition-all duration-300 ${typeColors[suggestion.type]}`}
            style={{
              transform: `translateY(${index * -4}px)`,
              zIndex: 30 - index
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    suggestion.type === 'tip' ? 'bg-yellow-200 text-yellow-800' :
                    suggestion.type === 'try-this' ? 'bg-blue-200 text-blue-800' :
                    suggestion.type === 'did-you-know' ? 'bg-purple-200 text-purple-800' :
                    suggestion.type === 'warning' ? 'bg-orange-200 text-orange-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {suggestion.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.difficulty}
                      </Badge>
                    </div>
                    
                    {suggestion.dismissible && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(suggestion.id)}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                    {suggestion.content}
                  </p>
                  
                  {suggestion.action && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(suggestion)}
                      className="text-xs h-7"
                    >
                      {suggestion.action.text}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Queue indicator */}
      {displayQueue.length > 0 && (
        <div className="text-right">
          <Badge variant="secondary" className="text-xs">
            <Eye className="w-3 h-3 mr-1" />
            {displayQueue.length} more suggestions
          </Badge>
        </div>
      )}
    </div>
  );
}