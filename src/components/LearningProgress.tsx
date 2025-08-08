"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWelcome } from "@/contexts/WelcomeContext";
import { 
  Trophy, 
  BookOpen, 
  RotateCcw, 
  Settings, 
  CheckCircle,
  Circle,
  Star,
  Sparkles
} from "lucide-react";

const LEARNING_STEPS = [
  { key: "embed", label: "Token Embeddings", description: "Understanding word representations" },
  { key: "qkv", label: "Query, Key & Value", description: "The attention mechanism setup" },
  { key: "scores", label: "Attention Scores", description: "Measuring relevance between tokens" },
  { key: "softmax", label: "Softmax Weights", description: "Converting scores to probabilities" },
  { key: "weighted", label: "Weighted Values", description: "Gathering relevant information" },
  { key: "mh", label: "Multi-Head Output", description: "Combining parallel attention" },
];

interface LearningProgressProps {
  currentStep?: string;
  onStepChange?: (step: string) => void;
}

export function LearningProgress({ currentStep, onStepChange }: LearningProgressProps) {
  const { 
    learningPath, 
    completedSteps, 
    isStepCompleted, 
    showWelcomeModal, 
    restartTour 
  } = useWelcome();

  const completedCount = completedSteps.length;
  const totalSteps = LEARNING_STEPS.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  const getPathIcon = () => {
    switch (learningPath) {
      case "beginner": return "🌱";
      case "intermediate": return "🌿";  
      case "advanced": return "🌳";
      default: return "📚";
    }
  };

  const getPathLabel = () => {
    switch (learningPath) {
      case "beginner": return "Beginner Path";
      case "intermediate": return "Intermediate Path";
      case "advanced": return "Advanced Path";
      default: return "Learning Path";
    }
  };

  return (
    <Card className="shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{getPathLabel()}</span>
                  <span className="text-lg">{getPathIcon()}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {completedCount} of {totalSteps} steps completed
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={showWelcomeModal}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Settings className="w-4 h-4 mr-1" />
                Change Path
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={restartTour}
                className="text-purple-600 border-purple-300 hover:bg-purple-50"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Restart Tour
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Learning Progress</span>
              <span className="text-gray-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Indicators (Compact View) */}
          <div className="grid grid-cols-6 gap-2">
            {LEARNING_STEPS.map((step, _index) => {
              const isCompleted = isStepCompleted(step.key);
              const isCurrent = currentStep === step.key;
              
              return (
                <div key={step.key} className="text-center">
                  <button
                    onClick={() => onStepChange?.(step.key)}
                    disabled={!isCompleted && !isCurrent}
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 transition-all cursor-pointer hover:scale-110 disabled:cursor-not-allowed ${
                    isCompleted 
                      ? "bg-green-100 border-green-400 text-green-600 hover:bg-green-200" 
                      : isCurrent
                      ? "bg-blue-100 border-blue-400 text-blue-600 animate-pulse hover:bg-blue-200"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <div className={`text-xs mt-1 px-1 ${
                    isCompleted 
                      ? "text-green-700 font-medium" 
                      : isCurrent
                      ? "text-blue-700 font-medium"
                      : "text-gray-500"
                  }`}>
                    {step.label.split(" ")[0]} {/* Show first word only for space */}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Achievement Badge */}
          {completedCount === totalSteps && (
            <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-center gap-2 text-yellow-700">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Congratulations!</span>
                <Star className="w-5 h-5" />
              </div>
              <p className="text-sm text-yellow-600 mt-1">
                You&apos;ve completed the transformer attention visualization! 🎉
              </p>
            </div>
          )}

          {/* Current Step Hint */}
          {currentStep && !isStepCompleted(currentStep) && (
            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center gap-2 text-blue-700 text-sm">
                <BookOpen className="w-4 h-4" />
                <span>
                  Currently learning: <strong>{LEARNING_STEPS.find(s => s.key === currentStep)?.label}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}