"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLearningJourney, type JourneyStep } from "@/hooks/useLearningJourney";
import { 
  Trophy, 
  BookOpen, 
  RotateCcw, 
  Settings, 
  CheckCircle,
  Circle,
  Star,
  Sparkles,
  Clock,
  Target,
  Brain,
  Zap,
  Award,
  TrendingUp,
  PlayCircle,
  Lock,
  ArrowRight,
  Lightbulb
} from "lucide-react";

// Step definitions with enhanced metadata
const LEARNING_STEPS: Array<{
  key: JourneyStep;
  label: string;
  description: string;
  category: 'foundation' | 'core' | 'advanced';
  estimatedTime: string;
}> = [
  { 
    key: "text-input", 
    label: "Text Input", 
    description: "Start with your sentence",
    category: 'foundation',
    estimatedTime: "1 min"
  },
  { 
    key: "tokenization", 
    label: "Tokenization", 
    description: "Breaking text into tokens",
    category: 'foundation', 
    estimatedTime: "2 min"
  },
  { 
    key: "embed", 
    label: "Token Embeddings", 
    description: "Converting words to vectors",
    category: 'foundation',
    estimatedTime: "3 min"
  },
  { 
    key: "qkv", 
    label: "Query, Key & Value", 
    description: "The attention mechanism setup",
    category: 'core',
    estimatedTime: "4 min"
  },
  { 
    key: "scores", 
    label: "Attention Scores", 
    description: "Measuring word relationships", 
    category: 'core',
    estimatedTime: "3 min"
  },
  { 
    key: "softmax", 
    label: "Softmax Weights", 
    description: "Converting to probabilities",
    category: 'core',
    estimatedTime: "3 min"
  },
  { 
    key: "weighted", 
    label: "Weighted Values", 
    description: "Combining information",
    category: 'core',
    estimatedTime: "3 min"
  },
  { 
    key: "mh", 
    label: "Multi-Head Output", 
    description: "Parallel processing integration",
    category: 'advanced',
    estimatedTime: "4 min"
  },
];

export function ProgressDashboard() {
  const { 
    currentStep,
    completedSteps,
    learningPath,
    getProgressPercentage,
    conceptStatuses,
    resetJourney,
    setCurrentStep,
    canProceedToStep
  } = useLearningJourney();

  const [showDetails, setShowDetails] = useState(false);

  const progressPercentage = getProgressPercentage();
  const completedCount = completedSteps.size;
  const totalSteps = LEARNING_STEPS.length;

  // Calculate category progress
  const categoryProgress = {
    foundation: LEARNING_STEPS.filter(s => s.category === 'foundation' && completedSteps.has(s.key)).length,
    core: LEARNING_STEPS.filter(s => s.category === 'core' && completedSteps.has(s.key)).length,
    advanced: LEARNING_STEPS.filter(s => s.category === 'advanced' && completedSteps.has(s.key)).length,
  };

  const categoryTotals = {
    foundation: LEARNING_STEPS.filter(s => s.category === 'foundation').length,
    core: LEARNING_STEPS.filter(s => s.category === 'core').length,
    advanced: LEARNING_STEPS.filter(s => s.category === 'advanced').length,
  };

  const getPathIcon = () => {
    switch (learningPath) {
      case "beginner": return "🌱";
      case "intermediate": return "🌿";  
      case "free-explore": return "🚀";
      default: return "📚";
    }
  };

  const getPathLabel = () => {
    switch (learningPath) {
      case "beginner": return "Beginner Journey";
      case "intermediate": return "Intermediate Path";
      case "free-explore": return "Free Exploration";
      default: return "Learning Path";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'foundation': return <BookOpen className="w-4 h-4" />;
      case 'core': return <Brain className="w-4 h-4" />;
      case 'advanced': return <Zap className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foundation': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'core': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'advanced': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Progress Header */}
      <Card className="shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-800">{getPathLabel()}</span>
                    <span className="text-2xl">{getPathIcon()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {completedCount} of {totalSteps} concepts mastered • {Math.round(progressPercentage)}% complete
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Target className="w-4 h-4 mr-1" />
                  {showDetails ? 'Hide' : 'Show'} Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetJourney}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset Journey
                </Button>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Overall Progress</span>
                <span className="text-gray-600">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Category Progress */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(categoryTotals).map(([category, total]) => {
                const completed = categoryProgress[category as keyof typeof categoryProgress];
                const percentage = (completed / total) * 100;
                
                return (
                  <div key={category} className={`p-3 rounded-lg border ${getCategoryColor(category)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(category)}
                      <span className="text-sm font-medium capitalize">{category}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{completed}/{total} completed</div>
                    <div className="w-full bg-white/50 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          category === 'foundation' ? 'bg-blue-500' :
                          category === 'core' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress */}
      {showDetails && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Detailed Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Step Highlight */}
            {learningPath !== 'free-explore' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-900">
                        Currently Learning: {LEARNING_STEPS.find(s => s.key === currentStep)?.label || 'Getting Started'}
                      </div>
                      <div className="text-sm text-blue-700">
                        {LEARNING_STEPS.find(s => s.key === currentStep)?.description || 'Choose your learning path to begin'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Est. {LEARNING_STEPS.find(s => s.key === currentStep)?.estimatedTime || '2 min'}
                  </div>
                </div>
              </div>
            )}

            {/* Step List */}
            <div className="space-y-2">
              {LEARNING_STEPS.map((step, index) => {
                const isCompleted = completedSteps.has(step.key);
                const isCurrent = currentStep === step.key;
                const canProceed = canProceedToStep(step.key);
                const conceptStatus = conceptStatuses.get(step.key);
                
                return (
                  <div 
                    key={step.key} 
                    className={`p-3 rounded-lg border transition-all ${
                      isCompleted 
                        ? "bg-green-50 border-green-200" 
                        : isCurrent
                        ? "bg-blue-50 border-blue-200"
                        : canProceed
                        ? "bg-white border-gray-200 hover:border-gray-300"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          isCompleted 
                            ? "bg-green-100 border-green-400 text-green-600" 
                            : isCurrent
                            ? "bg-blue-100 border-blue-400 text-blue-600 animate-pulse"
                            : canProceed
                            ? "bg-gray-100 border-gray-300 text-gray-600"
                            : "bg-gray-100 border-gray-200 text-gray-400"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : isCurrent ? (
                            <Sparkles className="w-4 h-4" />
                          ) : canProceed ? (
                            <span className="text-xs font-medium">{index + 1}</span>
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className={`font-medium ${
                            isCompleted 
                              ? "text-green-800" 
                              : isCurrent
                              ? "text-blue-800"
                              : canProceed
                              ? "text-gray-800"
                              : "text-gray-500"
                          }`}>
                            {step.label}
                          </div>
                          <div className={`text-sm ${
                            isCompleted 
                              ? "text-green-600" 
                              : isCurrent
                              ? "text-blue-600"
                              : canProceed
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}>
                            {step.description}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Concept Mastery Indicators */}
                        {conceptStatus && (
                          <div className="flex items-center gap-1">
                            {conceptStatus.interacted && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" title="Interacted" />
                            )}
                            {conceptStatus.quizPassed && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" title="Quiz Passed" />
                            )}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          {step.estimatedTime}
                        </div>
                        
                        {canProceed && !isCompleted && learningPath !== 'free-explore' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setCurrentStep(step.key)}
                            className="text-xs"
                          >
                            {isCurrent ? 'Current' : 'Go to'}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Banner */}
      {completedCount === totalSteps && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Award className="w-8 h-8 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-800">Congratulations! 🎉</div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-yellow-700 mb-4">
              You've mastered the complete Transformer attention mechanism!
            </div>
            <div className="text-sm text-yellow-600">
              You now understand the full pipeline: embeddings → Q,K,V → attention scores → 
              softmax weights → weighted values → multi-head output. Ready to explore advanced topics!
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      {learningPath !== 'free-explore' && completedCount < totalSteps && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-purple-800 mb-2">Learning Tips</div>
                <div className="space-y-1 text-sm text-purple-700">
                  <div>• Take your time with each concept before moving forward</div>
                  <div>• Try different sentences to see how attention patterns change</div>
                  <div>• Use the interactive elements to reinforce understanding</div>
                  <div>• Check your progress regularly to track mastery</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}