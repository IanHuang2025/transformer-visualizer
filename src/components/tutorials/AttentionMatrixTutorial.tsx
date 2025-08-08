"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Grid3x3, 
  ChevronRight, 
  CheckCircle, 
  Sparkles, 
  Target, 
  Zap, 
  Eye,
  MousePointer,
  RotateCcw,
  HelpCircle,
  Info
} from 'lucide-react';

interface MatrixCell {
  row: number;
  col: number;
  value: number;
  isHighlighted: boolean;
  isSelected: boolean;
}

interface AttentionMatrixTutorialProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

// Sample attention data for tutorial
const SAMPLE_TOKENS = ["The", "cat", "sat", "on", "the", "mat"];
const SAMPLE_SCORES = [
  [0.2, -0.5, 0.1, 0.0, 0.8, -0.3],
  [0.1, 0.9, 0.4, 0.2, 0.3, 0.6],
  [-0.2, 0.7, 0.8, 0.5, 0.1, 0.4],
  [0.0, 0.3, 0.6, 0.4, 0.2, 0.9],
  [0.3, 0.1, 0.0, 0.2, 0.7, 0.4],
  [-0.1, 0.5, 0.3, 0.8, 0.2, 0.6]
];

// Convert scores to weights using softmax
function softmax(arr: number[]): number[] {
  const maxVal = Math.max(...arr);
  const exp = arr.map(x => Math.exp(x - maxVal));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(x => x / sum);
}

const SAMPLE_WEIGHTS = SAMPLE_SCORES.map(row => softmax(row));

export default function AttentionMatrixTutorial({ onComplete, onSkip }: AttentionMatrixTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [exploredCells, setExploredCells] = useState<Set<string>>(new Set());
  const [showScores, setShowScores] = useState(true);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null);
  const [animationMode, setAnimationMode] = useState<'none' | 'row-highlight' | 'pattern-reveal'>('none');

  const steps = [
    {
      title: "Understanding the Attention Matrix",
      description: "Learn what each cell in the attention matrix represents",
      action: "Click on different cells to explore their meaning"
    },
    {
      title: "Scores vs Weights",
      description: "See the difference between raw attention scores and softmax weights",
      action: "Toggle between scores and weights to understand the transformation"
    },
    {
      title: "Reading Attention Patterns",
      description: "Interpret what the attention patterns tell us about relationships",
      action: "Analyze the patterns and complete the understanding check"
    }
  ];

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    const cellKey = `${row}-${col}`;
    setExploredCells(prev => new Set(prev).add(cellKey));
    
    if (currentStep === 0 && exploredCells.size >= 2) {
      setCompletedActivities(prev => new Set(prev).add(0));
    }
  };

  const handleScoreWeightToggle = () => {
    setShowScores(!showScores);
    if (currentStep === 1 && !completedActivities.has(1)) {
      setCompletedActivities(prev => new Set(prev).add(1));
    }
  };

  const colorFromScore = (score: number) => {
    const normalized = Math.tanh(score / 2);
    if (normalized > 0) {
      const intensity = Math.min(normalized * 100, 80);
      return `hsl(10, 85%, ${50 + (1 - normalized) * 30}%)`;
    } else {
      const intensity = Math.min(Math.abs(normalized) * 100, 80);
      return `hsl(210, 85%, ${50 + (1 - Math.abs(normalized)) * 30}%)`;
    }
  };

  const colorFromWeight = (weight: number) => {
    const intensity = Math.min(weight * 100, 90);
    return `hsl(220, 90%, ${96 - intensity * 0.5}%)`;
  };

  const InteractiveMatrix = () => {
    const currentMatrix = showScores ? SAMPLE_SCORES : SAMPLE_WEIGHTS;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {showScores ? "Attention Scores" : "Attention Weights"}
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleScoreWeightToggle}
              className="bg-blue-50 hover:bg-blue-100"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Switch to {showScores ? "Weights" : "Scores"}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {exploredCells.size} of {SAMPLE_TOKENS.length * SAMPLE_TOKENS.length} cells explored
          </div>
        </div>

        <div className="overflow-auto border rounded-xl bg-white">
          <div className="min-w-[400px]">
            {/* Header row */}
            <div className="flex">
              <div className="w-16 h-8 flex items-center justify-center bg-gray-100 border-b border-r text-xs font-medium">
                →
              </div>
              {SAMPLE_TOKENS.map((token, j) => (
                <div key={j} className="w-16 h-8 flex items-center justify-center bg-gray-100 border-b border-r text-xs font-medium">
                  {token}
                </div>
              ))}
            </div>
            
            {/* Matrix rows */}
            {currentMatrix.map((row, i) => (
              <div key={i} className="flex">
                {/* Row header */}
                <div className="w-16 h-12 flex items-center justify-center bg-gray-100 border-r text-xs font-medium">
                  {SAMPLE_TOKENS[i]}
                </div>
                
                {/* Matrix cells */}
                {row.map((value, j) => {
                  const isSelected = selectedCell?.row === i && selectedCell?.col === j;
                  const isHovered = hoveredCell?.row === i && hoveredCell?.col === j;
                  const isExplored = exploredCells.has(`${i}-${j}`);
                  const bgColor = showScores ? colorFromScore(value) : colorFromWeight(value);
                  
                  return (
                    <button
                      key={j}
                      onClick={() => handleCellClick(i, j)}
                      onMouseEnter={() => setHoveredCell({ row: i, col: j })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`w-16 h-12 text-[10px] font-mono border border-white/30 transition-all relative ${
                        isSelected ? "ring-2 ring-blue-500 ring-inset z-10" : ""
                      } ${isHovered ? "scale-105 z-10 shadow-lg" : ""} ${
                        isExplored ? "opacity-100" : "opacity-80"
                      } hover:opacity-100 hover:scale-105`}
                      style={{ backgroundColor: bgColor }}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="font-bold text-gray-800">
                          {showScores ? value.toFixed(2) : Math.round(value * 100)}
                          {!showScores && "%"}
                        </div>
                        {isExplored && (
                          <div className="absolute -top-1 -right-1">
                            <CheckCircle className="w-3 h-3 text-green-600 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Color Legend */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Color Legend</div>
          {showScores ? (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromScore(-2)}}></div>
                <span>Strong negative</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromScore(0)}}></div>
                <span>Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromScore(2)}}></div>
                <span>Strong positive</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromWeight(0)}}></div>
                <span>No attention (0%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromWeight(0.5)}}></div>
                <span>Medium attention (50%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromWeight(1)}}></div>
                <span>Full attention (100%)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CellExplanationPanel = () => {
    if (!selectedCell) {
      return (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-blue-600" />
              Cell Explorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">
              Click on any cell in the matrix to explore what it represents!
            </p>
          </CardContent>
        </Card>
      );
    }

    const { row, col } = selectedCell;
    const scoreValue = SAMPLE_SCORES[row][col];
    const weightValue = SAMPLE_WEIGHTS[row][col];
    const queryToken = SAMPLE_TOKENS[row];
    const keyToken = SAMPLE_TOKENS[col];

    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-600" />
            Cell Analysis: [{row}, {col}]
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-yellow-900 mb-2">What this cell represents:</div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm">
                  <strong>Query Token:</strong> "{queryToken}" (row {row})<br />
                  <strong>Key Token:</strong> "{keyToken}" (column {col})<br />
                  <strong>Meaning:</strong> How much "{queryToken}" attends to "{keyToken}"
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-yellow-900 mb-2">Values:</div>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border">
                  <div className="text-xs text-gray-600">Raw Score</div>
                  <div className="font-mono text-lg">{scoreValue.toFixed(3)}</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-xs text-gray-600">Softmax Weight</div>
                  <div className="font-mono text-lg">{Math.round(weightValue * 100)}%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-sm font-medium mb-2">Interpretation:</div>
            <div className="text-sm text-gray-700">
              {weightValue > 0.3 ? (
                <>
                  <span className="text-green-700 font-medium">Strong attention!</span> The token "{queryToken}" 
                  pays significant attention to "{keyToken}" ({Math.round(weightValue * 100)}% of its total attention).
                </>
              ) : weightValue > 0.1 ? (
                <>
                  <span className="text-blue-700 font-medium">Moderate attention.</span> The token "{queryToken}" 
                  pays some attention to "{keyToken}" ({Math.round(weightValue * 100)}% of its total attention).
                </>
              ) : (
                <>
                  <span className="text-gray-700 font-medium">Low attention.</span> The token "{queryToken}" 
                  pays little attention to "{keyToken}" ({Math.round(weightValue * 100)}% of its total attention).
                </>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm">
              <strong>💡 Remember:</strong> Each row sums to 100% - this represents how a query token 
              distributes its attention across all key tokens.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PatternAnalysisActivity = () => {
    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    if (currentStep < 2) return null;

    const patterns = [
      {
        id: "self_attention",
        name: "Self-Attention (Diagonal)",
        description: "Tokens paying attention to themselves",
        correct: false
      },
      {
        id: "next_word",
        name: "Sequential Patterns",
        description: "Tokens attending to adjacent words",
        correct: true
      },
      {
        id: "semantic_sim",
        name: "Semantic Similarity", 
        description: "Similar words attending to each other",
        correct: false
      },
      {
        id: "syntax_rel",
        name: "Syntactic Relationships",
        description: "Grammar-based attention patterns",
        correct: false
      }
    ];

    const handlePatternSelect = (patternId: string) => {
      setSelectedPattern(patternId);
      setShowResult(true);
      const isCorrect = patterns.find(p => p.id === patternId)?.correct;
      if (isCorrect) {
        setTimeout(() => {
          setCompletedActivities(prev => new Set(prev).add(2));
        }, 1000);
      }
    };

    return (
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Pattern Recognition Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-purple-700">
            Looking at the attention matrix above, what pattern do you notice most strongly?
          </div>
          
          <div className="grid gap-2">
            {patterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => handlePatternSelect(pattern.id)}
                disabled={showResult}
                className={`text-left p-3 rounded-lg border transition-all ${
                  showResult
                    ? pattern.correct
                      ? "bg-green-100 border-green-400 text-green-800"
                      : selectedPattern === pattern.id
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-50 border-gray-300 text-gray-600"
                    : "bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {showResult && pattern.correct && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{pattern.name}</div>
                    <div className="text-xs text-muted-foreground">{pattern.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {showResult && (
            <div className={`p-3 rounded-lg border ${
              patterns.find(p => p.id === selectedPattern)?.correct
                ? "border-green-300 bg-green-50"
                : "border-blue-300 bg-blue-50"
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                patterns.find(p => p.id === selectedPattern)?.correct
                  ? "text-green-800"
                  : "text-blue-800"
              }`}>
                {patterns.find(p => p.id === selectedPattern)?.correct
                  ? "Correct! 🎉"
                  : "Good observation! Here's what we see:"
                }
              </div>
              <div className={`text-sm ${
                patterns.find(p => p.id === selectedPattern)?.correct
                  ? "text-green-700"
                  : "text-blue-700"
              }`}>
                The strongest pattern in this example is sequential attention - tokens like "sat" pay 
                strong attention to nearby words like "cat" and "on", showing how the model captures 
                local word relationships for understanding sentence structure.
              </div>
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
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Grid3x3 className="w-6 h-6 text-purple-600" />
                  Attention Matrix Tutorial
                </CardTitle>
                <p className="text-sm text-purple-700 mt-2">
                  Interactive exploration of attention matrices and their patterns
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
                  ? "bg-purple-500 text-white"
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
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Your Task:</span>
              </div>
              <p className="text-sm text-purple-800 mt-1">{steps[currentStep].action}</p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              Interactive Attention Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveMatrix />
          </CardContent>
        </Card>

        {/* Cell Analysis */}
        <CellExplanationPanel />

        {/* Pattern Analysis Activity */}
        <PatternAnalysisActivity />

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
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Key Insights: Reading Attention Matrices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <div>
                    <div className="font-medium text-sm">Matrix Structure</div>
                    <div className="text-xs text-muted-foreground">Rows = queries, Columns = keys, Cell = attention strength</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <div>
                    <div className="font-medium text-sm">Probability Distribution</div>
                    <div className="text-xs text-muted-foreground">Each row sums to 100% - attention budget allocation</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <div>
                    <div className="font-medium text-sm">Pattern Recognition</div>
                    <div className="text-xs text-muted-foreground">Colors and values reveal relationship patterns</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm font-medium mb-2">🎯 What's Next?</div>
                <div className="text-sm text-gray-700">
                  Now that you can read attention matrices, you're ready to explore <strong>multi-head attention</strong> - 
                  where multiple matrices work together to capture different types of relationships simultaneously!
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}