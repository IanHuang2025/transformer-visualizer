"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  ChevronRight, 
  CheckCircle, 
  Play, 
  SkipForward,
  Trophy,
  Target,
  Brain,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

// Import tutorial components
import TokenizationTutorial from './TokenizationTutorial';
import AttentionConceptTutorial from './AttentionConceptTutorial';
import QueryKeyValueTutorial from './QueryKeyValueTutorial';
import AttentionMatrixTutorial from './AttentionMatrixTutorial';
import MultiHeadTutorial from './MultiHeadTutorial';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  component: React.ComponentType<{onComplete: () => void, onSkip: () => void}>;
  prerequisites?: string[];
}

interface TutorialOrchestratorProps {
  onComplete?: () => void;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export default function TutorialOrchestrator({ 
  onComplete, 
  userLevel = 'beginner' 
}: TutorialOrchestratorProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<string>>(new Set());
  const [showOverview, setShowOverview] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stepStartTime, setStepStartTime] = useState<number | null>(null);
  const [timeSpentPerStep, setTimeSpentPerStep] = useState<Record<string, number>>({});

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'tokenization',
      title: 'Tokenization',
      description: 'Learn how text becomes tokens that AI can understand',
      icon: <Target className="w-5 h-5" />,
      estimatedTime: '10-15 min',
      difficulty: 'beginner',
      component: TokenizationTutorial
    },
    {
      id: 'attention-concept',
      title: 'Attention Concept',
      description: 'Understand the core idea of attention mechanisms',
      icon: <Brain className="w-5 h-5" />,
      estimatedTime: '15-20 min',
      difficulty: 'beginner',
      component: AttentionConceptTutorial,
      prerequisites: ['tokenization']
    },
    {
      id: 'qkv-mechanism',
      title: 'Query, Key, Value',
      description: 'Deep dive into the QKV mechanism with library analogy',
      icon: <BookOpen className="w-5 h-5" />,
      estimatedTime: '20-25 min',
      difficulty: 'intermediate',
      component: QueryKeyValueTutorial,
      prerequisites: ['attention-concept']
    },
    {
      id: 'attention-matrix',
      title: 'Attention Matrix',
      description: 'Interactive exploration of attention matrices and patterns',
      icon: <Sparkles className="w-5 h-5" />,
      estimatedTime: '15-20 min',
      difficulty: 'intermediate',
      component: AttentionMatrixTutorial,
      prerequisites: ['qkv-mechanism']
    },
    {
      id: 'multi-head',
      title: 'Multi-Head Attention',
      description: 'See how multiple heads work together in parallel',
      icon: <Trophy className="w-5 h-5" />,
      estimatedTime: '20-25 min',
      difficulty: 'advanced',
      component: MultiHeadTutorial,
      prerequisites: ['attention-matrix']
    }
  ];

  const filteredSteps = tutorialSteps.filter(step => {
    if (userLevel === 'beginner') {
      return step.difficulty === 'beginner' || step.difficulty === 'intermediate';
    }
    if (userLevel === 'intermediate') {
      return step.difficulty !== 'advanced' || step.id === 'multi-head';
    }
    return true; // Advanced users see all steps
  });

  const currentStep = filteredSteps[currentStepIndex];
  const totalSteps = filteredSteps.length;
  const progressPercentage = ((completedSteps.size + skippedSteps.size) / totalSteps) * 100;

  const handleStepComplete = () => {
    if (currentStep) {
      setCompletedSteps(prev => new Set(prev).add(currentStep.id));
      
      // Record time spent
      if (stepStartTime) {
        const timeSpent = Date.now() - stepStartTime;
        setTimeSpentPerStep(prev => ({
          ...prev,
          [currentStep.id]: timeSpent
        }));
      }
      
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex(prev => prev + 1);
        setStepStartTime(Date.now());
      } else {
        // All tutorials completed
        onComplete?.();
      }
    }
  };

  const handleStepSkip = () => {
    if (currentStep) {
      setSkippedSteps(prev => new Set(prev).add(currentStep.id));
      
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex(prev => prev + 1);
        setStepStartTime(Date.now());
      } else {
        onComplete?.();
      }
    }
  };

  const handleJumpToStep = (stepIndex: number) => {
    if (stepIndex <= currentStepIndex || completedSteps.has(filteredSteps[stepIndex].id)) {
      setCurrentStepIndex(stepIndex);
      setStepStartTime(Date.now());
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setSkippedSteps(new Set());
    setShowOverview(true);
    setStartTime(null);
    setStepStartTime(null);
    setTimeSpentPerStep({});
  };

  const startTutorials = () => {
    setShowOverview(false);
    setStartTime(Date.now());
    setStepStartTime(Date.now());
  };

  const isStepAccessible = (stepIndex: number): boolean => {
    if (stepIndex === 0) return true;
    const step = filteredSteps[stepIndex];
    if (!step.prerequisites) return true;
    
    return step.prerequisites.every(prereq => 
      completedSteps.has(prereq) || skippedSteps.has(prereq)
    );
  };

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'skipped' | 'locked' | 'available' => {
    const step = filteredSteps[stepIndex];
    if (completedSteps.has(step.id)) return 'completed';
    if (skippedSteps.has(step.id)) return 'skipped';
    if (stepIndex === currentStepIndex) return 'current';
    if (!isStepAccessible(stepIndex)) return 'locked';
    return 'available';
  };

  if (showOverview) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        {/* Welcome Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Interactive Transformer Tutorial Journey
            </CardTitle>
            <p className="text-lg text-blue-700 mt-2">
              Master transformer attention through hands-on exploration
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Learning Path Overview */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{totalSteps}</div>
                  <div className="text-sm text-gray-600">Interactive Tutorials</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {tutorialSteps.reduce((total, step) => {
                      const time = parseInt(step.estimatedTime.split('-')[1]) || 20;
                      return total + time;
                    }, 0)} min
                  </div>
                  <div className="text-sm text-gray-600">Estimated Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 capitalize">{userLevel}</div>
                  <div className="text-sm text-gray-600">Difficulty Level</div>
                </div>
              </div>
            </div>

            {/* Tutorial Steps Preview */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Your Learning Path:</h3>
              <div className="space-y-2">
                {filteredSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        step.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-blue-600">{step.icon}</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">{step.estimatedTime}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        step.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        step.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {step.difficulty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
              <Button 
                onClick={startTutorials}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 h-auto"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Don't worry - you can skip any tutorial if you're already familiar with the concept!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CurrentTutorialComponent = currentStep?.component;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Tutorial Progress ({completedSteps.size + skippedSteps.size} of {totalSteps})
              </CardTitle>
              <p className="text-sm text-indigo-700 mt-1">
                {currentStep ? `Currently: ${currentStep.title}` : 'All tutorials completed!'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2 mt-4">
            <Progress value={progressPercentage} className="w-full h-2" />
            <div className="text-xs text-indigo-600">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tutorial Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-center">
            {filteredSteps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <button
                  key={step.id}
                  onClick={() => handleJumpToStep(index)}
                  disabled={status === 'locked'}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    status === 'completed' 
                      ? 'bg-green-100 border-green-400 text-green-800' 
                      : status === 'current'
                      ? 'bg-blue-100 border-blue-400 text-blue-800'
                      : status === 'skipped'
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                      : status === 'locked'
                      ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {status === 'completed' && <CheckCircle className="w-4 h-4" />}
                    {status === 'current' && <Play className="w-4 h-4" />}
                    {status === 'skipped' && <SkipForward className="w-4 h-4" />}
                    <span>{step.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Tutorial */}
      {CurrentTutorialComponent && (
        <CurrentTutorialComponent 
          onComplete={handleStepComplete}
          onSkip={handleStepSkip}
        />
      )}

      {/* Completion Celebration */}
      {currentStepIndex >= totalSteps && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <CardTitle className="text-2xl text-green-800">
                Congratulations! 🎉
              </CardTitle>
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-green-700">
              You've completed the Interactive Transformer Tutorial Journey!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{completedSteps.size}</div>
                <div className="text-sm text-gray-600">Tutorials Completed</div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {startTime ? Math.round((Date.now() - startTime) / (1000 * 60)) : 0} min
                </div>
                <div className="text-sm text-gray-600">Total Time Spent</div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">Expert</div>
                <div className="text-sm text-gray-600">New Level Unlocked</div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                You now have a solid understanding of how transformer attention mechanisms work! 
                You're ready to explore the main visualizer and experiment with different inputs.
              </p>
              <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Main Visualizer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}