"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLearningJourney, type JourneyStep } from "@/hooks/useLearningJourney";
import { 
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Clock,
  Lightbulb,
  ArrowRight,
  Target,
  Brain,
  Zap,
  Star,
  Lock,
  Unlock,
  RefreshCw,
  ChevronRight
} from "lucide-react";

// Quiz questions for each step
const QUIZ_QUESTIONS: Record<JourneyStep, {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
} | null> = {
  'welcome': null,
  'text-input': null,
  'tokenization': {
    question: "What happens during tokenization?",
    options: [
      "Text is converted to images",
      "Text is broken into individual words or subwords", 
      "Text is translated to another language",
      "Text is compressed for storage"
    ],
    correctAnswer: 1,
    explanation: "Tokenization breaks text into smaller units (tokens) that the model can process - usually words or subwords.",
    hint: "Think about how you would split a sentence into pieces for analysis."
  },
  'attention-intro': {
    question: "What is the main purpose of attention in transformers?",
    options: [
      "To make the model run faster",
      "To reduce memory usage",
      "To focus on relevant parts of the input when processing each token",
      "To translate between languages"
    ],
    correctAnswer: 2,
    explanation: "Attention allows each token to selectively focus on relevant parts of the input sequence, creating context-aware representations.",
    hint: "Think about how you focus on relevant information when reading."
  },
  'heads-setup': {
    question: "Why do transformers use multiple attention heads?",
    options: [
      "To make computation slower and more careful",
      "To capture different types of relationships simultaneously",
      "To increase the model size",
      "To reduce computational cost"
    ],
    correctAnswer: 1,
    explanation: "Multiple heads allow the model to capture different types of relationships (like syntax, semantics, coreference) in parallel.",
    hint: "Think about having multiple experts analyze the same text from different perspectives."
  },
  'advanced-settings': {
    question: "What does causal masking prevent in decoder models?",
    options: [
      "Processing any tokens at all",
      "Understanding word meanings",
      "Attending to future positions in the sequence",
      "Using multiple attention heads"
    ],
    correctAnswer: 2,
    explanation: "Causal masking prevents tokens from attending to future positions, which is crucial for autoregressive generation tasks.",
    hint: "Think about why a language model shouldn't 'cheat' by looking ahead when generating text."
  },
  'embed': {
    question: "What do positional encodings add to token embeddings?",
    options: [
      "Color information about the text",
      "Information about the order and position of tokens",
      "Translation into other languages", 
      "Pronunciation guides"
    ],
    correctAnswer: 1,
    explanation: "Positional encodings provide information about where each token appears in the sequence, giving the model both meaning and position context.",
    hint: "Word order matters in language - how does the model know which word comes first?"
  },
  'qkv': {
    question: "In the Query-Key-Value system, what does the Query represent?",
    options: [
      "The information a token contains",
      "What information a token is looking for",
      "The position of the token",
      "The original text"
    ],
    correctAnswer: 1,
    explanation: "The Query represents what information a token is seeking - like asking a question or making a search request.",
    hint: "Think about the library analogy - what would your research question be?"
  },
  'scores': {
    question: "What do high attention scores between two tokens indicate?",
    options: [
      "The tokens are identical",
      "The tokens are highly relevant to each other",
      "The tokens should be ignored",
      "The tokens are far apart in the sentence"
    ],
    correctAnswer: 1,
    explanation: "High attention scores indicate that the tokens are highly relevant to each other in the current context - the query token 'pays attention' to the key token.",
    hint: "Think about relevance and similarity in the context of the model's task."
  },
  'softmax': {
    question: "What do softmax attention weights always sum to for each token?",
    options: [
      "0 (zero)",
      "1 (one) or 100%",
      "The number of tokens in the sequence",
      "Infinity"
    ],
    correctAnswer: 1,
    explanation: "Softmax converts scores to probabilities, so each token's attention weights always sum to 1 (representing 100% of its attention budget).",
    hint: "Think about probability distributions and attention as a budget to distribute."
  },
  'weighted': {
    question: "In the weighted sum, tokens with higher attention weights...",
    options: [
      "Contribute less to the final output",
      "Contribute more to the final output",
      "Are completely ignored",
      "Have no effect on the result"
    ],
    correctAnswer: 1,
    explanation: "Higher attention weights mean those tokens contribute MORE to the final representation - they get more 'influence' in the output.",
    hint: "Think about weighted averages - which values have more influence?"
  },
  'mh': {
    question: "How are multiple attention head outputs combined?",
    options: [
      "They are averaged together",
      "Only the best head is kept",
      "They are concatenated and then linearly projected",
      "They are multiplied together"
    ],
    correctAnswer: 2,
    explanation: "Multi-head outputs are concatenated (joined end-to-end) and then passed through a linear projection to create the final output.",
    hint: "Think about combining insights from multiple experts into a final report."
  },
  'complete': null
};

// Interaction requirements for each step
const INTERACTION_REQUIREMENTS: Record<JourneyStep, {
  requirements: Array<{
    id: string;
    description: string;
    check: (state: any) => boolean;
  }>;
} | null> = {
  'welcome': null,
  'text-input': {
    requirements: [
      {
        id: 'enter-text',
        description: 'Enter or modify the text input',
        check: (state) => state.hasEnteredText
      }
    ]
  },
  'tokenization': {
    requirements: [
      {
        id: 'view-tokens',
        description: 'Click on a token to select it',
        check: (state) => state.hasSelectedToken
      }
    ]
  },
  'attention-intro': null,
  'heads-setup': {
    requirements: [
      {
        id: 'explore-heads',
        description: 'Switch between different attention heads',
        check: (state) => state.hasExploredHeads
      }
    ]
  },
  'advanced-settings': {
    requirements: [
      {
        id: 'toggle-settings',
        description: 'Toggle causal mask or positional encodings',
        check: (state) => state.hasToggledSettings
      }
    ]
  },
  'embed': null,
  'qkv': null,
  'scores': null,
  'softmax': null,
  'weighted': null,
  'mh': null,
  'complete': null
};

// Validation gate component
interface ValidationGateProps {
  step: JourneyStep;
  onValidationComplete: () => void;
  className?: string;
}

export function ValidationGate({ step, onValidationComplete, className = "" }: ValidationGateProps) {
  const { 
    learningPath,
    hasEnteredText,
    hasSelectedToken,
    hasExploredHeads,
    hasToggledSettings,
    markInteraction,
    updateQuizScore,
    canProceedToStep
  } = useLearningJourney();

  const [quizState, setQuizState] = useState<{
    selectedAnswer: number | null;
    showResult: boolean;
    attempts: number;
  }>({
    selectedAnswer: null,
    showResult: false,
    attempts: 0
  });

  const quiz = QUIZ_QUESTIONS[step];
  const interactionReqs = INTERACTION_REQUIREMENTS[step];
  
  // For free-explore mode, no validation needed
  if (learningPath === 'free-explore') {
    return null;
  }

  // No validation needed if no quiz or interaction requirements
  if (!quiz && !interactionReqs) {
    return null;
  }

  // Check interaction requirements
  const interactionState = {
    hasEnteredText,
    hasSelectedToken,
    hasExploredHeads,
    hasToggledSettings
  };

  const interactionStatus = interactionReqs?.requirements.map(req => ({
    ...req,
    satisfied: req.check(interactionState)
  })) || [];

  const allInteractionsSatisfied = interactionStatus.every(req => req.satisfied);

  // Quiz handling
  const handleAnswerSelect = (answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showResult: true,
      attempts: prev.attempts + 1
    }));

    if (quiz) {
      const isCorrect = answerIndex === quiz.correctAnswer;
      const score = isCorrect ? 1 : 0;
      updateQuizScore(step, score);
      
      if (isCorrect) {
        markInteraction(step, 'quiz-passed');
        // Small delay before calling validation complete
        setTimeout(() => {
          if (allInteractionsSatisfied || !interactionReqs) {
            onValidationComplete();
          }
        }, 1500);
      }
    }
  };

  const resetQuiz = () => {
    setQuizState({
      selectedAnswer: null,
      showResult: false,
      attempts: quizState.attempts
    });
  };

  const isQuizCorrect = quiz && quizState.selectedAnswer === quiz.correctAnswer;
  const canProceed = (isQuizCorrect || !quiz) && allInteractionsSatisfied;

  return (
    <Card className={`${className} border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
          <Target className="w-5 h-5" />
          Step Validation
          {canProceed ? (
            <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
          ) : (
            <Clock className="w-5 h-5 text-orange-600 ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Interaction Requirements */}
        {interactionReqs && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-700">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Required Interactions:</span>
            </div>
            <div className="space-y-2">
              {interactionStatus.map((req) => (
                <div 
                  key={req.id} 
                  className={`flex items-center gap-3 p-2 rounded ${
                    req.satisfied 
                      ? 'bg-green-100 border border-green-300' 
                      : 'bg-white border border-orange-300'
                  }`}
                >
                  {req.satisfied ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${
                    req.satisfied ? 'text-green-800' : 'text-orange-700'
                  }`}>
                    {req.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {quiz && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-700">
                <Brain className="w-4 h-4" />
                <span className="font-medium">Knowledge Check:</span>
              </div>
              {quizState.attempts > 0 && !isQuizCorrect && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetQuiz}
                  className="text-orange-600 border-orange-300"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Try Again
                </Button>
              )}
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-orange-200">
              <p className="font-medium text-gray-800 mb-3">{quiz.question}</p>
              
              {/* Show hint before first attempt */}
              {quiz.hint && quizState.attempts === 0 && !quizState.showResult && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">{quiz.hint}</p>
                </div>
              )}
              
              <div className="space-y-2">
                {quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !quizState.showResult && handleAnswerSelect(index)}
                    disabled={quizState.showResult}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                      !quizState.showResult
                        ? "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        : index === quiz.correctAnswer
                        ? "border-green-400 bg-green-100 text-green-800"
                        : index === quizState.selectedAnswer
                        ? "border-red-400 bg-red-100 text-red-800"
                        : "border-gray-300 bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {quizState.showResult && index === quiz.correctAnswer && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {quizState.showResult && index === quizState.selectedAnswer && index !== quiz.correctAnswer && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Quiz Result */}
              {quizState.showResult && (
                <div className={`mt-4 p-3 rounded-lg border ${
                  isQuizCorrect 
                    ? "border-green-300 bg-green-50" 
                    : "border-red-300 bg-red-50"
                }`}>
                  <div className="flex items-start gap-2">
                    {isQuizCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`font-medium mb-1 ${
                        isQuizCorrect ? "text-green-800" : "text-red-800"
                      }`}>
                        {isQuizCorrect ? "Correct! Great job! 🎉" : "Not quite right 🤔"}
                      </p>
                      <p className={`text-sm ${
                        isQuizCorrect ? "text-green-700" : "text-red-700"
                      }`}>
                        {quiz.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className={`p-3 rounded-lg border ${
          canProceed 
            ? "border-green-300 bg-green-50" 
            : "border-orange-300 bg-orange-50"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {canProceed ? (
                <>
                  <Unlock className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Ready to Continue!</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Complete Requirements Above</span>
                </>
              )}
            </div>
            
            {canProceed && (
              <Button 
                onClick={onValidationComplete}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Continue
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced quiz component with better UX
interface EnhancedQuizProps {
  step: JourneyStep;
  className?: string;
}

export function EnhancedQuiz({ step, className = "" }: EnhancedQuizProps) {
  const { learningPath, updateQuizScore, markInteraction } = useLearningJourney();
  const [quizState, setQuizState] = useState<{
    selectedAnswer: number | null;
    showResult: boolean;
    showHint: boolean;
    attempts: number;
  }>({
    selectedAnswer: null,
    showResult: false,
    showHint: false,
    attempts: 0
  });

  const quiz = QUIZ_QUESTIONS[step];

  // Don't show for free-explore or if no quiz
  if (learningPath === 'free-explore' || !quiz) {
    return null;
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showResult: true,
      attempts: prev.attempts + 1
    }));

    const isCorrect = answerIndex === quiz.correctAnswer;
    const score = isCorrect ? 1 : Math.max(0, 1 - (quizState.attempts * 0.2)); // Reduced score for multiple attempts
    updateQuizScore(step, score);
    
    if (isCorrect) {
      markInteraction(step, 'quiz-passed');
    }
  };

  const resetQuiz = () => {
    setQuizState(prev => ({
      selectedAnswer: null,
      showResult: false,
      showHint: false,
      attempts: prev.attempts
    }));
  };

  const showHint = () => {
    setQuizState(prev => ({ ...prev, showHint: true }));
  };

  const isCorrect = quizState.selectedAnswer === quiz.correctAnswer;

  return (
    <Card className={`${className} bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-purple-900 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Knowledge Check
          </CardTitle>
          <div className="flex items-center gap-2">
            {quiz.hint && !quizState.showHint && !quizState.showResult && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={showHint}
                className="text-blue-600 border-blue-300"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                Hint
              </Button>
            )}
            {quizState.showResult && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetQuiz}
                className="text-purple-600 border-purple-300"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="font-medium text-gray-800">{quiz.question}</p>
        
        {/* Hint Display */}
        {quiz.hint && quizState.showHint && !quizState.showResult && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-blue-900">Hint:</span>
                <p className="text-sm text-blue-800 mt-1">{quiz.hint}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Answer Options */}
        <div className="space-y-2">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !quizState.showResult && handleAnswerSelect(index)}
              disabled={quizState.showResult}
              className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                !quizState.showResult
                  ? "border-purple-300 hover:bg-purple-50 hover:border-purple-400"
                  : index === quiz.correctAnswer
                  ? "border-green-400 bg-green-100 text-green-800"
                  : index === quizState.selectedAnswer
                  ? "border-red-400 bg-red-100 text-red-800"
                  : "border-gray-300 bg-gray-100 text-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                {quizState.showResult && (
                  <>
                    {index === quiz.correctAnswer && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {index === quizState.selectedAnswer && index !== quiz.correctAnswer && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </>
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Result Display */}
        {quizState.showResult && (
          <div className={`p-3 rounded-lg border ${
            isCorrect 
              ? "border-green-300 bg-green-50" 
              : "border-red-300 bg-red-50"
          }`}>
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className={`font-medium mb-1 ${
                  isCorrect ? "text-green-800" : "text-red-800"
                }`}>
                  {isCorrect 
                    ? `Excellent! ${quizState.attempts === 1 ? "Perfect on first try! 🎉" : "You got it! 👍"}` 
                    : "Not quite right. Try again! 🤔"
                  }
                </p>
                <p className={`text-sm ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}>
                  {quiz.explanation}
                </p>
                
                {/* Attempts counter */}
                {quizState.attempts > 1 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Attempts: {quizState.attempts}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}