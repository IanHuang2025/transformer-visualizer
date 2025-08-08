"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { PanelContainer } from "./PanelContainer";
import { Brain, Eye, Users, Target, Zap, AlertTriangle, Lightbulb, Play, GitMerge, Info } from "lucide-react";

interface AttentionHeadsPanelProps {
  heads: number;
  onHeadsChange: (heads: number) => void;
}

// Color palette for each head
const HEAD_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-red-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'
];

const HEAD_PRESETS = [
  { value: 1, label: 'Simple', description: 'Single attention focus', performance: 'Fast' },
  { value: 3, label: 'Balanced', description: 'Recommended for learning', performance: 'Good' },
  { value: 6, label: 'Production', description: 'Real-world models', performance: 'Moderate' },
  { value: 8, label: 'Maximum', description: 'Complex patterns', performance: 'Slow' }
];

const HEAD_SPECIALIZATIONS = [
  { pattern: 'Subjects & Objects', description: 'Identifies who/what in sentences', example: 'The cat → sat' },
  { pattern: 'Verb Relations', description: 'Tracks action relationships', example: 'will → eat → tomorrow' },
  { pattern: 'Syntax Structure', description: 'Grammatical dependencies', example: 'the → big → house' },
  { pattern: 'Long Dependencies', description: 'Distant word connections', example: 'beginning ↔ end' },
  { pattern: 'Positional Patterns', description: 'Word order relationships', example: 'first → second → third' },
  { pattern: 'Semantic Similarity', description: 'Related concepts', example: 'king → queen → royal' },
  { pattern: 'Coreference', description: 'Pronoun resolution', example: 'John → he → his' },
  { pattern: 'Attention Focus', description: 'Context prioritization', example: 'important words' }
];

export function AttentionHeadsPanel({
  heads,
  onHeadsChange,
}: AttentionHeadsPanelProps) {
  const [selectedHead, setSelectedHead] = useState(0);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [showEducational, setShowEducational] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<[number, number]>([0, 1]);
  
  const d_k = 4; // Fixed head dimension
  const d_model = heads * d_k;

  const handleHeadsChange = (value: number[]) => {
    onHeadsChange(value[0]);
    // Reset selected head if it's beyond the new range
    if (selectedHead >= value[0]) {
      setSelectedHead(0);
    }
  };

  const handlePresetSelect = (preset: number) => {
    onHeadsChange(preset);
    setSelectedHead(0);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Fast': return 'text-green-600 bg-green-50';
      case 'Good': return 'text-blue-600 bg-blue-50';
      case 'Moderate': return 'text-orange-600 bg-orange-50';
      case 'Slow': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <PanelContainer
      title="Multi-Head Attention Setup"
      icon={<Brain className="w-5 h-5" />}
      description="Configure attention heads with specialized pattern detection"
      defaultExpanded={true}
    >
      <div className="space-y-6">
        {/* Quick Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Quick Presets
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEducational(!showEducational)}
              className="text-xs"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              {showEducational ? 'Hide' : 'Learn More'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {HEAD_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                variant={heads === preset.value ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetSelect(preset.value)}
                className="flex flex-col p-3 h-auto"
              >
                <div className="font-medium">{preset.label}</div>
                <div className="text-xs text-muted-foreground">{preset.description}</div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs mt-1 ${getPerformanceColor(preset.performance)}`}
                >
                  {preset.performance}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Heads Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Number of Attention Heads
            </label>
            <div className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              {heads}
            </div>
          </div>
          
          <Slider
            value={[heads]}
            onValueChange={handleHeadsChange}
            min={1}
            max={8}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
          </div>
          
          {/* Performance Warning */}
          {heads > 6 && (
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Performance Impact</span>
              </div>
              <div className="text-orange-700 text-xs mt-1">
                High head counts may slow down visualization. Consider using fewer heads for better performance.
              </div>
            </div>
          )}
        </div>

        {/* Head Selector Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Head Inspector
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">Compare Mode</label>
              <Switch
                checked={comparisonMode}
                onCheckedChange={setComparisonMode}
              />
            </div>
          </div>

          {!comparisonMode ? (
            <Tabs value={selectedHead.toString()} onValueChange={(v) => setSelectedHead(parseInt(v))}>
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${heads}, 1fr)` }}>
                {Array.from({ length: heads }, (_, i) => (
                  <TabsTrigger key={i} value={i.toString()} className="relative">
                    <div className={`w-2 h-2 rounded-full ${HEAD_COLORS[i]} mr-1`} />
                    Head {i}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Array.from({ length: heads }, (_, i) => (
                <TabsContent key={i} value={i.toString()}>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-4 h-4 rounded-full ${HEAD_COLORS[i]}`} />
                      <span className="font-medium">Head {i} Specialization</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Focus Pattern: </span>
                        <span className="text-gray-600">
                          {HEAD_SPECIALIZATIONS[i]?.pattern || 'General Attention'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Description: </span>
                        <span className="text-gray-600">
                          {HEAD_SPECIALIZATIONS[i]?.description || 'Learns diverse attention patterns'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Example: </span>
                        <span className="text-gray-600 font-mono text-xs bg-white px-2 py-1 rounded">
                          {HEAD_SPECIALIZATIONS[i]?.example || 'word → word'}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Compare Head A</label>
                  <select 
                    value={selectedComparison[0]}
                    onChange={(e) => setSelectedComparison([parseInt(e.target.value), selectedComparison[1]])}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {Array.from({ length: heads }, (_, i) => (
                      <option key={i} value={i}>Head {i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Compare Head B</label>
                  <select 
                    value={selectedComparison[1]}
                    onChange={(e) => setSelectedComparison([selectedComparison[0], parseInt(e.target.value)])}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {Array.from({ length: heads }, (_, i) => (
                      <option key={i} value={i}>Head {i}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <GitMerge className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900">Head Comparison</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${HEAD_COLORS[selectedComparison[0]]}`} />
                      <span className="font-medium">Head {selectedComparison[0]}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {HEAD_SPECIALIZATIONS[selectedComparison[0]]?.pattern || 'General Attention'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${HEAD_COLORS[selectedComparison[1]]}`} />
                      <span className="font-medium">Head {selectedComparison[1]}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {HEAD_SPECIALIZATIONS[selectedComparison[1]]?.pattern || 'General Attention'}
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-white rounded border text-xs text-gray-600">
                  <Info className="w-3 h-3 inline mr-1" />
                  Compare how different heads attend to different parts of your input text.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Educational Content */}
        {showEducational && (
          <div className="space-y-4 border-t pt-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">What are Attention Heads?</span>
              </div>
              <div className="text-sm text-green-800 space-y-2">
                <p>
                  Think of attention heads as a team of specialists, each focusing on different aspects 
                  of language understanding.
                </p>
                <div className="bg-white/70 p-3 rounded border">
                  <div className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team of Specialists Analogy
                  </div>
                  <ul className="text-xs space-y-1">
                    <li><strong>Head 0 (Grammar Expert):</strong> &ldquo;I focus on subjects and objects&rdquo;</li>
                    <li><strong>Head 1 (Syntax Specialist):</strong> &ldquo;I track verb relationships&rdquo;</li>
                    <li><strong>Head 2 (Context Master):</strong> &ldquo;I handle long-distance dependencies&rdquo;</li>
                    <li><strong>Head 3 (Meaning Guru):</strong> &ldquo;I find semantic connections&rdquo;</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Why Multiple Heads Matter</span>
              </div>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  Multiple heads allow the model to attend to different positions and representations 
                  simultaneously, creating a richer understanding.
                </p>
                <div className="bg-white/70 p-3 rounded border">
                  <div className="text-xs space-y-2">
                    <div><strong>Single Head:</strong> &ldquo;The cat sat on the mat&rdquo; → limited focus</div>
                    <div><strong>Multiple Heads:</strong> &ldquo;The cat sat on the mat&rdquo; → Head 0 sees (The→cat), Head 1 sees (cat→sat), Head 2 sees (sat→on→mat)</div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                // Demo functionality - cycle through different head configurations
                const demoSequence = [1, 2, 4, 6, 3];
                let currentIndex = 0;
                const interval = setInterval(() => {
                  if (currentIndex < demoSequence.length) {
                    onHeadsChange(demoSequence[currentIndex]);
                    currentIndex++;
                  } else {
                    clearInterval(interval);
                  }
                }, 1500);
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              See How Heads Specialize (Demo)
            </Button>
          </div>
        )}

        {/* Model Dimensions Info */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Head Dimension</div>
              <div className="text-gray-600 font-mono">d_k = {d_k}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Model Dimension</div>
              <div className="text-gray-600 font-mono">d_model = {d_model}</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            d_model = heads × d_k = {heads} × {d_k} = {d_model}
          </div>
        </div>

        {/* Active Heads Visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active Heads</span>
            <span className="text-xs text-gray-500">{heads} of 8 heads</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: heads }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 ${HEAD_COLORS[i]} text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm hover:scale-110 transition-transform cursor-pointer ${selectedHead === i ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
                onClick={() => setSelectedHead(i)}
                title={`Head ${i}: ${HEAD_SPECIALIZATIONS[i]?.pattern || 'General Attention'}`}
              >
                {i}
              </div>
            ))}
            {Array.from({ length: 8 - heads }, (_, i) => (
              <div
                key={i + heads}
                className="w-8 h-8 bg-gray-200 text-gray-400 text-xs rounded-full flex items-center justify-center opacity-50"
                title="Inactive head"
              >
                {i + heads}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelContainer>
  );
}