"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Brain,
  Users,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Target,
  Lightbulb,
  GitMerge,
  Zap,
  Activity,
  ArrowRight,
  Search
} from 'lucide-react';

interface AttentionHead {
  id: number;
  name: string;
  specialization: string;
  description: string;
  color: string;
  focusPattern: 'syntax' | 'semantic' | 'positional' | 'causal' | 'mixed';
  strength: number;
  examples: string[];
}

interface HeadSpecializationDemoProps {
  sentence?: string;
  numHeads?: number;
  onHeadSelect?: (headId: number) => void;
  onComplete?: (insights: string[]) => void;
}

const HEAD_SPECIALIZATIONS: AttentionHead[] = [
  {
    id: 0,
    name: "Syntax Parser",
    specialization: "Grammatical Structure",
    description: "Identifies grammatical relationships and sentence structure",
    color: "bg-blue-500",
    focusPattern: 'syntax',
    strength: 0.85,
    examples: ["The cat → sat", "big → house", "will → eat"]
  },
  {
    id: 1,
    name: "Semantic Linker",
    specialization: "Meaning Connections",
    description: "Connects words with related meanings and concepts",
    color: "bg-green-500",
    focusPattern: 'semantic',
    strength: 0.78,
    examples: ["king → royal", "cat → animal", "fast → quick"]
  },
  {
    id: 2,
    name: "Position Tracker",
    specialization: "Sequential Order",
    description: "Tracks word positions and sequential dependencies",
    color: "bg-purple-500",
    focusPattern: 'positional',
    strength: 0.92,
    examples: ["first → second", "beginning → end", "1 → 2 → 3"]
  },
  {
    id: 3,
    name: "Context Builder",
    specialization: "Long Dependencies",
    description: "Maintains context across long sequences",
    color: "bg-orange-500",
    focusPattern: 'causal',
    strength: 0.71,
    examples: ["John ... he", "story → conclusion", "cause → effect"]
  },
  {
    id: 4,
    name: "Detail Focuser",
    specialization: "Local Attention",
    description: "Focuses on immediate neighboring words",
    color: "bg-red-500",
    focusPattern: 'mixed',
    strength: 0.66,
    examples: ["the → cat", "very → big", "is → running"]
  },
  {
    id: 5,
    name: "Global Coordinator",
    specialization: "Overall Coherence",
    description: "Maintains global sentence coherence",
    color: "bg-teal-500",
    focusPattern: 'mixed',
    strength: 0.58,
    examples: ["sentence → unity", "topic → consistency", "flow → logic"]
  }
];

export function HeadSpecializationDemo({
  sentence = "The quick brown fox jumps over the lazy dog",
  numHeads = 6,
  onHeadSelect,
  onComplete
}: HeadSpecializationDemoProps) {
  const [selectedHead, setSelectedHead] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedHeads, setComparedHeads] = useState<[number, number]>([0, 1]);
  const [playbackSpeed, setPlaybackSpeed] = useState([2000]);
  const [insights, setInsights] = useState<string[]>([]);

  const words = sentence.split(' ');
  const activeHeads = HEAD_SPECIALIZATIONS.slice(0, numHeads);

  // Generate specialized attention patterns for each head
  const generateHeadAttention = (head: AttentionHead, words: string[]): number[][] => {
    const numWords = words.length;
    const attention: number[][] = [];

    for (let i = 0; i < numWords; i++) {
      const row: number[] = [];
      for (let j = 0; j < numWords; j++) {
        let weight = 0.05 + Math.random() * 0.1; // Base noise

        // Head-specific attention patterns
        switch (head.focusPattern) {
          case 'syntax':
            // Focus on grammatical relationships
            if (isGrammaticalPair(words[i], words[j])) weight += 0.6;
            if (i === j) weight += 0.3; // Self-attention
            break;

          case 'semantic':
            // Focus on semantic similarity
            if (areSemanticallySimilar(words[i], words[j])) weight += 0.7;
            if (i === j) weight += 0.2;
            break;

          case 'positional':
            // Focus on positional relationships
            const distance = Math.abs(i - j);
            if (distance === 1) weight += 0.5; // Adjacent words
            if (distance === 2) weight += 0.3; // Skip-gram
            if (i === j) weight += 0.8; // Strong self-attention
            break;

          case 'causal':
            // Focus on causal/temporal relationships
            if (j <= i) weight += 0.4; // Can only attend to past
            if (i === numWords - 1 && j < i) weight += 0.6; // Final word attends to all
            break;

          case 'mixed':
            // Mixed attention patterns
            if (i === j) weight += 0.4;
            if (Math.abs(i - j) <= 2) weight += 0.3;
            if (words[i].length > 4 && words[j].length > 4) weight += 0.2;
            break;
        }

        row.push(Math.min(weight * head.strength, 1.0));
      }
      attention.push(row);
    }

    return attention;
  };

  // Helper functions for pattern detection
  const isGrammaticalPair = (word1: string, word2: string): boolean => {
    const articles = ['the', 'a', 'an'];
    const nouns = ['cat', 'dog', 'fox', 'house', 'book'];
    const verbs = ['run', 'jump', 'sit', 'eat', 'sleep'];
    const adjectives = ['quick', 'brown', 'lazy', 'big', 'small'];

    return (articles.includes(word1.toLowerCase()) && nouns.includes(word2.toLowerCase())) ||
           (adjectives.includes(word1.toLowerCase()) && nouns.includes(word2.toLowerCase())) ||
           (nouns.includes(word1.toLowerCase()) && verbs.includes(word2.toLowerCase()));
  };

  const areSemanticallySimilar = (word1: string, word2: string): boolean => {
    const semanticGroups = [
      ['quick', 'fast', 'rapid'],
      ['brown', 'color', 'dark'],
      ['fox', 'dog', 'animal'],
      ['jumps', 'runs', 'moves'],
      ['lazy', 'slow', 'tired']
    ];

    return semanticGroups.some(group => 
      group.includes(word1.toLowerCase()) && group.includes(word2.toLowerCase())
    );
  };

  // Auto-play through heads
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (selectedHead < numHeads - 1) {
        setSelectedHead(selectedHead + 1);
      } else {
        setSelectedHead(0);
        setCurrentStep(currentStep + 1);
        
        if (currentStep >= 2) {
          setIsPlaying(false);
          const demoInsights = [
            "Different heads focus on different linguistic aspects",
            "Syntax heads track grammatical relationships",
            "Semantic heads connect related meanings",
            "Position heads maintain sequential order",
            "Combined heads create rich representations"
          ];
          setInsights(demoInsights);
          onComplete?.(demoInsights);
        }
      }
    }, playbackSpeed[0]);

    return () => clearTimeout(timer);
  }, [isPlaying, selectedHead, numHeads, currentStep, playbackSpeed, onComplete]);

  const currentHead = activeHeads[selectedHead];
  const attentionMatrix = useMemo(() => 
    generateHeadAttention(currentHead, words), 
    [currentHead, words]
  );

  const handleHeadSelect = (headId: number) => {
    setSelectedHead(headId);
    onHeadSelect?.(headId);
  };

  const AttentionVisualization = ({ 
    head, 
    attention, 
    title 
  }: { 
    head: AttentionHead; 
    attention: number[][]; 
    title: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full ${head.color}`} />
        <h4 className="font-medium text-gray-800">{title}</h4>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="grid gap-1 mb-3" style={{ gridTemplateColumns: `repeat(${words.length}, 1fr)` }}>
          {words.map((word, idx) => (
            <div key={idx} className="text-xs text-center font-medium text-gray-700 p-1">
              {word}
            </div>
          ))}
        </div>
        
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${words.length}, 1fr)` }}>
          {attention.flat().map((weight, idx) => {
            const row = Math.floor(idx / words.length);
            const col = idx % words.length;
            const intensity = weight;
            
            return (
              <div
                key={idx}
                className="aspect-square rounded border cursor-pointer transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: `${head.color.replace('bg-', 'rgba(').replace('-500', '')}, ${intensity})`,
                  minWidth: '20px',
                  minHeight: '20px'
                }}
                title={`${words[row]} → ${words[col]}: ${(weight * 100).toFixed(1)}%`}
              />
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>From (rows)</span>
          <span>To (columns)</span>
        </div>
      </div>
    </div>
  );

  const HeadCard = ({ head, isSelected, onClick }: { 
    head: AttentionHead; 
    isSelected: boolean; 
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`
        p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-blue-400 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${head.color}`} />
          <span className="font-medium text-sm">{head.name}</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {Math.round(head.strength * 100)}%
        </Badge>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        {head.specialization}
      </div>
      
      <div className="text-xs text-gray-500">
        {head.description}
      </div>
      
      <div className="mt-2">
        <div className="text-xs font-medium text-gray-600 mb-1">Examples:</div>
        <div className="flex flex-wrap gap-1">
          {head.examples.slice(0, 2).map((example, idx) => (
            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              {example}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Head Specialization Demo
            <Badge variant="secondary">{numHeads} heads active</Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Auto-tour'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedHead(0);
                setCurrentStep(0);
                setIsPlaying(false);
                setInsights([]);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Explore how different attention heads specialize in different aspects of language understanding
        </div>
        
        {isPlaying && (
          <div className="flex items-center gap-4 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Auto-touring heads... Currently viewing: {currentHead.name}</span>
            <div className="flex items-center gap-2 ml-auto">
              <span>Speed:</span>
              <Slider
                value={playbackSpeed}
                onValueChange={setPlaybackSpeed}
                min={1000}
                max={4000}
                step={500}
                className="w-24"
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Sentence */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Analysis Target</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {words.map((word, idx) => (
              <div key={idx} className="bg-white px-3 py-2 rounded border">
                <span className="font-medium">{word}</span>
                <Badge variant="secondary" className="ml-1 text-xs">{idx}</Badge>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual Heads</TabsTrigger>
            <TabsTrigger value="comparison">Head Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            {/* Head Selection Grid */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-medium text-gray-800">
                <Users className="w-4 h-4" />
                Attention Head Specialists
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeHeads.map((head) => (
                  <HeadCard
                    key={head.id}
                    head={head}
                    isSelected={selectedHead === head.id}
                    onClick={() => handleHeadSelect(head.id)}
                  />
                ))}
              </div>
            </div>

            {/* Current Head Visualization */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-medium text-gray-800">
                  <Eye className="w-4 h-4" />
                  {currentHead.name} - Attention Pattern
                </h3>
                
                <div className="text-sm text-gray-600">
                  Focus: {currentHead.focusPattern}
                </div>
              </div>
              
              <AttentionVisualization
                head={currentHead}
                attention={attentionMatrix}
                title={`${currentHead.name} Attention`}
              />
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">What This Head Looks For</span>
                </div>
                <p className="text-sm text-blue-700 mb-3">{currentHead.description}</p>
                
                <div className="space-y-2">
                  <div className="font-medium text-blue-800 text-sm">Example Patterns:</div>
                  <div className="flex flex-wrap gap-2">
                    {currentHead.examples.map((example, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            {/* Head Comparison Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Head A
                </label>
                <select
                  value={comparedHeads[0]}
                  onChange={(e) => setComparedHeads([parseInt(e.target.value), comparedHeads[1]])}
                  className="w-full p-2 border rounded-md"
                >
                  {activeHeads.map((head) => (
                    <option key={head.id} value={head.id}>
                      {head.name} - {head.specialization}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Head B
                </label>
                <select
                  value={comparedHeads[1]}
                  onChange={(e) => setComparedHeads([comparedHeads[0], parseInt(e.target.value)])}
                  className="w-full p-2 border rounded-md"
                >
                  {activeHeads.map((head) => (
                    <option key={head.id} value={head.id}>
                      {head.name} - {head.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-side Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <AttentionVisualization
                head={activeHeads[comparedHeads[0]]}
                attention={generateHeadAttention(activeHeads[comparedHeads[0]], words)}
                title={activeHeads[comparedHeads[0]].name}
              />
              
              <AttentionVisualization
                head={activeHeads[comparedHeads[1]]}
                attention={generateHeadAttention(activeHeads[comparedHeads[1]], words)}
                title={activeHeads[comparedHeads[1]].name}
              />
            </div>

            {/* Comparison Analysis */}
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <GitMerge className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800">Head Comparison Analysis</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${activeHeads[comparedHeads[0]].color}`} />
                    <span className="font-medium">{activeHeads[comparedHeads[0]].name}</span>
                  </div>
                  <div className="text-purple-700">
                    Focus: {activeHeads[comparedHeads[0]].focusPattern}
                  </div>
                  <div className="text-purple-600 text-xs">
                    {activeHeads[comparedHeads[0]].description}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${activeHeads[comparedHeads[1]].color}`} />
                    <span className="font-medium">{activeHeads[comparedHeads[1]].name}</span>
                  </div>
                  <div className="text-purple-700">
                    Focus: {activeHeads[comparedHeads[1]].focusPattern}
                  </div>
                  <div className="text-purple-600 text-xs">
                    {activeHeads[comparedHeads[1]].description}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-medium text-gray-800">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Key Insights About Head Specialization
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

export default HeadSpecializationDemo;