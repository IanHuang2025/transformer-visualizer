"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Play, 
  Trophy, 
  Lightbulb,
  Settings,
  HelpCircle,
  BookOpen
} from "lucide-react";

// Import all educational components
import { GuidedTour } from "./GuidedTour";
import { EducationalBadges } from "./EducationalBadges";
import { ContextualSuggestions, UserContext, ContextualSuggestion } from "./ContextualSuggestions";
import { ConceptExplanation, ConceptExplanationData } from "./ConceptExplanation";

// Import configurations
import { TOUR_CONFIGURATIONS, getRecommendedTour } from "@/lib/tour-configurations";
import { EDUCATIONAL_BADGES, checkForNewAchievements, AchievementTracker } from "@/lib/badge-configurations";
import { CONCEPT_EXPLANATIONS } from "@/lib/educational-tooltips";

// Educational system state
export interface EducationalSystemState {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  completedTours: string[];
  unlockedBadges: string[];
  dismissedSuggestions: string[];
  achievements: string[];
  preferences: {
    showTooltips: boolean;
    autoSuggestions: boolean;
    tourAutoStart: boolean;
    difficultyFilter: boolean;
  };
  progress: {
    totalTimeSpent: number;
    sessionsCount: number;
    lastActiveDate: string;
    actionHistory: Array<{ action: string; timestamp: number; context?: any }>;
  };
}

interface EducationalSystemProps {
  children: React.ReactNode;
  initialState?: Partial<EducationalSystemState>;
  onStateChange?: (state: EducationalSystemState) => void;
  // Panel state from parent
  activePanels: string[];
  currentSettings: Record<string, any>;
}

export function EducationalSystem({
  children,
  initialState,
  onStateChange,
  activePanels,
  currentSettings
}: EducationalSystemProps) {
  // Educational system state
  const [educationalState, setEducationalState] = useState<EducationalSystemState>({
    userLevel: 'beginner',
    completedTours: [],
    unlockedBadges: [],
    dismissedSuggestions: [],
    achievements: [],
    preferences: {
      showTooltips: true,
      autoSuggestions: true,
      tourAutoStart: false,
      difficultyFilter: true
    },
    progress: {
      totalTimeSpent: 0,
      sessionsCount: 1,
      lastActiveDate: new Date().toISOString(),
      actionHistory: []
    },
    ...initialState
  });

  // UI state
  const [showTourModal, setShowTourModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [currentTour, setCurrentTour] = useState<string | null>(null);

  // Achievement tracking
  const [achievementTracker, setAchievementTracker] = useState<AchievementTracker>({
    actions: educationalState.progress.actionHistory,
    unlockedBadges: educationalState.unlockedBadges,
    startTime: Date.now()
  });

  // Update state when changes occur
  useEffect(() => {
    if (onStateChange) {
      onStateChange(educationalState);
    }
  }, [educationalState, onStateChange]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setEducationalState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          totalTimeSpent: prev.progress.totalTimeSpent + 1
        }
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Create user context for suggestions
  const userContext: UserContext = {
    level: educationalState.userLevel,
    activePanels,
    settings: currentSettings,
    actions: educationalState.progress.actionHistory,
    timeSpent: educationalState.progress.totalTimeSpent,
    achievements: educationalState.achievements,
    dismissedSuggestions: educationalState.dismissedSuggestions
  };

  // Track actions and check for achievements
  const trackAction = useCallback((action: string, context?: any) => {
    const actionData = { action, timestamp: Date.now(), context };
    
    setEducationalState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        actionHistory: [...prev.progress.actionHistory, actionData]
      }
    }));

    // Check for new achievements
    const newBadges = checkForNewAchievements(achievementTracker, actionData);
    if (newBadges.length > 0) {
      setEducationalState(prev => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, ...newBadges],
        achievements: [...prev.achievements, ...newBadges]
      }));
    }
  }, [achievementTracker]);

  // Handle tour completion
  const handleTourComplete = (tourId: string) => {
    trackAction('tour-complete', { tourId });
    setEducationalState(prev => ({
      ...prev,
      completedTours: [...prev.completedTours, tourId]
    }));
  };

  // Handle badge unlock
  const handleBadgeUnlock = (badgeId: string) => {
    trackAction('badge-unlock', { badgeId });
    // Badge is already added by achievement tracking
  };

  // Handle suggestion dismiss
  const handleSuggestionDismiss = (suggestionId: string) => {
    setEducationalState(prev => ({
      ...prev,
      dismissedSuggestions: [...prev.dismissedSuggestions, suggestionId]
    }));
  };

  // Handle suggestion action
  const handleSuggestionAction = (suggestionId: string, action: () => void) => {
    trackAction('suggestion-action', { suggestionId });
    action();
  };

  // Generate contextual suggestions
  const generateSuggestions = (): ContextualSuggestion[] => {
    const suggestions: ContextualSuggestion[] = [];
    
    // Welcome suggestion for new users
    if (educationalState.progress.actionHistory.length < 5) {
      suggestions.push({
        id: 'welcome-beginner',
        type: 'tip',
        title: 'Welcome to Transformer Attention!',
        content: 'Start with the guided tour to understand the basics, or explore the sentence settings panel to see how different text creates different attention patterns.',
        action: {
          text: 'Start Tour',
          callback: () => {
            setCurrentTour('transformer-basics');
            setShowTourModal(true);
          }
        },
        priority: 'high',
        triggers: ['panel-open'],
        conditions: [
          { type: 'user-level', value: 'beginner' }
        ],
        difficulty: 'beginner',
        dismissible: true,
        autoShow: true
      });
    }

    // Suggest trying different head counts
    if (currentSettings.heads === 1 && educationalState.progress.actionHistory.length > 3) {
      suggestions.push({
        id: 'try-multiple-heads',
        type: 'try-this',
        title: 'Try Multiple Attention Heads',
        content: 'You\'re using just one attention head. Try increasing to 3 or 4 to see how different heads specialize in different patterns!',
        action: {
          text: 'Show Me How',
          callback: () => trackAction('suggestion-heads-increase')
        },
        priority: 'medium',
        triggers: ['heads-change'],
        conditions: [
          { type: 'setting-value', key: 'heads', value: 1, operator: 'equals' }
        ],
        difficulty: 'beginner',
        dismissible: true,
        delay: 5000
      });
    }

    // Suggest trying positional encodings
    if (!currentSettings.usePositional && educationalState.progress.actionHistory.length > 5) {
      suggestions.push({
        id: 'try-positions',
        type: 'warning',
        title: 'Positions Are Disabled',
        content: 'Without positional encodings, the model can\'t understand word order. Try enabling them to see the dramatic difference!',
        priority: 'high',
        triggers: ['position-disable'],
        conditions: [
          { type: 'setting-value', key: 'usePositional', value: false, operator: 'equals' }
        ],
        difficulty: 'beginner',
        dismissible: false
      });
    }

    // Achievement celebration
    const recentBadges = educationalState.achievements.filter(badge => {
      const recentActions = educationalState.progress.actionHistory.slice(-5);
      return recentActions.some(action => 
        action.action === 'badge-unlock' && action.context?.badgeId === badge
      );
    });
    
    if (recentBadges.length > 0) {
      const badge = EDUCATIONAL_BADGES.find(b => b.id === recentBadges[0]);
      if (badge) {
        suggestions.push({
          id: `achievement-${badge.id}`,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          content: `🎉 ${badge.title}: ${badge.description}`,
          action: {
            text: 'View Badges',
            callback: () => setShowBadgesModal(true)
          },
          priority: 'high',
          triggers: ['badge-unlock'],
          conditions: [],
          difficulty: 'beginner',
          dismissible: true,
          autoShow: true
        });
      }
    }

    return suggestions;
  };

  // Auto-recommend tours for new users
  useEffect(() => {
    if (educationalState.preferences.tourAutoStart && 
        educationalState.progress.actionHistory.length === 0) {
      const recommendedTour = getRecommendedTour(educationalState.userLevel, educationalState.completedTours);
      if (recommendedTour) {
        setCurrentTour(recommendedTour.id);
        setShowTourModal(true);
      }
    }
  }, [educationalState.userLevel, educationalState.completedTours, educationalState.preferences.tourAutoStart, educationalState.progress.actionHistory.length]);

  // Get recommended tour
  const recommendedTour = getRecommendedTour(educationalState.userLevel, educationalState.completedTours);

  // Memoize suggestions to prevent duplicates
  const suggestions = useMemo(
    () => generateSuggestions(),
    [
      educationalState.progress.actionHistory.length,
      currentSettings.heads,
      currentSettings.usePositional,
      educationalState.achievements,
      educationalState.userLevel
    ]
  );

  return (
    <div className="relative">
      {/* Educational Control Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Learning Mode</span>
            <Badge variant="outline" className="text-xs">
              {educationalState.userLevel}
            </Badge>
          </div>

          <div className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTourModal(true)}
              className="text-xs h-8"
            >
              <Play className="w-3 h-3 mr-1" />
              {recommendedTour ? `Start ${recommendedTour.title}` : 'Tours'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBadgesModal(true)}
              className="text-xs h-8 relative"
            >
              <Trophy className="w-3 h-3 mr-1" />
              Badges ({educationalState.unlockedBadges.length})
              {educationalState.achievements.length > educationalState.unlockedBadges.length && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConceptModal(true)}
              className="text-xs h-8"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Concepts
            </Button>
          </div>

          <div className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Trophy className="w-3 h-3" />
            <span>{educationalState.unlockedBadges.reduce((sum, badgeId) => {
              const badge = EDUCATIONAL_BADGES.find(b => b.id === badgeId);
              return sum + (badge?.points || 0);
            }, 0)} pts</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-20">
        {children}
      </div>

      {/* Contextual Suggestions */}
      {educationalState.preferences.autoSuggestions && (
        <ContextualSuggestions
          suggestions={suggestions}
          userContext={userContext}
          onSuggestionDismiss={handleSuggestionDismiss}
          onSuggestionAction={handleSuggestionAction}
          position="bottom-right"
        />
      )}

      {/* Guided Tour Modal */}
      <GuidedTour
        tours={TOUR_CONFIGURATIONS}
        isOpen={showTourModal}
        onClose={() => {
          setShowTourModal(false);
          setCurrentTour(null);
        }}
        onTourComplete={handleTourComplete}
        currentTour={currentTour}
        userLevel={educationalState.userLevel}
      />

      {/* Educational Badges Modal */}
      <EducationalBadges
        badges={EDUCATIONAL_BADGES}
        userProgress={{}}
        userActions={educationalState.progress.actionHistory}
        onBadgeUnlock={handleBadgeUnlock}
        isOpen={showBadgesModal}
        onClose={() => setShowBadgesModal(false)}
      />

      {/* Concept Explanations Modal */}
      {showConceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Concept Library</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowConceptModal(false)}>
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.values(CONCEPT_EXPLANATIONS).map((concept) => (
                  <div
                    key={concept.id}
                    className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => {
                      setSelectedConcept(concept.id);
                      trackAction('concept-view', { conceptId: concept.id });
                    }}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{concept.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{concept.overview}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${
                        concept.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        concept.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {concept.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {concept.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedConcept && (
                <div className="mt-6 pt-6 border-t">
                  <ConceptExplanation
                    concept={CONCEPT_EXPLANATIONS[selectedConcept]}
                    defaultExpanded={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}