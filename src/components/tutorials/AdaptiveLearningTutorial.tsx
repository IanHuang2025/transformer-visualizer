"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Zap,
  Users,
  Lightbulb,
  Award
} from 'lucide-react';

import {
  EDUCATIONAL_CONTENT,
  getStepExplanation,
  adjustExplanationLevel,
  selectOptimalAnalogy,
  getAnalogy,
  QUIZ_QUESTIONS,
  ENGAGEMENT_ELEMENTS,
  type LeveledExplanations
} from '@/lib/educational-content';

interface AdaptiveLearningTutorialProps {
  onComplete?: () => void;
  userBackground?: 'technical' | 'creative' | 'academic' | 'general' | 'business';
  initialLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface UserPerformance {
  correctAnswers: number;
  totalAnswers: number;
  timeSpent: number;
  strugglingConcepts: string[];
  masteredConcepts: string[];
}

export default function AdaptiveLearningTutorial({ 
  onComplete,
  userBackground = 'general',
  initialLevel = 'beginner'
}: AdaptiveLearningTutorialProps) {
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(initialLevel);
  const [currentStep, setCurrentStep] = useState(0);
  const [performance, setPerformance] = useState<UserPerformance>({
    correctAnswers: 0,
    totalAnswers: 0,
    timeSpent: 0,
    strugglingConcepts: [],
    masteredConcepts: []
  });
  const [selectedAnalogy, setSelectedAnalogy] = useState(() => 
    selectOptimalAnalogy(userBackground, 'low')
  );
  const [showLevelAdjustment, setShowLevelAdjustment] = useState(false);
  const [conceptMastery, setConceptMastery] = useState<Record<string, number>>({});
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; time: number }[]>([]);

  const steps = EDUCATIONAL_CONTENT.steps;
  const currentStepData = steps[currentStep];

  // Calculate adaptive difficulty
  const adaptiveDifficulty = React.useMemo(() => {
    const accuracyRate = performance.totalAnswers > 0 ? performance.correctAnswers / performance.totalAnswers : 0;
    const avgTime = quizResults.length > 0 ? quizResults.reduce((sum, r) => sum + r.time, 0) / quizResults.length : 0;
    
    if (accuracyRate > 0.8 && avgTime < 10000) return 'advanced'; // Fast and accurate
    if (accuracyRate < 0.5 || avgTime > 20000) return 'struggling'; // Slow or inaccurate
    return 'comfortable';
  }, [performance, quizResults]);

  // Auto-adjust difficulty
  useEffect(() => {
    if (performance.totalAnswers >= 3) {
      const newLevel = adjustExplanationLevel(currentLevel, adaptiveDifficulty);
      if (newLevel !== currentLevel) {
        setCurrentLevel(newLevel);
        setShowLevelAdjustment(true);
        setTimeout(() => setShowLevelAdjustment(false), 5000);
      }
    }
  }, [performance, adaptiveDifficulty, currentLevel]);

  // Update analogy based on performance
  useEffect(() => {
    const difficulty = currentLevel === 'beginner' ? 'low' : currentLevel === 'intermediate' ? 'medium' : 'high';
    const newAnalogy = selectOptimalAnalogy(userBackground, difficulty);
    if (newAnalogy !== selectedAnalogy) {
      setSelectedAnalogy(newAnalogy);
    }
  }, [currentLevel, userBackground, selectedAnalogy]);

  const handleQuizAnswer = (questionKey: string, selectedAnswer: number, timeSpent: number) => {
    const question = QUIZ_QUESTIONS[questionKey as keyof typeof QUIZ_QUESTIONS];
    const isCorrect = selectedAnswer === question.correct;
    
    setPerformance(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalAnswers: prev.totalAnswers + 1,
      timeSpent: prev.timeSpent + timeSpent
    }));

    setQuizResults(prev => [...prev, { correct: isCorrect, time: timeSpent }]);
    
    // Update concept mastery
    setConceptMastery(prev => ({
      ...prev,
      [questionKey]: (prev[questionKey] || 0) + (isCorrect ? 0.3 : -0.1)
    }));

    setCurrentQuiz(null);
  };

  const ConceptExplanationCard = ({ stepId }: { stepId: string }) => {
    const explanation = getStepExplanation(stepId, currentLevel);
    
    if (!explanation) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              {currentStepData.title}
            </CardTitle>
            <Badge 
              variant={currentLevel === 'beginner' ? 'default' : 
                      currentLevel === 'intermediate' ? 'secondary' : 'destructive'}
            >
              {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border">
            <p className="text-sm text-blue-800">{explanation.overview}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                <Target className="w-4 h-4 text-green-600" />
                Key Points
              </h4>
              <ul className="space-y-1">
                {explanation.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 text-xs">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                Visual Cues
              </h4>
              <ul className="space-y-1">
                {explanation.visualCues.map((cue, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-yellow-600 text-xs">•</span>
                    {cue}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {explanation.practicalTips && explanation.practicalTips.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border">
              <h4 className="font-medium text-sm mb-2 text-green-800">💡 Practical Tips</h4>
              <ul className="space-y-1">
                {explanation.practicalTips.map((tip, index) => (
                  <li key={index} className="text-sm text-green-700">• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {currentLevel === 'advanced' && explanation.mathematics && (
            <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
              <div className="font-medium mb-2 font-sans">Mathematical Formula:</div>
              {explanation.mathematics}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const AnalogyCard = () => {
    const analogy = getAnalogy(selectedAnalogy as keyof typeof EDUCATIONAL_CONTENT.analogies);
    
    return (
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            {analogy.title}
          </CardTitle>
          <p className="text-sm text-purple-700">{analogy.overview}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analogy.detailedScenarios.slice(0, currentLevel === 'beginner' ? 2 : 4).map((scenario, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="font-medium text-sm mb-1">{scenario.scenario}</div>
                <div className="text-sm text-gray-700 mb-2">{scenario.description}</div>
                <div className="text-xs bg-purple-100 p-2 rounded">
                  <strong>Connection:</strong> {scenario.mapping}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const PerformanceDashboard = () => {
    const accuracyRate = performance.totalAnswers > 0 ? (performance.correctAnswers / performance.totalAnswers) * 100 : 0;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Math.round(accuracyRate)}%</div>
              <div className="text-sm text-blue-700">Accuracy Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{performance.masteredConcepts.length}</div>
              <div className="text-sm text-green-700">Concepts Mastered</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentLevel}</div>
              <div className="text-sm text-purple-700">Current Level</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{currentStep + 1} / {steps.length} steps</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  };

  const QuizCard = () => {
    const availableQuizzes = Object.entries(QUIZ_QUESTIONS).filter(
      ([_, quiz]) => quiz.difficulty === currentLevel || currentLevel === 'intermediate'
    );
    
    if (currentQuiz) {
      const quizData = QUIZ_QUESTIONS[currentQuiz as keyof typeof QUIZ_QUESTIONS];
      const [startTime] = useState(Date.now());
      
      return (
        <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-600" />
              Quick Understanding Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="font-medium">{quizData.question}</div>
              <div className="space-y-2">
                {quizData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(currentQuiz, index, Date.now() - startTime)}
                    className="w-full text-left p-3 rounded border hover:bg-orange-50 transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Test Your Understanding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {availableQuizzes.map(([key, quiz]) => (
              <button
                key={key}
                onClick={() => setCurrentQuiz(key)}
                className="text-left p-3 border rounded-lg hover:bg-yellow-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{quiz.question.slice(0, 50)}...</div>
                  <Badge variant="outline">{quiz.difficulty}</Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-600" />
                Adaptive Learning Experience
              </CardTitle>
              <p className="text-sm text-indigo-700 mt-2">
                Personalized transformer education that adapts to your learning pace
              </p>
            </div>
            <Button 
              onClick={onComplete}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={currentStep < steps.length - 1}
            >
              <Award className="w-4 h-4 mr-1" />
              {currentStep < steps.length - 1 ? 'Complete All Steps' : 'Finish Learning'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Level Adjustment Notification */}
      {showLevelAdjustment && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {adaptiveDifficulty === 'advanced' ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-blue-600" />
              )}
              <div>
                <div className="font-medium text-sm">
                  Level Adjusted: Now showing {currentLevel} content
                </div>
                <div className="text-sm text-gray-600">
                  {adaptiveDifficulty === 'advanced' 
                    ? "Great job! You're ready for more challenging material."
                    : adaptiveDifficulty === 'struggling'
                    ? "Let's take it step by step with simpler explanations."
                    : "Adjusting to match your learning pace."
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <PerformanceDashboard />

      <Tabs defaultValue="concept" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="concept">Core Concept</TabsTrigger>
          <TabsTrigger value="analogy">Visual Analogy</TabsTrigger>
          <TabsTrigger value="practice">Practice Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="concept" className="mt-6">
          <ConceptExplanationCard stepId={currentStepData.id} />
        </TabsContent>
        
        <TabsContent value="analogy" className="mt-6">
          <AnalogyCard />
        </TabsContent>
        
        <TabsContent value="practice" className="mt-6">
          <QuizCard />
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>
            
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}: {currentStepData.title}
            </div>
            
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next Step
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}