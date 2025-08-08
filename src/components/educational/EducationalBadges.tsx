"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Star, 
  Trophy, 
  Target, 
  Eye, 
  Brain, 
  Zap, 
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Lightbulb,
  X,
  Lock
} from "lucide-react";

export interface EducationalBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exploration' | 'understanding' | 'mastery' | 'discovery' | 'persistence';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  requirements: BadgeRequirement[];
  unlockMessage: string;
  hints: string[];
  prerequisiteBadges?: string[];
  hidden?: boolean; // Easter egg badges
}

export interface BadgeRequirement {
  type: 'action-count' | 'time-spent' | 'tour-complete' | 'setting-experiment' | 'pattern-discovery' | 'combo' | 'streak';
  description: string;
  target: number;
  current?: number;
  details?: Record<string, any>;
}

export interface BadgeProgress {
  badgeId: string;
  progress: number; // 0-100
  requirements: { [key: number]: { completed: boolean; progress: number } };
  unlockedAt?: Date;
  isNew?: boolean;
}

interface EducationalBadgesProps {
  badges: EducationalBadge[];
  userProgress: Record<string, BadgeProgress>;
  userActions: Array<{ action: string; timestamp: number; context?: any }>;
  onBadgeUnlock: (badgeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function EducationalBadges({
  badges,
  userProgress,
  userActions,
  onBadgeUnlock,
  isOpen,
  onClose
}: EducationalBadgesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Set<string>>(new Set());

  const iconMap: Record<string, React.ComponentType<any>> = {
    award: Award,
    star: Star,
    trophy: Trophy,
    target: Target,
    eye: Eye,
    brain: Brain,
    zap: Zap,
    clock: Clock,
    trending: TrendingUp,
    users: Users,
    book: BookOpen,
    lightbulb: Lightbulb
  };

  const difficultyColors = {
    bronze: "bg-amber-100 text-amber-800 border-amber-300",
    silver: "bg-gray-100 text-gray-800 border-gray-300", 
    gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
    platinum: "bg-purple-100 text-purple-800 border-purple-300"
  };

  const categoryIcons = {
    exploration: Eye,
    understanding: Brain,
    mastery: Trophy,
    discovery: Star,
    persistence: Clock
  };

  // Calculate current progress for each badge
  const calculateBadgeProgress = (badge: EducationalBadge): BadgeProgress => {
    const existingProgress = userProgress[badge.id] || {
      badgeId: badge.id,
      progress: 0,
      requirements: {}
    };

    const updatedRequirements = { ...existingProgress.requirements };
    let totalProgress = 0;

    badge.requirements.forEach((requirement, index) => {
      let current = 0;
      let completed = false;

      switch (requirement.type) {
        case 'action-count':
          const actionType = requirement.details?.actionType;
          current = userActions.filter(a => 
            actionType ? a.action.includes(actionType) : true
          ).length;
          completed = current >= requirement.target;
          break;

        case 'time-spent':
          // Assuming we track total time spent
          current = userActions.length > 0 ? 
            Math.floor((Date.now() - userActions[0].timestamp) / (1000 * 60)) : 0;
          completed = current >= requirement.target;
          break;

        case 'tour-complete':
          const tourId = requirement.details?.tourId;
          current = userActions.filter(a => 
            a.action === 'tour-complete' && 
            (!tourId || a.context?.tourId === tourId)
          ).length;
          completed = current >= requirement.target;
          break;

        case 'setting-experiment':
          const settingType = requirement.details?.settingType;
          const uniqueValues = new Set(
            userActions
              .filter(a => a.action.includes('setting-change') && 
                         (!settingType || a.context?.type === settingType))
              .map(a => a.context?.value)
          );
          current = uniqueValues.size;
          completed = current >= requirement.target;
          break;

        case 'pattern-discovery':
          // Custom logic for pattern discoveries
          current = userActions.filter(a => 
            a.action.includes('pattern-discovery') ||
            a.action.includes('attention-analysis')
          ).length;
          completed = current >= requirement.target;
          break;

        case 'combo':
          // Multi-action combinations within timeframes
          const comboActions = requirement.details?.actions || [];
          let comboCount = 0;
          for (let i = 0; i < userActions.length - comboActions.length + 1; i++) {
            const window = userActions.slice(i, i + comboActions.length);
            const timespan = window[window.length - 1].timestamp - window[0].timestamp;
            if (timespan <= (requirement.details?.timeWindow || 30000)) { // 30 seconds
              const hasAllActions = comboActions.every((actionType: string) =>
                window.some(a => a.action.includes(actionType))
              );
              if (hasAllActions) comboCount++;
            }
          }
          current = comboCount;
          completed = current >= requirement.target;
          break;

        case 'streak':
          // Consecutive days or actions
          const streakType = requirement.details?.streakType;
          if (streakType === 'daily') {
            // Calculate daily streak
            const today = new Date().toDateString();
            let streak = 0;
            let currentDate = new Date();
            
            while (true) {
              const dateStr = currentDate.toDateString();
              const hasAction = userActions.some(a => 
                new Date(a.timestamp).toDateString() === dateStr
              );
              if (hasAction) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
              } else {
                break;
              }
            }
            current = streak;
          } else {
            // Action streak
            current = Math.max(...userActions.map((_, i) => i + 1));
          }
          completed = current >= requirement.target;
          break;
      }

      const requirementProgress = Math.min((current / requirement.target) * 100, 100);
      updatedRequirements[index] = { completed, progress: requirementProgress };
      totalProgress += requirementProgress;
    });

    const overallProgress = totalProgress / badge.requirements.length;
    const isUnlocked = Object.values(updatedRequirements).every(req => req.completed);

    // Check if newly unlocked
    if (isUnlocked && !existingProgress.unlockedAt && !newlyUnlocked.has(badge.id)) {
      setNewlyUnlocked(prev => new Set(prev).add(badge.id));
      onBadgeUnlock(badge.id);
    }

    return {
      ...existingProgress,
      progress: overallProgress,
      requirements: updatedRequirements,
      unlockedAt: isUnlocked ? (existingProgress.unlockedAt || new Date()) : undefined,
      isNew: newlyUnlocked.has(badge.id)
    };
  };

  const badgeProgressMap = badges.reduce((acc, badge) => {
    acc[badge.id] = calculateBadgeProgress(badge);
    return acc;
  }, {} as Record<string, BadgeProgress>);

  const categories = ['all', ...Array.from(new Set(badges.map(b => b.category)))];
  
  const filteredBadges = badges.filter(badge => {
    if (selectedCategory !== 'all' && badge.category !== selectedCategory) return false;
    if (showUnlockedOnly && !badgeProgressMap[badge.id].unlockedAt) return false;
    if (badge.hidden && !badgeProgressMap[badge.id].unlockedAt) return false;
    
    // Check prerequisites
    if (badge.prerequisiteBadges) {
      const hasPrerequisites = badge.prerequisiteBadges.every(prereqId =>
        badgeProgressMap[prereqId]?.unlockedAt
      );
      if (!hasPrerequisites) return false;
    }
    
    return true;
  });

  const unlockedCount = Object.values(badgeProgressMap).filter(p => p.unlockedAt).length;
  const totalPoints = Object.entries(badgeProgressMap)
    .filter(([_, progress]) => progress.unlockedAt)
    .reduce((sum, [badgeId, _]) => {
      const badge = badges.find(b => b.id === badgeId);
      return sum + (badge?.points || 0);
    }, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Learning Achievements
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{unlockedCount}</span> of {badges.length} badges earned
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-yellow-600">{totalPoints}</span> total points
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Category:</span>
              {categories.map(category => {
                const Icon = category === 'all' ? Award : categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs flex items-center gap-1"
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    {category === 'all' ? 'All' : category}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              className="text-xs"
            >
              {showUnlockedOnly ? 'Show All' : 'Unlocked Only'}
            </Button>
          </div>

          {/* Badges Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map(badge => {
              const progress = badgeProgressMap[badge.id];
              const Icon = iconMap[badge.icon] || Award;
              const isUnlocked = !!progress.unlockedAt;
              const CategoryIcon = categoryIcons[badge.category];

              return (
                <Card 
                  key={badge.id}
                  className={`transition-all duration-300 ${
                    isUnlocked ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' : 
                    progress.progress > 0 ? 'border-blue-300 bg-blue-50' : 
                    'border-gray-200 bg-gray-50 opacity-75'
                  } ${progress.isNew ? 'ring-2 ring-yellow-400 animate-pulse' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isUnlocked ? 'bg-yellow-200 text-yellow-700' : 
                          progress.progress > 0 ? 'bg-blue-200 text-blue-700' : 
                          'bg-gray-200 text-gray-500'
                        }`}>
                          {isUnlocked ? (
                            <Icon className="w-6 h-6" />
                          ) : progress.progress > 0 ? (
                            <Icon className="w-6 h-6" />
                          ) : (
                            <Lock className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className={`font-semibold text-sm ${
                            isUnlocked ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {badge.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${difficultyColors[badge.difficulty]}`}>
                              {badge.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <CategoryIcon className="w-3 h-3" />
                              {badge.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {isUnlocked && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold text-yellow-700">{badge.points}</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-xs mb-3 leading-relaxed ${
                      isUnlocked ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {badge.description}
                    </p>

                    {!isUnlocked && (
                      <>
                        <Progress value={progress.progress} className="mb-3" />
                        <div className="space-y-2">
                          {badge.requirements.map((requirement, index) => {
                            const reqProgress = progress.requirements[index];
                            return (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className={`${reqProgress?.completed ? 'text-green-600' : 'text-gray-600'}`}>
                                  {requirement.description}
                                </span>
                                <div className="flex items-center gap-1">
                                  {reqProgress?.completed ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <span className="text-gray-500">
                                      {Math.floor(reqProgress?.progress || 0)}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {isUnlocked && progress.unlockedAt && (
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-2">
                        <CheckCircle className="w-3 h-3" />
                        Unlocked {progress.unlockedAt.toLocaleDateString()}
                      </div>
                    )}

                    {/* Hints for locked badges */}
                    {!isUnlocked && badge.hints.length > 0 && progress.progress > 10 && (
                      <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-200">
                        <div className="text-xs font-medium text-blue-900 mb-1 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          Hint:
                        </div>
                        <div className="text-xs text-blue-800">
                          {badge.hints[Math.floor(progress.progress / 25)] || badge.hints[0]}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}