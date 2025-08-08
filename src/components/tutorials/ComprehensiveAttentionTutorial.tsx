"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle, 
  Sparkles, 
  AlertTriangle,
  BookOpen,
  Zap,
  Target,
  Award,
  Users,
  Code,
  Globe
} from 'lucide-react';

import { 
  EDUCATIONAL_CONTENT, 
  getAnalogy, 
  selectOptimalAnalogy,
  detectCommonMistake,
  adjustExplanationLevel,
  QUIZ_QUESTIONS,
  ENGAGEMENT_ELEMENTS,
  type CommonConfusion
} from '@/lib/educational-content';

interface ComprehensiveAttentionTutorialProps {
  onComplete?: () => void;
  onSkip?: () => void;
  initialLevel?: 'beginner' | 'intermediate' | 'advanced';
  userBackground?: 'technical' | 'creative' | 'academic' | 'general' | 'business';
}

export default function ComprehensiveAttentionTutorial({ 
  onComplete, 
  onSkip,
  initialLevel = 'beginner',
  userBackground = 'general'
}: ComprehensiveAttentionTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userLevel, setUserLevel] = useState(initialLevel);
  const [selectedAnalogy, setSelectedAnalogy] = useState(() => 
    selectOptimalAnalogy(userBackground, 'low')
  );
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [userResponse, setUserResponse] = useState('');
  const [showMisconception, setShowMisconception] = useState<CommonConfusion | null>(null);
  const [encouragementShown, setEncouragementShown] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const steps = [
    {
      id: 'big-picture',
      title: 'The Big Picture: What are Transformers?',
      icon: Globe,
      color: 'bg-blue-500',
      content: EDUCATIONAL_CONTENT.bigPicture
    },
    {
      id: 'attention-concept', 
      title: 'Understanding Attention',
      icon: Brain,
      color: 'bg-purple-500',
      content: 'attention-concept'
    },
    {
      id: 'analogies',
      title: 'Visual Analogies',
      icon: Lightbulb,
      color: 'bg-green-500', 
      content: 'analogies'
    },
    {
      id: 'technical-deep-dive',
      title: 'Technical Implementation',
      icon: Code,
      color: 'bg-orange-500',
      content: 'technical'
    },
    {
      id: 'misconceptions',
      title: 'Common Misconceptions',
      icon: AlertTriangle,
      color: 'bg-red-500',
      content: 'misconceptions'
    },
    {
      id: 'applications',
      title: 'Real-World Applications',
      icon: Target,
      color: 'bg-indigo-500',
      content: 'applications'
    }
  ];

  const progress = (completedSteps.size / steps.length) * 100;

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set(prev).add(stepIndex));
    
    // Show celebration message
    if (!encouragementShown) {
      setEncouragementShown(true);
      setTimeout(() => setEncouragementShown(false), 3000);
    }
  };

  const handleUserInput = (input: string) => {
    setUserResponse(input);
    
    // Check for common misconceptions
    const misconception = detectCommonMistake(input, steps[currentStep].id);
    if (misconception) {
      setShowMisconception(misconception);
    }
  };

  const AnalogySelectorCard = () => {
    const analogyKeys = Object.keys(EDUCATIONAL_CONTENT.analogies);
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Choose Your Learning Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {analogyKeys.map((key) => {
              const analogy = getAnalogy(key as keyof typeof EDUCATIONAL_CONTENT.analogies);
              const isSelected = selectedAnalogy === key;
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedAnalogy(key)}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    isSelected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{analogy.title}</div>
                  <div className="text-xs text-gray-600">{analogy.overview}</div>
                  {isSelected && (
                    <Badge className="mt-2 bg-green-100 text-green-800">Selected</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const BigPictureSection = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            What Are Transformers?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-gray-700 leading-relaxed">
            {EDUCATIONAL_CONTENT.bigPicture.overview}
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Why Attention Changed Everything
            </h4>
            <div className="text-sm text-gray-700">
              {EDUCATIONAL_CONTENT.bigPicture.whyAttentionMatters}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Real-World Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {EDUCATIONAL_CONTENT.bigPicture.realWorldExamples.map((example, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="font-medium text-sm mb-2">{example.domain}</div>
                <div className="text-xs text-gray-600 mb-2">{example.description}</div>
                <div className="text-xs bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                  <strong>Example:</strong> {example.specificUseCase}
                </div>
                <div className="text-xs text-green-700 mt-2">
                  <strong>Impact:</strong> {example.impact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => handleStepComplete(0)} className="bg-blue-600 hover:bg-blue-700">
          I understand the big picture! <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  const AnalogySection = () => {
    const currentAnalogy = getAnalogy(selectedAnalogy as keyof typeof EDUCATIONAL_CONTENT.analogies);
    
    return (
      <div className="space-y-6">
        <AnalogySelectorCard />
        
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl">{currentAnalogy.title}</CardTitle>
            <p className="text-sm text-green-700">{currentAnalogy.overview}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentAnalogy.detailedScenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="font-medium text-sm mb-2">{scenario.scenario}</div>
                <div className="text-sm text-gray-700 mb-2">{scenario.description}</div>
                <div className="text-xs bg-green-50 p-2 rounded border-l-2 border-green-300">
                  <strong>Maps to:</strong> {scenario.mapping}
                </div>
                <div className="text-xs text-blue-700 mt-2">
                  <strong>Example:</strong> {scenario.example}
                </div>
              </div>
            ))}
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-sm mb-2">Extensions & Advanced Concepts</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                {currentAnalogy.extensions.map((extension, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    {extension}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button onClick={() => handleStepComplete(2)} className="bg-green-600 hover:bg-green-700">
            The analogy makes sense! <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  const MisconceptionsSection = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            What Attention Is NOT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {EDUCATIONAL_CONTENT.misconceptions.attentionIsNot.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded border">
                <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  ✗
                </div>
                <div className="text-sm">{item}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Confusions Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {EDUCATIONAL_CONTENT.misconceptions.commonConfusions.map((confusion, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                    <div className="font-medium text-sm text-red-800 mb-1">❌ Misconception</div>
                    <div className="text-sm text-red-700">{confusion.misconception}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <div className="font-medium text-sm text-green-800 mb-1">✅ Reality</div>
                    <div className="text-sm text-green-700">{confusion.reality}</div>
                  </div>
                </div>
                <div className="mt-3 bg-blue-50 p-3 rounded">
                  <div className="font-medium text-sm text-blue-800 mb-1">💡 Explanation</div>
                  <div className="text-sm text-blue-700">{confusion.explanation}</div>
                </div>
                {confusion.analogy && (
                  <div className="mt-2 text-xs text-gray-600 italic">
                    Analogy: {confusion.analogy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const QuizSection = () => {
    const quizKeys = Object.keys(QUIZ_QUESTIONS);
    const currentQuizData = currentQuiz ? QUIZ_QUESTIONS[currentQuiz as keyof typeof QUIZ_QUESTIONS] : null;
    
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Test Your Understanding
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!currentQuiz ? (
            <div className="grid md:grid-cols-2 gap-4">
              {quizKeys.map((key) => {
                const quiz = QUIZ_QUESTIONS[key as keyof typeof QUIZ_QUESTIONS];
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentQuiz(key)}
                    className="p-4 border rounded-lg hover:bg-purple-50 text-left"
                  >
                    <Badge className="mb-2">{quiz.difficulty}</Badge>
                    <div className="font-medium text-sm">{quiz.question}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="font-medium">{currentQuizData?.question}</div>
              <div className="space-y-2">
                {currentQuizData?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setQuizAnswered(true)}
                    className={`w-full text-left p-3 rounded border transition-all ${
                      quizAnswered 
                        ? index === currentQuizData?.correct
                          ? 'bg-green-100 border-green-400'
                          : 'bg-red-50 border-red-200'
                        : 'hover:bg-purple-50'
                    }`}
                    disabled={quizAnswered}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {quizAnswered && (
                <div className="bg-blue-50 p-4 rounded border">
                  <div className="font-medium text-sm mb-1">Explanation:</div>
                  <div className="text-sm text-gray-700">{currentQuizData?.explanation}</div>
                </div>
              )}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentQuiz(null);
                    setQuizAnswered(false);
                  }}
                >
                  Back to Quiz List
                </Button>
                {quizAnswered && (
                  <Button onClick={() => handleStepComplete(currentStep)}>
                    Continue Learning <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const getCurrentStepContent = () => {
    switch (steps[currentStep].id) {
      case 'big-picture':
        return <BigPictureSection />;
      case 'analogies':
        return <AnalogySection />;
      case 'misconceptions':
        return <MisconceptionsSection />;
      case 'technical-deep-dive':
        return <QuizSection />;
      default:
        return <div>Step content coming soon...</div>;
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  Comprehensive Attention Tutorial
                </CardTitle>
                <p className="text-sm text-indigo-700 mt-2">
                  Master transformer attention from intuition to implementation
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onSkip}>
                  Skip Tutorial
                </Button>
                {progress === 100 && (
                  <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                    <Award className="w-4 h-4 mr-1" /> Complete
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Learning Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="mb-4" />
            
            <div className="flex items-center justify-center space-x-2 overflow-x-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(index);
                const isCurrent = currentStep === index;
                
                return (
                  <React.Fragment key={index}>
                    <Tooltip>
                      <TooltipTrigger>
                        <button
                          onClick={() => setCurrentStep(index)}
                          className={`p-3 rounded-full transition-all ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? step.color + ' text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{step.title}</p>
                      </TooltipContent>
                    </Tooltip>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${steps[currentStep].color} text-white`}>
                {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
              </div>
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {getCurrentStepContent()}
          </CardContent>
        </Card>

        {/* Encouragement Messages */}
        {encouragementShown && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-lg mb-2">
                  {ENGAGEMENT_ELEMENTS.celebratory_messages[
                    Math.floor(Math.random() * ENGAGEMENT_ELEMENTS.celebratory_messages.length)
                  ]}
                </div>
                <div className="text-sm text-gray-600">
                  {ENGAGEMENT_ELEMENTS.curiosity_sparkers[
                    Math.floor(Math.random() * ENGAGEMENT_ELEMENTS.curiosity_sparkers.length)
                  ]}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Misconception Alert */}
        {showMisconception && (
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Common Misconception Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-sm text-amber-800">You might be thinking:</div>
                  <div className="text-sm text-amber-700">{showMisconception.misconception}</div>
                </div>
                <div>
                  <div className="font-medium text-sm text-green-800">But actually:</div>
                  <div className="text-sm text-green-700">{showMisconception.reality}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm">{showMisconception.explanation}</div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setShowMisconception(null)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Got it, thanks!
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}