"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Lightbulb, ChevronRight, CheckCircle, Sparkles, Zap, Target, AlertTriangle, RefreshCw, Play, HelpCircle, Brain, MousePointer } from 'lucide-react';
import { EDUCATIONAL_CONTENT, getAnalogy, detectCommonMistake, ENGAGEMENT_ELEMENTS, type CommonConfusion } from '@/lib/educational-content';

interface WordPair {
  word1: string;
  word2: string;
  relationship: string;
  strength: number;
  explanation: string;
}

interface AttentionConceptTutorialProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function AttentionConceptTutorial({ onComplete, onSkip }: AttentionConceptTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPair, setSelectedPair] = useState<WordPair | null>(null);
  const [interactedPairs, setInteractedPairs] = useState<Set<string>>(new Set());
  const [currentMetaphor, setCurrentMetaphor] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  const [spotlightWord, setSpotlightWord] = useState<string | null>(null);
  const [showMisconception, setShowMisconception] = useState<CommonConfusion | null>(null);
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);

  const sentence = "The cat sat on the mat";
  const words = sentence.split(" ");

  const wordPairs: WordPair[] = [
    {
      word1: "cat", word2: "sat", 
      relationship: "Subject-Verb", 
      strength: 0.9,
      explanation: "Strong relationship: 'cat' is performing the action 'sat'"
    },
    {
      word1: "cat", word2: "mat", 
      relationship: "Subject-Location", 
      strength: 0.7,
      explanation: "Moderate relationship: the cat's location is the mat"
    },
    {
      word1: "sat", word2: "on", 
      relationship: "Verb-Preposition", 
      strength: 0.8,
      explanation: "Strong relationship: 'on' describes how the sitting happens"
    },
    {
      word1: "on", word2: "mat", 
      relationship: "Preposition-Object", 
      strength: 0.9,
      explanation: "Very strong relationship: 'on' directly connects to 'mat'"
    },
    {
      word1: "The", word2: "cat", 
      relationship: "Article-Noun", 
      strength: 0.6,
      explanation: "Moderate relationship: 'The' specifies which cat"
    },
    {
      word1: "the", word2: "mat", 
      relationship: "Article-Noun", 
      strength: 0.6,
      explanation: "Moderate relationship: 'the' specifies which mat"
    }
  ];

  const availableMetaphors = ['spotlight', 'library', 'restaurant'];
  const metaphors = availableMetaphors.map(key => {
    const analogy = getAnalogy(key as keyof typeof EDUCATIONAL_CONTENT.analogies);
    return {
      title: analogy.title,
      description: analogy.overview,
      visual: key,
      explanation: analogy.detailedScenarios[0]?.description || analogy.overview
    };
  });

  const steps = [
    {
      title: "Understanding Attention",
      description: "Learn what attention means in the context of language models",
      action: "Explore the visual metaphors below to build intuition"
    },
    {
      title: "Interactive Word Relationships", 
      description: "See how words in a sentence relate to each other",
      action: "Click on word pairs to explore their relationships"
    },
    {
      title: "Attention in Action",
      description: "Experience how attention focuses on relevant information",
      action: "Use the spotlight tool to see attention patterns"
    }
  ];

  const handlePairClick = (pair: WordPair) => {
    setSelectedPair(pair);
    const pairKey = `${pair.word1}-${pair.word2}`;
    setInteractedPairs(prev => new Set(prev).add(pairKey));
    
    // Check for misconceptions in user interaction pattern
    const misconceptionCheck = detectCommonMistake(
      `clicked ${pair.word1} ${pair.word2} relationship`, 
      'relationships'
    );
    
    if (misconceptionCheck && Math.random() < 0.3) { // 30% chance to show educational tip
      setShowMisconception(misconceptionCheck);
    }
    
    if (currentStep === 1 && !completedActivities.has(1)) {
      if (interactedPairs.size >= 2) { // Need to click at least 3 pairs
        setCompletedActivities(prev => new Set(prev).add(1));
        // Show encouragement
        setShowEncouragement(true);
        setTimeout(() => setShowEncouragement(false), 4000);
      }
    }
  };

  const handleSpotlightClick = (word: string) => {
    setSpotlightWord(word);
    if (currentStep === 2 && !completedActivities.has(2)) {
      setCompletedActivities(prev => new Set(prev).add(2));
    }
  };

  const InteractiveDemo = () => {
    const [demoMode, setDemoMode] = useState<'spotlight' | 'pairs' | 'sequence'>('spotlight');
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState(0);

    const runSequentialDemo = async () => {
      setIsAnimating(true);
      const demoSequence = [
        { word: 'The', delay: 500 },
        { word: 'cat', delay: 800 },
        { word: 'sat', delay: 800 },
        { word: 'on', delay: 600 },
        { word: 'the', delay: 500 },
        { word: 'mat', delay: 800 }
      ];

      for (let i = 0; i < demoSequence.length; i++) {
        setCurrentAnimation(i);
        setSpotlightWord(demoSequence[i].word);
        await new Promise(resolve => setTimeout(resolve, demoSequence[i].delay));
      }
      
      setIsAnimating(false);
      setCurrentAnimation(0);
    };

    if (currentStep < 2) return null;

    const getAttentionStrength = (targetWord: string) => {
      if (!spotlightWord) return 0;
      const pair = wordPairs.find(p => 
        (p.word1.toLowerCase() === spotlightWord.toLowerCase() && p.word2.toLowerCase() === targetWord.toLowerCase()) ||
        (p.word2.toLowerCase() === spotlightWord.toLowerCase() && p.word1.toLowerCase() === targetWord.toLowerCase())
      );
      return pair ? pair.strength : targetWord.toLowerCase() === spotlightWord.toLowerCase() ? 1 : 0.1;
    };

    return (
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Interactive Attention Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Mode Selector */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-purple-900">Demo Mode:</span>
            <div className="flex gap-1">
              {[
                { mode: 'spotlight', label: 'Spotlight', icon: '🔦' },
                { mode: 'pairs', label: 'Word Pairs', icon: '🔗' },
                { mode: 'sequence', label: 'Sequential', icon: '▶️' }
              ].map(({ mode, label, icon }) => (
                <button
                  key={mode}
                  onClick={() => setDemoMode(mode as any)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    demoMode === mode
                      ? 'bg-purple-200 text-purple-900 border-purple-300'
                      : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
                  } border`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Spotlight Mode */}
          {demoMode === 'spotlight' && (
            <div className="space-y-4">
              <div className="text-sm text-purple-700">
                Click on any word to see how attention focuses on different parts of the sentence:
              </div>
              
              <div className="flex flex-wrap gap-3 p-6 bg-black rounded-lg relative overflow-hidden">
                {words.map((word, index) => {
                  const strength = getAttentionStrength(word);
                  const isSpotlit = word.toLowerCase() === spotlightWord?.toLowerCase();
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSpotlightClick(word)}
                      className={`px-4 py-2 rounded-lg transition-all duration-500 transform hover:scale-105 ${
                        isSpotlit 
                          ? "bg-yellow-300 text-black shadow-2xl shadow-yellow-300/50 scale-110" 
                          : "text-white hover:bg-white/10"
                      }`}
                      style={{
                        backgroundColor: isSpotlit ? '#fef08a' : `rgba(255, 255, 255, ${strength})`,
                        boxShadow: isSpotlit 
                          ? '0 0 30px rgba(254, 240, 138, 0.8), 0 0 60px rgba(254, 240, 138, 0.4)'
                          : `0 0 ${strength * 20}px rgba(255, 255, 255, ${strength * 0.5})`,
                        color: isSpotlit ? 'black' : strength > 0.5 ? 'black' : 'white'
                      }}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Word Pairs Mode */}
          {demoMode === 'pairs' && (
            <div className="space-y-4">
              <div className="text-sm text-purple-700">
                See how different word pairs connect with each other:
              </div>
              
              <div className="grid gap-2">
                {wordPairs.slice(0, 4).map((pair, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSpotlightWord(pair.word1);
                      handlePairClick(pair);
                    }}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-purple-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono bg-purple-100 px-2 py-1 rounded text-sm">
                        {pair.word1}
                      </span>
                      <div className="text-purple-600">
                        {"↔".repeat(Math.ceil(pair.strength * 3))}
                      </div>
                      <span className="font-mono bg-purple-100 px-2 py-1 rounded text-sm">
                        {pair.word2}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {Math.round(pair.strength * 100)}%
                      </div>
                      <div className="text-xs text-purple-600">
                        {pair.relationship}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sequential Mode */}
          {demoMode === 'sequence' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-purple-700">
                  Watch how attention flows through the sentence sequentially:
                </div>
                <Button 
                  onClick={runSequentialDemo}
                  disabled={isAnimating}
                  className="bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isAnimating ? 'Playing...' : 'Play Demo'}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-3 p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
                {words.map((word, index) => {
                  const isCurrentlyFocused = isAnimating && currentAnimation === index;
                  const strength = getAttentionStrength(word);
                  const isSpotlit = word.toLowerCase() === spotlightWord?.toLowerCase();
                  
                  return (
                    <div
                      key={index}
                      className={`px-4 py-2 rounded-lg transition-all duration-500 transform ${
                        isCurrentlyFocused 
                          ? "bg-yellow-300 text-black shadow-2xl shadow-yellow-300/50 scale-110 animate-pulse" 
                          : isSpotlit
                          ? "bg-yellow-200 text-black"
                          : "text-white"
                      }`}
                      style={{
                        backgroundColor: isCurrentlyFocused ? '#fef08a' : 
                                        isSpotlit ? 'rgba(254, 240, 138, 0.7)' : 
                                        `rgba(255, 255, 255, ${strength})`,
                        boxShadow: isCurrentlyFocused 
                          ? '0 0 30px rgba(254, 240, 138, 0.8)' 
                          : 'none'
                      }}
                    >
                      {word}
                    </div>
                  );
                })}
              </div>
              
              {isAnimating && (
                <div className="text-center">
                  <div className="text-sm text-purple-700">
                    Currently focusing on: <strong>{spotlightWord}</strong>
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Step {currentAnimation + 1} of {words.length}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {spotlightWord && (
            <div className="bg-white p-3 rounded-lg border">
              <div className="text-sm font-medium mb-1">
                Attention from "<span className="text-purple-600">{spotlightWord}</span>"
              </div>
              <div className="text-sm text-gray-600">
                {demoMode === 'spotlight' && "Brighter words have stronger attention connections. Notice how related words \"light up\" more!"}
                {demoMode === 'pairs' && "This shows how different word pairs have different relationship strengths."}
                {demoMode === 'sequence' && "Each word in sequence shows its attention pattern to other words."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const MetaphorSection = () => {
    const metaphor = metaphors[currentMetaphor];
    
    return (
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-600" />
              Visual Metaphors
            </CardTitle>
            <div className="flex gap-1">
              {metaphors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMetaphor(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentMetaphor ? "bg-green-600" : "bg-green-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl mb-2">{metaphor.title}</div>
            <div className="text-sm text-green-700">{metaphor.description}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm text-green-800">{metaphor.explanation}</div>
          </div>
          
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentMetaphor((prev) => (prev - 1 + metaphors.length) % metaphors.length)}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentMetaphor((prev) => (prev + 1) % metaphors.length)}
            >
              Next
            </Button>
          </div>
          
          {currentStep === 0 && currentMetaphor === metaphors.length - 1 && (
            <div className="text-center">
              <Button 
                onClick={() => {
                  setCompletedActivities(prev => new Set(prev).add(0));
                  setCurrentStep(1);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                I understand these metaphors! <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const WordRelationshipsSection = () => {
    if (currentStep < 1) return null;
    
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Interactive Word Relationships
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-orange-700">
            Click on the connections below to see how words relate to each other:
          </div>
          
          <div className="space-y-2">
            {wordPairs.map((pair, index) => {
              const pairKey = `${pair.word1}-${pair.word2}`;
              const isSelected = selectedPair === pair;
              const hasInteracted = interactedPairs.has(pairKey);
              
              return (
                <button
                  key={index}
                  onClick={() => handlePairClick(pair)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-orange-100 border-orange-400"
                      : hasInteracted
                      ? "bg-green-50 border-green-300"
                      : "bg-white hover:bg-orange-50 border-orange-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded text-sm">
                          {pair.word1}
                        </span>
                        <div className="text-orange-600">
                          {"↔".repeat(Math.ceil(pair.strength * 3))}
                        </div>
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded text-sm">
                          {pair.word2}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pair.relationship}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {Math.round(pair.strength * 100)}%
                      </div>
                      {hasInteracted && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {selectedPair && (
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm font-medium mb-2">
                Relationship Explanation:
              </div>
              <div className="text-sm text-gray-700">
                {selectedPair.explanation}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Attention Strength: {Math.round(selectedPair.strength * 100)}% - 
                {selectedPair.strength > 0.8 ? " Very Strong" : 
                 selectedPair.strength > 0.6 ? " Strong" : " Moderate"}
              </div>
            </div>
          )}
          
          <div className="text-sm text-orange-700">
            Explored {interactedPairs.size} of {wordPairs.length} relationships
            {interactedPairs.size >= 3 && currentStep === 1 && (
              <div className="mt-2">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Ready for the spotlight demo! <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const allActivitiesComplete = completedActivities.size >= steps.length;

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Eye className="w-6 h-6 text-indigo-600" />
                  Attention Concept Tutorial
                </CardTitle>
                <p className="text-sm text-indigo-700 mt-2">
                  Discover how AI models focus on relevant information
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
                  ? "bg-indigo-500 text-white"
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
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">Your Task:</span>
              </div>
              <p className="text-sm text-indigo-800 mt-1">{steps[currentStep].action}</p>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <MetaphorSection />
        <WordRelationshipsSection />
        <InteractiveDemo />

        {/* Key Concepts Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Key Concepts About Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <div>
                    <div className="font-medium text-sm">Selective Focus</div>
                    <div className="text-xs text-muted-foreground">Attention allows models to focus on relevant words while ignoring irrelevant ones</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <div>
                    <div className="font-medium text-sm">Dynamic Relationships</div>
                    <div className="text-xs text-muted-foreground">Different words have different strength connections based on linguistic relationships</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <div>
                    <div className="font-medium text-sm">Context-Aware Processing</div>
                    <div className="text-xs text-muted-foreground">Each word's meaning is influenced by its relationships with all other words</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm font-medium mb-2">🎯 What's Next?</div>
                <div className="text-sm text-gray-700">
                  Now that you understand the concept of attention, you're ready to learn about the <strong>Query, Key, Value</strong> mechanism - the mathematical foundation that makes attention work!
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Encouragement Messages */}
        {showEncouragement && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-lg mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  {ENGAGEMENT_ELEMENTS.celebratory_messages[encouragementIndex]}
                </div>
                <div className="text-sm text-green-700">
                  {ENGAGEMENT_ELEMENTS.curiosity_sparkers[encouragementIndex % ENGAGEMENT_ELEMENTS.curiosity_sparkers.length]}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => {
                    setEncouragementIndex((prev) => (prev + 1) % ENGAGEMENT_ELEMENTS.celebratory_messages.length);
                  }}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  More Fun Facts
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common Misconception Alert */}
        {showMisconception && (
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Learning Tip: Common Misconception
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                  <div className="font-medium text-sm text-red-800 mb-1">❌ Many people think:</div>
                  <div className="text-sm text-red-700">{showMisconception.misconception}</div>
                </div>
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                  <div className="font-medium text-sm text-green-800 mb-1">✅ But actually:</div>
                  <div className="text-sm text-green-700">{showMisconception.reality}</div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded border">
                <div className="font-medium text-sm text-blue-800 mb-1">💡 Explanation:</div>
                <div className="text-sm text-blue-700">{showMisconception.explanation}</div>
              </div>
              {showMisconception.analogy && (
                <div className="bg-purple-50 p-3 rounded border">
                  <div className="font-medium text-sm text-purple-800 mb-1">🎯 Think of it like this:</div>
                  <div className="text-sm text-purple-700 italic">{showMisconception.analogy}</div>
                </div>
              )}
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowMisconception(null)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Thanks for the clarification!
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Big Picture Context */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              The Bigger Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-indigo-700 mb-4">
              {EDUCATIONAL_CONTENT.bigPicture.whyAttentionMatters.split('\n')[0]}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {EDUCATIONAL_CONTENT.bigPicture.realWorldExamples.slice(0, 3).map((example, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="font-medium text-sm text-indigo-800 mb-1">{example.domain}</div>
                  <div className="text-xs text-gray-600">{example.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}