"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Shuffle,
  ArrowRight,
  Lightbulb,
  Zap,
  Eye,
  Target,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  instruction: string;
  expectedOutcome: string;
  interactionType: 'click' | 'drag' | 'observe' | 'compare';
}

interface WordOrderDemoProps {
  initialSentence?: string;
  onSentenceChange?: (sentence: string) => void;
  onComplete?: (insights: string[]) => void;
}

export function WordOrderDemo({ 
  initialSentence = "The cat sat on the mat",
  onSentenceChange,
  onComplete
}: WordOrderDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [originalSentence] = useState(initialSentence);
  const [currentSentence, setCurrentSentence] = useState(initialSentence);
  const [attentionWeights, setAttentionWeights] = useState<number[][]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [draggedWord, setDraggedWord] = useState<number | null>(null);
  const [autoplaySpeed, setAutoplaySpeed] = useState([1500]);

  const words = currentSentence.split(' ');
  const originalWords = originalSentence.split(' ');

  const demoSteps: DemoStep[] = [
    {
      id: 'intro',
      title: 'Word Order Matters',
      description: 'Discover how attention changes when word order changes',
      instruction: 'Click "Start Demo" to see how transformers pay attention to different word positions',
      expectedOutcome: 'Understanding that attention patterns are sensitive to word order',
      interactionType: 'click'
    },
    {
      id: 'original',
      title: 'Original Sentence',
      description: 'Observe the attention pattern for the original sentence',
      instruction: 'Watch how words attend to each other in the original order',
      expectedOutcome: 'See baseline attention patterns',
      interactionType: 'observe'
    },
    {
      id: 'shuffle',
      title: 'Shuffle Words',
      description: 'Change word order and see how attention adapts',
      instruction: 'Click "Shuffle" or drag words to reorder them',
      expectedOutcome: 'Notice how attention weights change with new positions',
      interactionType: 'drag'
    },
    {
      id: 'compare',
      title: 'Compare Patterns',
      description: 'See side-by-side comparison of attention patterns',
      instruction: 'Observe the differences between original and shuffled versions',
      expectedOutcome: 'Understand the impact of word order on transformer attention',
      interactionType: 'compare'
    },
    {
      id: 'insights',
      title: 'Key Insights',
      description: 'Learn what these patterns tell us about transformers',
      instruction: 'Read through the discovered insights',
      expectedOutcome: 'Comprehensive understanding of positional sensitivity',
      interactionType: 'observe'
    }
  ];

  // Generate mock attention weights based on word positions
  const generateAttentionWeights = (sentence: string): number[][] => {
    const sentenceWords = sentence.split(' ');
    const numWords = sentenceWords.length;
    const weights: number[][] = [];

    for (let i = 0; i < numWords; i++) {
      const row: number[] = [];
      for (let j = 0; j < numWords; j++) {
        // Simulate attention patterns - higher attention to nearby words and self-attention
        let weight = 0.1 + Math.random() * 0.2; // Base attention
        
        if (i === j) {
          weight += 0.3; // Self-attention
        } else {
          const distance = Math.abs(i - j);
          weight += Math.max(0, 0.5 - distance * 0.1); // Distance-based attention
        }
        
        // Add some word-specific patterns
        if (sentenceWords[i] === 'The' && sentenceWords[j] === 'cat') weight += 0.2;
        if (sentenceWords[i] === 'cat' && sentenceWords[j] === 'sat') weight += 0.3;
        if (sentenceWords[i] === 'on' && sentenceWords[j] === 'mat') weight += 0.25;
        
        row.push(Math.min(weight, 1.0));
      }
      weights.push(row);
    }

    return weights;
  };

  // Auto-advance demo
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        
        // Auto-shuffle at shuffle step
        if (demoSteps[currentStep + 1]?.id === 'shuffle') {
          shuffleSentence();
        }
      } else {
        setIsPlaying(false);
        onComplete?.(insights);
      }
    }, autoplaySpeed[0]);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, autoplaySpeed, insights, onComplete]);

  // Update attention weights when sentence changes
  useEffect(() => {
    setAttentionWeights(generateAttentionWeights(currentSentence));
    onSentenceChange?.(currentSentence);

    // Generate insights when sentence changes
    if (currentSentence !== originalSentence) {
      const newInsights = [
        "Attention patterns change when word order changes",
        "Positional relationships affect semantic understanding",
        "Transformers learn position-dependent patterns",
        "Word proximity influences attention strength"
      ];
      setInsights(newInsights);
    }
  }, [currentSentence, originalSentence, onSentenceChange]);

  const shuffleSentence = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setCurrentSentence(shuffled.join(' '));
  };

  const resetSentence = () => {
    setCurrentSentence(originalSentence);
    setInsights([]);
  };

  const handleDragStart = (index: number) => {
    setDraggedWord(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedWord === null) return;
    
    const newWords = [...words];
    const [draggedItem] = newWords.splice(draggedWord, 1);
    newWords.splice(targetIndex, 0, draggedItem);
    
    setCurrentSentence(newWords.join(' '));
    setDraggedWord(null);
  };

  const AttentionMatrix = ({ weights, title }: { weights: number[][]; title: string }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${words.length}, 1fr)` }}>
        {weights.flat().map((weight, idx) => {
          const row = Math.floor(idx / words.length);
          const col = idx % words.length;
          const intensity = weight;
          
          return (
            <div
              key={idx}
              className="relative aspect-square rounded border"
              style={{
                backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                minWidth: '24px',
                minHeight: '24px'
              }}
              title={`${words[row]} → ${words[col]}: ${(weight * 100).toFixed(1)}%`}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white mix-blend-difference">
                {Math.round(weight * 100)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Attending from (rows)</span>
        <span>Attending to (columns)</span>
      </div>
    </div>
  );

  const WordToken = ({ word, index, isDraggable = false }: { 
    word: string; 
    index: number; 
    isDraggable?: boolean;
  }) => (
    <div
      draggable={isDraggable}
      onDragStart={() => handleDragStart(index)}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(index)}
      className={`
        inline-flex items-center px-3 py-2 rounded-lg border-2 transition-all duration-200
        ${isDraggable 
          ? 'cursor-move hover:shadow-md border-blue-300 bg-blue-50' 
          : 'border-gray-300 bg-gray-50'
        }
        ${draggedWord === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      <span className="text-sm font-medium">{word}</span>
      <Badge variant="secondary" className="ml-2 text-xs">
        {index}
      </Badge>
    </div>
  );

  const currentStepData = demoSteps[currentStep];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Interactive Demo: {currentStepData.title}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentStep(0);
                resetSentence();
                setIsPlaying(false);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Step {currentStep + 1} of {demoSteps.length}</span>
          <span>{Math.round(((currentStep + 1) / demoSteps.length) * 100)}% complete</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Step Instructions */}
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800">Current Task</span>
          </div>
          <p className="text-sm text-purple-700 mb-2">
            {currentStepData.instruction}
          </p>
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <Lightbulb className="w-3 h-3" />
            Expected: {currentStepData.expectedOutcome}
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Button
              onClick={shuffleSentence}
              variant="outline"
              size="sm"
              disabled={currentStep < 2}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle Words
            </Button>
            
            <Button
              onClick={resetSentence}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              variant="outline"
              size="sm"
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setCurrentStep(Math.min(demoSteps.length - 1, currentStep + 1))}
              variant="outline"
              size="sm"
              disabled={currentStep === demoSteps.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Interactive Sentence */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Interactive Sentence
          </h3>
          
          <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg min-h-24">
            <div className="flex flex-wrap gap-3 items-center justify-center">
              {words.map((word, index) => (
                <WordToken
                  key={`${word}-${index}`}
                  word={word}
                  index={index}
                  isDraggable={currentStep >= 2}
                />
              ))}
            </div>
          </div>
          
          {currentSentence !== originalSentence && (
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <div className="font-medium mb-1">Original:</div>
              <div className="font-mono">{originalSentence}</div>
              <div className="font-medium mt-2 mb-1">Modified:</div>
              <div className="font-mono">{currentSentence}</div>
            </div>
          )}
        </div>

        {/* Attention Visualization */}
        {attentionWeights.length > 0 && currentStep >= 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Attention Patterns
            </h3>
            
            {currentStep >= 3 && currentSentence !== originalSentence ? (
              <div className="grid md:grid-cols-2 gap-6">
                <AttentionMatrix 
                  weights={generateAttentionWeights(originalSentence)} 
                  title="Original Attention"
                />
                <AttentionMatrix 
                  weights={attentionWeights} 
                  title="Modified Attention"
                />
              </div>
            ) : (
              <AttentionMatrix 
                weights={attentionWeights} 
                title="Current Attention Pattern"
              />
            )}
          </div>
        )}

        {/* Insights */}
        {insights.length > 0 && currentStep >= 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Key Insights Discovered
            </h3>
            
            <div className="grid gap-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="text-sm text-green-800">{insight}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-play speed control */}
        {isPlaying && (
          <div className="flex items-center justify-center gap-4 bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-600">Demo speed:</span>
            <Slider
              value={autoplaySpeed}
              onValueChange={setAutoplaySpeed}
              min={500}
              max={3000}
              step={250}
              className="w-32"
            />
            <span className="text-sm text-gray-600">{autoplaySpeed[0]}ms</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WordOrderDemo;