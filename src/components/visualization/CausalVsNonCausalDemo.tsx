"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Shield,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  Lightbulb,
  GitCompare,
  Clock,
  Zap,
  Target,
  AlertTriangle
} from 'lucide-react';

interface CausalVsNonCausalDemoProps {
  sentence?: string;
  onModeChange?: (isCausal: boolean) => void;
  onComplete?: (insights: string[]) => void;
}

interface AttentionPattern {
  causal: number[][];
  nonCausal: number[][];
}

export function CausalVsNonCausalDemo({
  sentence = "The cat will sit on the mat tomorrow",
  onModeChange,
  onComplete
}: CausalVsNonCausalDemoProps) {
  const [isCausal, setIsCausal] = useState(true);
  const [selectedToken, setSelectedToken] = useState(2); // "will"
  const [isAnimating, setIsAnimating] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState([1000]);
  const [highlightedConnections, setHighlightedConnections] = useState<boolean[][]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const words = sentence.split(' ');
  
  // Generate attention patterns for both modes
  const attentionPatterns: AttentionPattern = useMemo(() => {
    const numWords = words.length;
    const causal: number[][] = [];
    const nonCausal: number[][] = [];

    for (let i = 0; i < numWords; i++) {
      const causalRow: number[] = [];
      const nonCausalRow: number[] = [];
      
      for (let j = 0; j < numWords; j++) {
        // Base attention weight
        let baseWeight = 0.1 + Math.random() * 0.2;
        
        // Self-attention
        if (i === j) {
          baseWeight += 0.4;
        }
        
        // Distance-based decay
        const distance = Math.abs(i - j);
        baseWeight = Math.max(0.1, baseWeight - distance * 0.05);
        
        // Add semantic relationships
        if (isRelated(words[i], words[j])) {
          baseWeight += 0.3;
        }

        // Causal: can only attend to previous tokens and self
        const causalWeight = j <= i ? baseWeight : 0;
        
        // Non-causal: can attend to all tokens
        const nonCausalWeight = baseWeight;
        
        causalRow.push(causalWeight);
        nonCausalRow.push(nonCausalWeight);
      }
      
      causal.push(causalRow);
      nonCausal.push(nonCausalRow);
    }

    return { causal, nonCausal };
  }, [words]);

  const isRelated = (word1: string, word2: string): boolean => {
    const relationships = [
      ['The', 'cat', 'mat'],
      ['will', 'sit'],
      ['on', 'the', 'mat'],
      ['cat', 'sit'],
      ['tomorrow', 'will']
    ];

    return relationships.some(group => 
      group.includes(word1) && group.includes(word2)
    );
  };

  // Animation effect
  useEffect(() => {
    if (!isAnimating) return;

    let tokenIndex = 0;
    const interval = setInterval(() => {
      setSelectedToken(tokenIndex);
      tokenIndex = (tokenIndex + 1) % words.length;
      
      if (tokenIndex === 0) {
        setCurrentStep(prev => {
          if (prev >= 3) {
            setIsAnimating(false);
            generateInsights();
            return prev;
          }
          return prev + 1;
        });
      }
    }, animationSpeed[0]);

    return () => clearInterval(interval);
  }, [isAnimating, animationSpeed, words.length]);

  // Update highlighted connections
  useEffect(() => {
    const connections: boolean[][] = Array(words.length).fill(null).map(() => Array(words.length).fill(false));
    const currentPattern = isCausal ? attentionPatterns.causal : attentionPatterns.nonCausal;
    
    // Highlight connections for selected token
    for (let j = 0; j < words.length; j++) {
      if (currentPattern[selectedToken][j] > 0.3) {
        connections[selectedToken][j] = true;
      }
    }
    
    setHighlightedConnections(connections);
  }, [selectedToken, isCausal, attentionPatterns, words.length]);

  const generateInsights = () => {
    const newInsights = [
      "Causal attention prevents future information leakage",
      "Non-causal attention allows bidirectional context",
      "Causal masking is essential for autoregressive generation",
      "Non-causal attention is better for understanding tasks",
      "The attention triangle shows causal constraints visually"
    ];
    setInsights(newInsights);
    onComplete?.(newInsights);
  };

  const handleModeToggle = (causal: boolean) => {
    setIsCausal(causal);
    onModeChange?.(causal);
  };

  const AttentionMatrix = ({ 
    pattern, 
    title, 
    highlightToken = selectedToken 
  }: { 
    pattern: number[][]; 
    title: string;
    highlightToken?: number;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <div className="flex items-center gap-1">
          {isCausal ? <Lock className="w-3 h-3 text-red-500" /> : <Unlock className="w-3 h-3 text-green-500" />}
          <span className="text-xs text-gray-600">
            {isCausal ? 'Causal' : 'Non-causal'}
          </span>
        </div>
      </div>
      
      {/* Word labels */}
      <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `40px repeat(${words.length}, 1fr)` }}>
        <div></div>
        {words.map((word, idx) => (
          <div key={idx} className="text-xs text-center font-medium text-gray-700 p-1 truncate">
            {word}
          </div>
        ))}
      </div>
      
      {/* Attention matrix */}
      <div className="bg-gray-50 p-3 rounded-lg">
        {pattern.map((row, rowIdx) => (
          <div key={rowIdx} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `40px repeat(${words.length}, 1fr)` }}>
            <div className={`
              text-xs font-medium text-gray-700 p-1 flex items-center justify-end pr-2
              ${rowIdx === highlightToken ? 'bg-blue-100 text-blue-800 rounded' : ''}
            `}>
              {words[rowIdx]}
            </div>
            
            {row.map((weight, colIdx) => {
              const isBlocked = isCausal && colIdx > rowIdx;
              const isHighlighted = rowIdx === highlightToken;
              const isConnection = highlightedConnections[rowIdx]?.[colIdx];
              
              return (
                <div
                  key={colIdx}
                  className={`
                    aspect-square rounded border cursor-pointer transition-all duration-300
                    ${isBlocked 
                      ? 'bg-red-100 border-red-200' 
                      : 'hover:scale-110'
                    }
                    ${isHighlighted ? 'ring-2 ring-blue-400' : ''}
                    ${isConnection ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
                  `}
                  style={{
                    backgroundColor: isBlocked 
                      ? '#fef2f2' 
                      : `rgba(59, 130, 246, ${weight})`,
                    minWidth: '20px',
                    minHeight: '20px',
                    position: 'relative'
                  }}
                  title={`${words[rowIdx]} → ${words[colIdx]}: ${
                    isBlocked ? 'BLOCKED' : `${(weight * 100).toFixed(1)}%`
                  }`}
                  onClick={() => setSelectedToken(rowIdx)}
                >
                  {isBlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <X className="w-2 h-2 text-red-500" />
                    </div>
                  )}
                  {!isBlocked && weight > 0.5 && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                      {Math.round(weight * 100)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const TokenFlow = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-800 flex items-center gap-2">
        <ArrowRight className="w-4 h-4" />
        Information Flow for "{words[selectedToken]}"
      </h4>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {words.map((word, idx) => {
            const currentPattern = isCausal ? attentionPatterns.causal : attentionPatterns.nonCausal;
            const attention = currentPattern[selectedToken][idx];
            const isBlocked = isCausal && idx > selectedToken;
            const isSelected = idx === selectedToken;
            
            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      px-3 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer
                      ${isSelected 
                        ? 'border-blue-400 bg-blue-100 text-blue-800 scale-110' 
                        : isBlocked
                        ? 'border-red-300 bg-red-50 text-red-600 opacity-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                      }
                    `}
                    onClick={() => setSelectedToken(idx)}
                  >
                    <span className="font-medium text-sm">{word}</span>
                    {isBlocked && <Lock className="w-3 h-3 inline ml-1" />}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {isBlocked ? 'BLOCKED' : `${Math.round(attention * 100)}%`}
                  </div>
                  
                  {attention > 0.3 && !isBlocked && (
                    <div className="w-1 bg-blue-400 rounded mt-1 animate-pulse"
                         style={{ height: `${attention * 20}px` }} />
                  )}
                </div>
                
                {idx < words.length - 1 && (
                  <ArrowRight className={`
                    w-4 h-4 transition-opacity duration-300
                    ${isSelected ? 'text-blue-500 opacity-100' : 'text-gray-300 opacity-50'}
                  `} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );

  const MaskingVisualization = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-800 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        Attention Masking Pattern
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-red-500" />
            <span className="text-sm font-medium">Causal (Masked)</span>
          </div>
          <div className="text-xs text-gray-600">
            Future tokens are masked (blocked) to prevent information leakage
          </div>
          <div className="bg-red-50 p-2 rounded text-xs">
            <strong>Use case:</strong> Language generation, autoregressive models
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Unlock className="w-3 h-3 text-green-500" />
            <span className="text-sm font-medium">Non-causal (Unmasked)</span>
          </div>
          <div className="text-xs text-gray-600">
            All tokens can attend to each other bidirectionally
          </div>
          <div className="bg-green-50 p-2 rounded text-xs">
            <strong>Use case:</strong> Understanding tasks, BERT-style models
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Causal vs Non-Causal Attention Demo
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? 'Pause' : 'Animate'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedToken(0);
                setCurrentStep(0);
                setIsAnimating(false);
                setInsights([]);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Explore how causal masking affects attention patterns and information flow
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mode Controls */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Attention Mode
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={comparisonMode}
                  onCheckedChange={setComparisonMode}
                />
                <span className="text-sm text-gray-600">Compare side-by-side</span>
              </div>
              
              {isAnimating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Speed:</span>
                  <Slider
                    value={animationSpeed}
                    onValueChange={setAnimationSpeed}
                    min={500}
                    max={3000}
                    step={250}
                    className="w-24"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6">
            <Button
              variant={isCausal ? "default" : "outline"}
              onClick={() => handleModeToggle(true)}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Causal Attention
            </Button>
            
            <div className="text-gray-400">vs</div>
            
            <Button
              variant={!isCausal ? "default" : "outline"}
              onClick={() => handleModeToggle(false)}
              className="flex items-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Non-Causal Attention
            </Button>
          </div>
        </div>

        {/* Current Sentence */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Analyzing Sentence</span>
          </div>
          <div className="text-lg font-mono text-center">"{sentence}"</div>
          <div className="text-sm text-blue-600 mt-2 text-center">
            Click on any word to see its attention pattern
          </div>
        </div>

        <Tabs defaultValue="matrix" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matrix">Attention Matrix</TabsTrigger>
            <TabsTrigger value="flow">Token Flow</TabsTrigger>
            <TabsTrigger value="masking">Masking Pattern</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-6">
            {comparisonMode ? (
              <div className="grid md:grid-cols-2 gap-6">
                <AttentionMatrix
                  pattern={attentionPatterns.causal}
                  title="Causal Attention (Masked)"
                />
                <AttentionMatrix
                  pattern={attentionPatterns.nonCausal}
                  title="Non-Causal Attention (Unmasked)"
                />
              </div>
            ) : (
              <AttentionMatrix
                pattern={isCausal ? attentionPatterns.causal : attentionPatterns.nonCausal}
                title={`${isCausal ? 'Causal' : 'Non-Causal'} Attention Pattern`}
              />
            )}
            
            {/* Legend */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>High attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span>Low attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span>Blocked (causal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 ring-2 ring-blue-400 bg-blue-100 rounded"></div>
                  <span>Selected token</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="flow" className="space-y-6">
            <TokenFlow />
            
            {/* Flow explanation */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">How Information Flows</span>
              </div>
              <div className="text-sm text-yellow-700">
                {isCausal ? (
                  <>
                    <strong>Causal mode:</strong> Information can only flow from left to right (past → present). 
                    The selected token "{words[selectedToken]}" can only attend to tokens that came before it and itself.
                  </>
                ) : (
                  <>
                    <strong>Non-causal mode:</strong> Information can flow in both directions (bidirectional). 
                    The selected token "{words[selectedToken]}" can attend to all tokens in the sequence.
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="masking" className="space-y-6">
            <MaskingVisualization />
            
            {/* Visual comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Causal Masking</h4>
                <div className="space-y-1">
                  {words.map((_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-1">
                      {words.map((_, colIdx) => (
                        <div
                          key={colIdx}
                          className={`w-4 h-4 rounded ${
                            colIdx <= rowIdx ? 'bg-green-300' : 'bg-red-300'
                          }`}
                          title={`${rowIdx} → ${colIdx}: ${colIdx <= rowIdx ? 'Allowed' : 'Blocked'}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-red-600 mt-2">
                  Lower triangle: Allowed | Upper triangle: Blocked
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Non-Causal (Full)</h4>
                <div className="space-y-1">
                  {words.map((_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-1">
                      {words.map((_, colIdx) => (
                        <div
                          key={colIdx}
                          className="w-4 h-4 rounded bg-green-300"
                          title={`${rowIdx} → ${colIdx}: Allowed`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-green-600 mt-2">
                  All connections: Allowed
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Key Differences */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <GitCompare className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Key Differences</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-red-700">
                <Lock className="w-3 h-3" />
                Causal Attention
              </div>
              <ul className="space-y-1 text-red-600 text-xs ml-4">
                <li>• Can only see past and present tokens</li>
                <li>• Prevents information leakage from future</li>
                <li>• Used in GPT, autoregressive models</li>
                <li>• Essential for text generation</li>
                <li>• Creates triangular attention pattern</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-green-700">
                <Unlock className="w-3 h-3" />
                Non-Causal Attention
              </div>
              <ul className="space-y-1 text-green-600 text-xs ml-4">
                <li>• Can see all tokens in sequence</li>
                <li>• Bidirectional context understanding</li>
                <li>• Used in BERT, encoder models</li>
                <li>• Better for comprehension tasks</li>
                <li>• Creates full attention matrix</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-medium text-gray-800">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Key Insights About Attention Masking
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
      </CardContent>
    </Card>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default CausalVsNonCausalDemo;