"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PanelContainer } from "./PanelContainer";
import { EducationalTooltip } from "@/components/educational/EducationalTooltip";
import { getTooltipContent } from "@/lib/educational-tooltips";
import { CausalVsNonCausalDemo, ComparisonView, useComparison } from "@/components/visualization";
import { Eye, EyeOff, Zap, BookOpen, Play, Users, PenTool, Search, MessageCircle, Tag, Shield, GitCompare, FlaskConical } from "lucide-react";

interface CausalMaskPanelProps {
  causalMask: boolean;
  onCausalMaskChange: (causal: boolean) => void;
  onInteraction: () => void;
}

export function CausalMaskPanel({
  causalMask,
  onCausalMaskChange,
  onInteraction,
}: CausalMaskPanelProps) {
  const [showPredictGame, setShowPredictGame] = useState(false);
  const [showUseCaseSelector, setShowUseCaseSelector] = useState(false);
  const [gameStep, setGameStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleToggle = (checked: boolean) => {
    onCausalMaskChange(checked);
    onInteraction();
  };

  const useCases = [
    { 
      name: "Chatbot", 
      icon: MessageCircle, 
      causal: true, 
      description: "Generate responses word by word",
      example: "Hi! How are you... [generating]"
    },
    { 
      name: "Text Generation", 
      icon: PenTool, 
      causal: true, 
      description: "Write stories, articles, code",
      example: "Once upon a time... [writing]"
    },
    { 
      name: "Text Classification", 
      icon: Tag, 
      causal: false, 
      description: "Analyze sentiment, categorize",
      example: "This movie is... [analyzing all words]"
    },
    { 
      name: "Question Answering", 
      icon: Search, 
      causal: false, 
      description: "Understand full context to answer",
      example: "What color is the cat? [needs full sentence]"
    },
  ];

  const predictGameSentence = ["The", "quick", "brown", "fox", "jumps"];
  const predictNextOptions = [
    ["cat", "quick", "dog"],
    ["slow", "brown", "fast"], 
    ["red", "brown", "blue"],
    ["cat", "fox", "dog"],
    ["runs", "jumps", "sits"]
  ];

  const handleUseCaseSelect = (useCase: any) => {
    onCausalMaskChange(useCase.causal);
    onInteraction();
  };

  return (
    <PanelContainer
      title="Causal Masking"
      icon={causalMask ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      description="Control whether tokens can see future positions"
    >
      <div className="space-y-4">
        {/* Enhanced Toggle Control with Model Type Badge */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <EducationalTooltip
                content={getTooltipContent('causal-mask', 'causalToggle')!}
                placement="top"
                size="md"
              >
                <div className="text-sm font-medium text-gray-800">
                  Enable Causal Mask
                </div>
              </EducationalTooltip>
              <Badge 
                variant={causalMask ? "destructive" : "secondary"}
                className="text-xs"
              >
                {causalMask ? "GPT-style" : "BERT-style"}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {causalMask 
                ? "Decoder mode: can't see future tokens"
                : "Encoder mode: can see all tokens"
              }
            </div>
          </div>
          <Switch
            checked={causalMask}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* Animated Attention Matrix Shape Preview */}
        <div className="border rounded-lg p-4">
          <EducationalTooltip
            content={getTooltipContent('causal-mask', 'matrixVisualization')!}
            placement="top"
            size="md"
          >
            <div className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Attention Matrix Shape
            </div>
          </EducationalTooltip>
          
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className={`grid grid-cols-6 gap-0.5 transition-all duration-500 ${
                causalMask ? 'transform rotate-0' : 'transform rotate-0'
              }`}>
                {Array.from({ length: 36 }, (_, i) => {
                  const row = Math.floor(i / 6);
                  const col = i % 6;
                  const canAttend = causalMask ? col <= row : true;
                  
                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 transition-all duration-300 ${
                        canAttend 
                          ? "bg-blue-500 opacity-80" 
                          : "bg-red-300 opacity-60"
                      }`}
                      style={{
                        transitionDelay: `${(row + col) * 50}ms`
                      }}
                    />
                  );
                })}
              </div>
              
              {/* Shape indicator */}
              <div className="absolute -right-20 top-1/2 transform -translate-y-1/2">
                <div className="text-xs text-gray-500 text-center">
                  <div className="font-medium">
                    {causalMask ? "Triangle" : "Square"}
                  </div>
                  <div>
                    {causalMask ? "(Causal)" : "(Bidirectional)"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 opacity-80"></div>
              Can attend
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-300 opacity-60"></div>
              Masked
            </div>
          </div>
        </div>

        {/* Use Case Selector */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <EducationalTooltip
              content={getTooltipContent('causal-mask', 'useCaseSelector')!}
              placement="top"
              size="md"
            >
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Use Case Selector
              </div>
            </EducationalTooltip>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUseCaseSelector(!showUseCaseSelector)}
            >
              {showUseCaseSelector ? 'Hide' : 'Show'} Cases
            </Button>
          </div>

          {showUseCaseSelector && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 mb-3">
                Choose a use case and we'll set the right mask automatically:
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {useCases.map((useCase, idx) => (
                  <button
                    key={idx}
                    className={`p-3 rounded-lg border text-left transition-all hover:scale-105 ${
                      causalMask === useCase.causal 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleUseCaseSelect(useCase)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <useCase.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{useCase.name}</span>
                      <Badge 
                        variant={useCase.causal ? "destructive" : "secondary"}
                        className="text-xs ml-auto"
                      >
                        {useCase.causal ? "Causal" : "Bidir"}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {useCase.description}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      "{useCase.example}"
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Writer vs Editor Analogy */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-sm font-medium text-purple-900 mb-2">
            Think of it like Writer vs Editor
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${
              causalMask ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="text-xs font-medium text-gray-800 mb-1 flex items-center gap-1">
                <PenTool className="w-3 h-3" />
                Writer (Causal ON)
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• Writes word by word</div>
                <div>• Can't see the future</div>
                <div>• Each word builds on previous</div>
                <div>• Like GPT writing text</div>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg border ${
              !causalMask ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="text-xs font-medium text-gray-800 mb-1 flex items-center gap-1">
                <Search className="w-3 h-3" />
                Editor (Causal OFF)
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• Reads entire document</div>
                <div>• Sees whole context</div>
                <div>• Understands relationships</div>
                <div>• Like BERT analyzing text</div>
              </div>
            </div>
          </div>
        </div>

        {/* Predict Next Word Interactive Game */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <EducationalTooltip
              content={getTooltipContent('causal-mask', 'predictGame')!}
              placement="top"
              size="md"
            >
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <Play className="w-4 h-4" />
                "Predict Next Word" Game
              </div>
            </EducationalTooltip>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowPredictGame(!showPredictGame);
                setGameStep(0);
              }}
            >
              {showPredictGame ? 'Hide' : 'Play'} Game
            </Button>
          </div>

          {showPredictGame && (
            <div className="space-y-3">
              <div className="text-xs text-gray-600 mb-3">
                {causalMask 
                  ? "In causal mode, predict the next word without seeing the future:"
                  : "In bidirectional mode, you can see the whole sentence to understand context:"
                }
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {predictGameSentence.map((word, idx) => (
                    <span key={idx}>
                      <span 
                        className={`px-2 py-1 rounded text-sm ${
                          idx <= gameStep 
                            ? 'bg-blue-500 text-white' 
                            : causalMask 
                              ? 'bg-red-100 text-red-400 blur-sm' 
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {word}
                      </span>
                      {idx < predictGameSentence.length - 1 && <span className="mx-1 text-gray-400">→</span>}
                    </span>
                  ))}
                </div>
                
                {gameStep < predictGameSentence.length && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      What comes next?
                    </div>
                    <div className="flex gap-2">
                      {predictNextOptions[gameStep]?.map((option, idx) => (
                        <button
                          key={idx}
                          className="px-3 py-1 bg-white border rounded-lg text-sm hover:border-blue-300 hover:bg-blue-50 transition-colors"
                          onClick={() => setGameStep(Math.min(gameStep + 1, predictGameSentence.length - 1))}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {gameStep >= predictGameSentence.length - 1 && (
                  <div className="mt-3 text-xs text-green-600">
                    Great! You've seen how {causalMask ? "causal" : "bidirectional"} attention works.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Why Use Causal Mask Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Why Use Causal Mask?
          </div>
          <div className="text-xs text-blue-800 space-y-2">
            <div><strong>Causal (ON):</strong> Prevents "cheating" during training. The model learns to predict the next word without seeing it first.</div>
            <div><strong>Bidirectional (OFF):</strong> Allows full context understanding for tasks like sentiment analysis where you need the complete picture.</div>
            <div><strong>Key insight:</strong> The mask type determines whether you're generating new content or understanding existing content.</div>
          </div>
        </div>

        {/* Visualization Controls */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Advanced Visualizations
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDemo(!showDemo)}
              >
                <GitCompare className="w-4 h-4 mr-1" />
                {showDemo ? 'Hide' : 'Show'} Demo
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
              >
                <FlaskConical className="w-4 h-4 mr-1" />
                {showComparison ? 'Hide' : 'Show'} Comparison
              </Button>
            </div>
          </div>

          {/* Causal vs Non-Causal Demo */}
          {showDemo && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <CausalVsNonCausalDemo
                sentence="The quick brown fox jumps over the lazy dog"
                onModeChange={(isCausal) => {
                  if (isCausal !== causalMask) {
                    onCausalMaskChange(isCausal);
                  }
                }}
                onComplete={(insights) => {
                  console.log('Demo completed with insights:', insights);
                }}
              />
            </div>
          )}

          {/* Configuration Comparison */}
          {showComparison && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <ComparisonView
                leftItem={{
                  id: 'causal',
                  title: 'Causal Attention',
                  description: 'Information flows left-to-right only',
                  content: <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Type:</strong> Causal</div>
                      <div><strong>Direction:</strong> Left-to-right</div>
                      <div><strong>Use case:</strong> Text generation</div>
                      <div><strong>Model type:</strong> GPT-style</div>
                    </div>
                  </div>,
                  metadata: {
                    complexity: 0.6,
                    performance: 'fast',
                    accuracy: 0.8
                  }
                }}
                rightItem={{
                  id: 'bidirectional',
                  title: 'Bidirectional Attention',
                  description: 'Information flows in all directions',
                  content: <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Type:</strong> Bidirectional</div>
                      <div><strong>Direction:</strong> All directions</div>
                      <div><strong>Use case:</strong> Text understanding</div>
                      <div><strong>Model type:</strong> BERT-style</div>
                    </div>
                  </div>,
                  metadata: {
                    complexity: 0.8,
                    performance: 'moderate',
                    accuracy: 0.9
                  }
                }}
                showDifferences={true}
                syncScrolling={true}
                splitView={true}
              />
            </div>
          )}
        </div>

        {/* Enhanced Status Display */}
        <div className={`p-3 rounded-lg border transition-all ${
          causalMask 
            ? "bg-orange-50 border-orange-200" 
            : "bg-green-50 border-green-200"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm font-medium ${
              causalMask ? "text-orange-900" : "text-green-900"
            }`}>
              Current Mode: {causalMask ? "Causal (Decoder)" : "Bidirectional (Encoder)"}
            </div>
            <div className="flex items-center gap-2">
              {causalMask ? <EyeOff className="w-4 h-4 text-orange-600" /> : <Eye className="w-4 h-4 text-green-600" />}
              <Badge 
                variant={causalMask ? "destructive" : "secondary"}
                className="text-xs"
              >
                {causalMask ? "GPT-style" : "BERT-style"}
              </Badge>
            </div>
          </div>
          <div className={`text-xs ${
            causalMask ? "text-orange-800" : "text-green-800"
          }`}>
            {causalMask 
              ? "🔒 Information flows left-to-right only (like writing)"
              : "🔓 Information flows in all directions (like reading)"
            }
          </div>
        </div>
      </div>
    </PanelContainer>
  );
}