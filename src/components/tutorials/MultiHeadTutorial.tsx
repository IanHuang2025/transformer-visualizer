"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Users, 
  ChevronRight, 
  CheckCircle, 
  Sparkles, 
  Plus,
  Eye,
  Brain,
  RotateCcw,
  Layers,
  ArrowDown,
  Zap,
  Target
} from 'lucide-react';

interface AttentionHead {
  id: number;
  name: string;
  focus: string;
  color: string;
  weights: number[][];
  description: string;
  expertise: string;
}

interface MultiHeadTutorialProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

// Sample data for different attention heads
const SAMPLE_TOKENS = ["The", "cat", "sat", "on", "the", "mat"];

// Different attention patterns for different heads
const ATTENTION_HEADS: AttentionHead[] = [
  {
    id: 0,
    name: "Syntactic Head",
    focus: "Grammar & Structure",
    color: "#ef4444", // red
    expertise: "Focuses on grammatical relationships like subject-verb, determiner-noun",
    weights: [
      [0.1, 0.8, 0.05, 0.02, 0.02, 0.01],
      [0.2, 0.1, 0.6, 0.05, 0.03, 0.02],
      [0.15, 0.4, 0.2, 0.15, 0.05, 0.05],
      [0.05, 0.1, 0.3, 0.2, 0.1, 0.25],
      [0.02, 0.02, 0.05, 0.02, 0.1, 0.79],
      [0.03, 0.1, 0.2, 0.4, 0.15, 0.12]
    ],
    description: "This head specializes in syntactic relationships - notice how 'cat' strongly attends to 'sat' (subject-verb) and articles like 'The' attend to their nouns."
  },
  {
    id: 1,
    name: "Positional Head",
    focus: "Sequential Patterns",
    color: "#3b82f6", // blue
    expertise: "Focuses on positional relationships and sequential dependencies",
    weights: [
      [0.4, 0.3, 0.15, 0.08, 0.04, 0.03],
      [0.2, 0.4, 0.25, 0.1, 0.03, 0.02],
      [0.1, 0.3, 0.3, 0.2, 0.07, 0.03],
      [0.05, 0.15, 0.25, 0.3, 0.15, 0.1],
      [0.03, 0.07, 0.15, 0.25, 0.3, 0.2],
      [0.02, 0.05, 0.1, 0.2, 0.3, 0.33]
    ],
    description: "This head focuses on sequential patterns - tokens tend to attend more to nearby positions, creating a diagonal-ish pattern."
  },
  {
    id: 2,
    name: "Semantic Head",
    focus: "Meaning & Context",
    color: "#10b981", // green
    expertise: "Focuses on semantic similarity and thematic relationships",
    weights: [
      [0.15, 0.2, 0.1, 0.05, 0.45, 0.05],
      [0.1, 0.3, 0.15, 0.05, 0.1, 0.3],
      [0.08, 0.35, 0.25, 0.2, 0.07, 0.05],
      [0.05, 0.1, 0.4, 0.15, 0.05, 0.25],
      [0.4, 0.15, 0.1, 0.05, 0.2, 0.1],
      [0.05, 0.4, 0.1, 0.3, 0.1, 0.05]
    ],
    description: "This head captures semantic relationships - notice how similar concepts like 'The' and 'the' attend to each other, and 'cat' relates to 'mat' (both nouns)."
  },
  {
    id: 3,
    name: "Long-Range Head",
    focus: "Distant Dependencies",
    color: "#8b5cf6", // purple
    expertise: "Focuses on long-range dependencies and global context",
    weights: [
      [0.2, 0.1, 0.15, 0.1, 0.15, 0.3],
      [0.25, 0.15, 0.1, 0.15, 0.2, 0.15],
      [0.3, 0.1, 0.15, 0.1, 0.15, 0.2],
      [0.15, 0.2, 0.1, 0.2, 0.15, 0.2],
      [0.1, 0.2, 0.15, 0.15, 0.25, 0.15],
      [0.35, 0.05, 0.1, 0.2, 0.1, 0.2]
    ],
    description: "This head specializes in long-range dependencies - connecting tokens that are far apart but semantically related, like the beginning and end of phrases."
  }
];

export default function MultiHeadTutorial({ onComplete, onSkip }: MultiHeadTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeHeads, setActiveHeads] = useState<number[]>([0]);
  const [selectedHead, setSelectedHead] = useState<number | null>(0);
  const [showComparison, setShowComparison] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  const [animationStep, setAnimationStep] = useState(0);

  const steps = [
    {
      title: "Start with One Head",
      description: "Understand how a single attention head works",
      action: "Explore the first attention head and its focus area"
    },
    {
      title: "Add More Heads",
      description: "See how multiple heads capture different patterns",
      action: "Progressively add more attention heads"
    },
    {
      title: "Compare Head Behaviors",
      description: "Compare different heads side-by-side",
      action: "Use the comparison view to analyze head specializations"
    },
    {
      title: "Combine All Heads",
      description: "See how all heads work together",
      action: "Observe the final multi-head attention output"
    }
  ];

  const addHead = () => {
    if (activeHeads.length < ATTENTION_HEADS.length) {
      const nextHeadId = activeHeads.length;
      setActiveHeads([...activeHeads, nextHeadId]);
      setSelectedHead(nextHeadId);
      
      if (currentStep === 1 && activeHeads.length >= 2) {
        setCompletedActivities(prev => new Set(prev).add(1));
      }
    }
  };

  const removeHead = (headId: number) => {
    if (activeHeads.length > 1) {
      setActiveHeads(activeHeads.filter(id => id !== headId));
      if (selectedHead === headId) {
        setSelectedHead(activeHeads.find(id => id !== headId) || null);
      }
    }
  };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
    if (currentStep === 2 && !completedActivities.has(2)) {
      setCompletedActivities(prev => new Set(prev).add(2));
    }
  };

  const colorFromWeight = (weight: number, color: string) => {
    const opacity = Math.min(weight * 2, 1);
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${0.1 + opacity * 0.8})`;
  };

  const AttentionMatrix = ({ head, isCompact = false }: { head: AttentionHead; isCompact?: boolean }) => {
    return (
      <div className={`space-y-2 ${isCompact ? 'scale-90' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: head.color }}
          />
          <h4 className={`font-semibold ${isCompact ? 'text-sm' : 'text-base'}`}>
            {head.name}
          </h4>
          <span className={`text-muted-foreground ${isCompact ? 'text-xs' : 'text-sm'}`}>
            ({head.focus})
          </span>
        </div>
        
        <div className="overflow-auto border rounded-lg bg-white">
          <div className={isCompact ? "min-w-[300px]" : "min-w-[360px]"}>
            {/* Header row */}
            <div className="flex">
              <div className={`${isCompact ? 'w-10 h-6' : 'w-12 h-8'} flex items-center justify-center bg-gray-100 border-b border-r text-xs font-medium`}>
                →
              </div>
              {SAMPLE_TOKENS.map((token, j) => (
                <div key={j} className={`${isCompact ? 'w-10 h-6' : 'w-12 h-8'} flex items-center justify-center bg-gray-100 border-b border-r text-xs font-medium`}>
                  {isCompact ? token.slice(0, 3) : token}
                </div>
              ))}
            </div>
            
            {/* Matrix rows */}
            {head.weights.map((row, i) => (
              <div key={i} className="flex">
                <div className={`${isCompact ? 'w-10 h-8' : 'w-12 h-10'} flex items-center justify-center bg-gray-100 border-r text-xs font-medium`}>
                  {isCompact ? SAMPLE_TOKENS[i].slice(0, 3) : SAMPLE_TOKENS[i]}
                </div>
                {row.map((weight, j) => (
                  <div
                    key={j}
                    className={`${isCompact ? 'w-10 h-8' : 'w-12 h-10'} flex items-center justify-center border border-white/30 text-xs font-mono`}
                    style={{ backgroundColor: colorFromWeight(weight, head.color) }}
                  >
                    {Math.round(weight * 100)}%
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {!isCompact && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Specialization:</strong> {head.description}
          </div>
        )}
      </div>
    );
  };

  const HeadControlPanel = () => {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Head Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Active Heads: {activeHeads.length}</div>
              <div className="text-xs text-muted-foreground">
                {activeHeads.length < ATTENTION_HEADS.length && "Add more heads to see different perspectives"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addHead}
                disabled={activeHeads.length >= ATTENTION_HEADS.length}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Head
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Active Attention Heads:</div>
            <div className="flex flex-wrap gap-2">
              {activeHeads.map((headId) => {
                const head = ATTENTION_HEADS[headId];
                const isSelected = selectedHead === headId;
                return (
                  <button
                    key={headId}
                    onClick={() => setSelectedHead(headId)}
                    className={`px-3 py-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: head.color }}
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium">{head.name}</div>
                        <div className="text-xs text-muted-foreground">{head.focus}</div>
                      </div>
                      {activeHeads.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHead(headId);
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {activeHeads.length > 1 && (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <div className="text-sm font-medium">Comparison View</div>
                <div className="text-xs text-muted-foreground">See heads side-by-side</div>
              </div>
              <Switch 
                checked={showComparison} 
                onCheckedChange={toggleComparison}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const CombinedOutput = () => {
    if (currentStep < 3) return null;

    // Simulate combined output by averaging attention weights
    const combinedWeights = SAMPLE_TOKENS.map((_, i) => 
      SAMPLE_TOKENS.map((_, j) => {
        const sum = activeHeads.reduce((acc, headId) => 
          acc + ATTENTION_HEADS[headId].weights[i][j], 0
        );
        return sum / activeHeads.length;
      })
    );

    return (
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-green-600" />
            Combined Multi-Head Output
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-green-700 mb-4">
            This is the result of combining all {activeHeads.length} attention heads:
          </div>
          
          <div className="overflow-auto border rounded-lg bg-white">
            <div className="min-w-[360px]">
              {/* Header row */}
              <div className="flex">
                <div className="w-12 h-8 flex items-center justify-center bg-gray-100 border-b border-r text-xs font-medium">
                  →
                </div>
                {SAMPLE_TOKENS.map((token, j) => (
                  <div key={j} className="w-12 h-8 flex items-center justify-center bg-gray-100 border-b border-r text-xs font-medium">
                    {token}
                  </div>
                ))}
              </div>
              
              {/* Matrix rows */}
              {combinedWeights.map((row, i) => (
                <div key={i} className="flex">
                  <div className="w-12 h-10 flex items-center justify-center bg-gray-100 border-r text-xs font-medium">
                    {SAMPLE_TOKENS[i]}
                  </div>
                  {row.map((weight, j) => (
                    <div
                      key={j}
                      className="w-12 h-10 flex items-center justify-center border border-white/30 text-xs font-mono"
                      style={{ 
                        backgroundColor: `rgba(34, 197, 94, ${0.1 + weight * 0.8})` 
                      }}
                    >
                      {Math.round(weight * 100)}%
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-sm">
              <strong>How it works:</strong> Each token's final representation is the concatenation of outputs 
              from all {activeHeads.length} heads, then linearly projected. This combines the different types of 
              relationships each head discovered!
            </div>
          </div>

          {activeHeads.length >= 4 && (
            <div className="text-center">
              <Button 
                onClick={() => setCompletedActivities(prev => new Set(prev).add(3))}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                I understand multi-head attention!
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const allActivitiesComplete = completedActivities.size >= steps.length;

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Multi-Head Attention Tutorial
                </CardTitle>
                <p className="text-sm text-blue-700 mt-2">
                  Discover how multiple attention heads work together to capture different relationships
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
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Your Task:</span>
              </div>
              <p className="text-sm text-blue-800 mt-1">{steps[currentStep].action}</p>
            </div>
          </CardContent>
        </Card>

        {/* Head Control Panel */}
        <HeadControlPanel />

        {/* Main Display Area */}
        <div className="grid gap-6">
          {!showComparison ? (
            /* Single Head View */
            selectedHead !== null && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    Attention Head Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AttentionMatrix head={ATTENTION_HEADS[selectedHead]} />
                </CardContent>
              </Card>
            )
          ) : (
            /* Comparison View */
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Head Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {activeHeads.map((headId) => (
                    <div key={headId}>
                      <AttentionMatrix head={ATTENTION_HEADS[headId]} isCompact />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-sm font-medium text-purple-900 mb-2">
                    Comparison Insights:
                  </div>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• <strong>Syntactic Head:</strong> Strong diagonal patterns - adjacent word relationships</li>
                    <li>• <strong>Positional Head:</strong> Gradual falloff - position-based attention</li>
                    <li>• <strong>Semantic Head:</strong> Scattered patterns - meaning-based connections</li>
                    <li>• <strong>Long-Range Head:</strong> Connects distant tokens - global context</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Combined Output */}
          <CombinedOutput />
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={currentStep >= steps.length - 1 || !completedActivities.has(currentStep)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Key Insights Summary */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Key Insights: Multi-Head Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <div>
                    <div className="font-medium text-sm">Parallel Processing</div>
                    <div className="text-xs text-muted-foreground">Multiple heads process different relationship types simultaneously</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <div>
                    <div className="font-medium text-sm">Specialized Attention</div>
                    <div className="text-xs text-muted-foreground">Each head learns to focus on different aspects (syntax, semantics, position)</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <div>
                    <div className="font-medium text-sm">Rich Representations</div>
                    <div className="text-xs text-muted-foreground">Combining heads creates richer, more nuanced understanding</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm font-medium mb-2">🎉 Congratulations!</div>
                <div className="text-sm text-gray-700">
                  You've mastered the core concepts of transformer attention! You now understand how tokens become embeddings, 
                  transform into queries/keys/values, compute attention scores and weights, and how multiple heads work together 
                  to create rich, context-aware representations.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}