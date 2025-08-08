"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, RotateCcw, ChevronRight, HelpCircle, CheckCircle, Sparkles, Scissors, Zap, Target, ChevronLeft } from 'lucide-react';

interface Token {
  id: string;
  text: string;
  position: number;
  isHighlighted: boolean;
  animationDelay: number;
}

interface TokenizationTutorialProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function TokenizationTutorial({ onComplete, onSkip }: TokenizationTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputText, setInputText] = useState("The cat sat on the mat");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);
  const [userAnswered, setUserAnswered] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  
  const textRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: "What is Tokenization?",
      description: "Tokenization breaks text into smaller units (tokens) that AI models can process.",
      action: "Click 'Start Animation' to see how text becomes tokens!"
    },
    {
      title: "Interactive Token Exploration",
      description: "Each token represents a meaningful unit. Click on tokens to learn more!",
      action: "Click on different tokens to see their properties"
    },
    {
      title: "Why Tokenization Matters",
      description: "Understanding why tokenization is crucial for language models",
      action: "Complete the mini-activity below"
    }
  ];

  const tokenExplanations = {
    "The": "Definite article - helps specify which item we're talking about",
    "cat": "Noun - the subject of our sentence, a common animal",
    "sat": "Verb (past tense) - describes the action performed",
    "on": "Preposition - shows the relationship between 'cat' and 'mat'",
    "the": "Definite article - specifies which mat",
    "mat": "Noun - the object the cat is sitting on"
  };

  const animateTokenization = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTokens([]);
    setSelectedToken(null);
    
    const words = inputText.trim().split(/\s+/);
    const newTokens: Token[] = [];
    
    // Animate each word appearing as a token
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const token: Token = {
        id: `token-${i}`,
        text: words[i],
        position: i,
        isHighlighted: false,
        animationDelay: i * 100
      };
      
      newTokens.push(token);
      setTokens([...newTokens]);
    }
    
    setIsAnimating(false);
    if (currentStep === 0) {
      setCurrentStep(1);
      setCompletedActivities(prev => new Set(prev).add(0));
    }
  };

  const handleTokenClick = (tokenId: string) => {
    if (currentStep < 1) return;
    
    setSelectedToken(tokenId);
    setShowExplanations(true);
    
    if (currentStep === 1 && !userAnswered) {
      setUserAnswered(true);
      setCompletedActivities(prev => new Set(prev).add(1));
    }
  };

  const resetAnimation = () => {
    setTokens([]);
    setSelectedToken(null);
    setShowExplanations(false);
    setIsAnimating(false);
  };

  const ActivitySection = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = [
      {
        question: "Why is tokenization important for language models?",
        options: [
          "To make text colorful",
          "To convert text into numbers that models can process", 
          "To make text shorter",
          "To translate text"
        ],
        correctAnswer: 1,
        explanation: "Tokenization converts text into numerical representations that language models can understand and process. It's the first crucial step in making text \"speak\" to AI!"
      },
      {
        question: "What happens if we don't use tokenization?",
        options: [
          "The model works faster",
          "The model can't process the text at all",
          "The text becomes more accurate",
          "Nothing changes"
        ],
        correctAnswer: 1,
        explanation: "Without tokenization, AI models have no way to understand text. They can only work with numbers, so tokenization is the essential bridge between human language and machine computation."
      },
      {
        question: "In our example 'The cat sat', which would be token #1?",
        options: [
          "The",
          "cat", 
          "sat",
          "It depends on the sentence"
        ],
        correctAnswer: 1,
        explanation: "Tokens are numbered starting from 0, so 'The' is token #0, 'cat' is token #1, and 'sat' is token #2. The position numbering helps the model understand word order."
      }
    ];

    const currentQ = questions[currentQuestion];

    const handleAnswer = (index: number) => {
      setSelectedAnswer(currentQ.options[index]);
      setShowResult(true);
      if (index === currentQ.correctAnswer) {
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            // Move to next question after a delay
            setTimeout(() => {
              setCurrentQuestion(currentQuestion + 1);
              setSelectedAnswer(null);
              setShowResult(false);
            }, 2000);
          } else {
            // All questions completed
            setCompletedActivities(prev => new Set(prev).add(2));
          }
        }, 1000);
      }
    };

    const resetQuiz = () => {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
    };

    if (currentStep < 2) return null;

    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            Understanding Check ({currentQuestion + 1}/{questions.length})
          </CardTitle>
          {currentQuestion > 0 && (
            <Button variant="ghost" size="sm" onClick={resetQuiz} className="ml-auto text-purple-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Quiz
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm font-medium text-purple-900">{currentQ.question}</div>
          
          <div className="grid gap-2">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`text-left p-3 rounded-lg border transition-all ${
                  showResult
                    ? index === currentQ.correctAnswer
                      ? "bg-green-100 border-green-400 text-green-800"
                      : selectedAnswer === option
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-50 border-gray-300 text-gray-600"
                    : "bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {showResult && index === currentQ.correctAnswer && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          {showResult && (
            <div className={`p-3 rounded-lg ${
              selectedAnswer === currentQ.options[currentQ.correctAnswer] 
                ? "bg-green-50 border border-green-200" 
                : "bg-blue-50 border border-blue-200"
            }`}>
              <div className={`text-sm font-medium ${
                selectedAnswer === currentQ.options[currentQ.correctAnswer] ? "text-green-800" : "text-blue-800"
              }`}>
                {selectedAnswer === currentQ.options[currentQ.correctAnswer] 
                  ? currentQuestion < questions.length - 1 ? "Correct! Next question coming up..." : "Correct! Quiz completed! 🎉"
                  : "Good try! Here's why:"
                }
              </div>
              <div className={`text-sm mt-1 ${
                selectedAnswer === currentQ.options[currentQ.correctAnswer] ? "text-green-700" : "text-blue-700"
              }`}>
                {currentQ.explanation}
              </div>
              {!selectedAnswer === currentQ.options[currentQ.correctAnswer] && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedAnswer(null);
                    setShowResult(false);
                  }}
                  className="mt-2"
                >
                  Try Again
                </Button>
              )}
            </div>
          )}
          
          {/* Progress indicator for quiz */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {questions.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index < currentQuestion ? "bg-green-500" :
                  index === currentQuestion ? "bg-purple-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const TokenComparison = () => {
    const [comparisonTexts, setComparisonTexts] = useState([
      "The cat sat",
      "A dog ran"
    ]);
    const [showComparison, setShowComparison] = useState(false);

    if (currentStep < 1) return null;

    const getTokensForText = (text: string) => {
      return text.trim().split(/\s+/).map((word, index) => ({
        id: `comp-${index}`,
        text: word,
        position: index,
        isHighlighted: false,
        animationDelay: index * 100
      }));
    };

    const handleComparisonToggle = () => {
      setShowComparison(!showComparison);
    };

    if (!showComparison) {
      return (
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Compare Different Sentences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-orange-700 mb-4">
              See how different sentences create different token patterns!
            </div>
            <Button onClick={handleComparisonToggle} className="bg-orange-600 hover:bg-orange-700">
              <Zap className="w-4 h-4 mr-2" />
              Start Comparison
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Token Comparison Lab
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {comparisonTexts.map((text, index) => {
              const compTokens = getTokensForText(text);
              return (
                <div key={index} className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-orange-900">
                      Sentence {index + 1}:
                    </label>
                    <Input
                      value={text}
                      onChange={(e) => {
                        const newTexts = [...comparisonTexts];
                        newTexts[index] = e.target.value;
                        setComparisonTexts(newTexts);
                      }}
                      className="mt-1"
                      placeholder="Type a sentence..."
                    />
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-sm font-medium mb-2">Tokens ({compTokens.length}):</div>
                    <div className="flex flex-wrap gap-2">
                      {compTokens.map((token, tokenIndex) => (
                        <div
                          key={token.id}
                          className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg border border-orange-300 text-sm font-mono"
                        >
                          <span className="opacity-70 mr-1">#{tokenIndex}</span>
                          {token.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-orange-900 mb-2">Comparison Insights:</div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Token Count:</strong>
                <ul className="mt-1 space-y-1 text-gray-700">
                  {comparisonTexts.map((text, index) => (
                    <li key={index}>
                      Sentence {index + 1}: {getTokensForText(text).length} tokens
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Observations:</strong>
                <ul className="mt-1 space-y-1 text-gray-700">
                  <li>• Each word becomes exactly one token</li>
                  <li>• Token numbering starts from 0</li>
                  <li>• Different sentences = different token patterns</li>
                  <li>• Spacing doesn't create tokens</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleComparisonToggle}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Close Comparison
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const canAdvance = completedActivities.size > currentStep || currentStep >= steps.length - 1;
  const allActivitiesComplete = completedActivities.size >= steps.length;

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Scissors className="w-6 h-6 text-blue-600" />
                  Tokenization Tutorial
                </CardTitle>
                <p className="text-sm text-blue-700 mt-2">
                  Learn how text becomes tokens that AI can understand
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onSkip}>
                  Skip Tutorial
                </Button>
                {allActivitiesComplete && (
                  <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                completedActivities.has(index)
                  ? "bg-green-500 text-white"
                  : currentStep === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {completedActivities.has(index) ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 transition-all ${
                  completedActivities.has(index) ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Your Task:</span>
              </div>
              <p className="text-sm text-blue-800 mt-1">{steps[currentStep].action}</p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactive Tokenization Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Controls */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Try your own text:</label>
              <div className="flex gap-2">
                <Input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a sentence to tokenize..."
                  className="flex-1"
                  maxLength={100}
                />
                <Button 
                  onClick={animateTokenization}
                  disabled={isAnimating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isAnimating ? "Tokenizing..." : "Start Animation"}
                </Button>
                <Button variant="outline" onClick={resetAnimation}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Original Text Display */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Original Text:</div>
              <div 
                ref={textRef}
                className="p-4 bg-gray-50 rounded-lg border text-lg font-mono"
              >
                {inputText}
              </div>
            </div>

            {/* Animated Tokens */}
            {tokens.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Tokens Generated:</div>
                  <div className="text-xs text-muted-foreground">
                    ({tokens.length} tokens) - Click on tokens to explore!
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                  {tokens.map((token, index) => (
                    <Tooltip key={token.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleTokenClick(token.id)}
                          className={`px-3 py-2 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                            selectedToken === token.id
                              ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                              : "bg-white border-green-300 hover:border-green-400 hover:bg-green-100"
                          }`}
                          style={{
                            animation: `fadeInUp 0.5s ease-out ${token.animationDelay}ms`
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-70">#{index}</span>
                            <span className="font-mono">{token.text}</span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div className="font-semibold">Token #{index}</div>
                          <div>Text: "{token.text}"</div>
                          <div>Position: {index}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Click to explore this token!
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}

            {/* Token Explanation Panel */}
            {showExplanations && selectedToken && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-yellow-600" />
                    Token Deep Dive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const token = tokens.find(t => t.id === selectedToken);
                    if (!token) return null;
                    
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-2 bg-white rounded-lg border-2 border-yellow-300 font-mono text-lg">
                            {token.text}
                          </div>
                          <div className="text-sm text-yellow-700">
                            Token #{token.position}
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-yellow-900 mb-2">Token Properties:</div>
                            <ul className="text-sm text-yellow-800 space-y-1">
                              <li>• <strong>Text:</strong> "{token.text}"</li>
                              <li>• <strong>Length:</strong> {token.text.length} characters</li>
                              <li>• <strong>Position:</strong> {token.position} (zero-indexed)</li>
                              <li>• <strong>Type:</strong> {/^[A-Z]/.test(token.text) ? "Capitalized" : "Lowercase"}</li>
                            </ul>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-yellow-900 mb-2">Linguistic Role:</div>
                            <div className="text-sm text-yellow-800">
                              {tokenExplanations[token.text] || 
                               tokenExplanations[token.text.toLowerCase()] ||
                               "This token represents a unique word or punctuation mark in the sentence."}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-sm font-medium mb-1">💡 Why This Matters:</div>
                          <div className="text-sm text-gray-700">
                            Each token becomes a vector of numbers that the AI model processes. The model learns patterns and relationships between these tokens to understand language!
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Token Comparison Lab */}
        <TokenComparison />

        {/* Activity Section */}
        <ActivitySection />

        {/* Key Insights Panel */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              Key Insights About Tokenization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <div>
                    <div className="font-medium text-sm">Tokens are the AI's vocabulary</div>
                    <div className="text-xs text-muted-foreground">Each token represents one "word" the model understands</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <div>
                    <div className="font-medium text-sm">Position matters</div>
                    <div className="text-xs text-muted-foreground">The order of tokens affects meaning ("cat sat" vs "sat cat")</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <div>
                    <div className="font-medium text-sm">Context is everything</div>
                    <div className="text-xs text-muted-foreground">Same token can mean different things in different contexts</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm font-medium mb-2">🎯 What's Next?</div>
                <div className="text-sm text-gray-700">
                  Now that you understand how text becomes tokens, you're ready to learn how the <strong>attention mechanism</strong> helps tokens "talk" to each other to understand context and relationships!
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </TooltipProvider>
  );
}