"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PanelContainer } from "./PanelContainer";
import { EducationalTooltip } from "@/components/educational/EducationalTooltip";
import { getTooltipContent } from "@/lib/educational-tooltips";
import { MapPin, ArrowRight, Shuffle, Theater, BookOpen, Zap } from "lucide-react";

interface PositionalEncodingsPanelProps {
  usePositional: boolean;
  onPositionalChange: (usePositional: boolean) => void;
  onInteraction: () => void;
}

export function PositionalEncodingsPanel({
  usePositional,
  onPositionalChange,
  onInteraction,
}: PositionalEncodingsPanelProps) {
  const [showWordOrderDemo, setShowWordOrderDemo] = useState(false);
  const [selectedExample, setSelectedExample] = useState(0);
  const [showPatternVisualizer, setShowPatternVisualizer] = useState(false);

  const handleToggle = (checked: boolean) => {
    onPositionalChange(checked);
    onInteraction();
  };

  const wordOrderExamples = [
    { normal: "cat chased dog", scrambled: "dog chased cat", meaning: "Completely different meaning!" },
    { normal: "I love you", scrambled: "love you I", meaning: "Different emphasis/style" },
    { normal: "The red car", scrambled: "car red the", meaning: "Grammatically incorrect" },
  ];

  const generateSinePattern = (position: number, dimension: number) => {
    const frequency = 1 / Math.pow(10000, 2 * dimension / 512);
    return Math.sin(position * frequency);
  };

  const generateCosinePattern = (position: number, dimension: number) => {
    const frequency = 1 / Math.pow(10000, 2 * dimension / 512);
    return Math.cos(position * frequency);
  };

  return (
    <PanelContainer
      title="Positional Encodings"
      icon={<MapPin className="w-5 h-5" />}
      description="Add position information to token embeddings"
    >
      <div className="space-y-4">
        {/* Enhanced Toggle Control with State Indicator */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <EducationalTooltip
                content={getTooltipContent('positional-encodings', 'positionalToggle')!}
                placement="top"
                size="md"
              >
                <div className="text-sm font-medium text-gray-800">
                  Enable Positional Encodings
                </div>
              </EducationalTooltip>
              <div className={`w-2 h-2 rounded-full ${
                usePositional ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            <div className="text-xs text-muted-foreground">
              Adds sin/cos position information to embeddings
            </div>
          </div>
          <Switch
            checked={usePositional}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* Before/After Comparison Visualization */}
        <div className="border rounded-lg p-4">
          <EducationalTooltip
            content={getTooltipContent('positional-encodings', 'beforeAfterComparison')!}
            placement="top"
            size="md"
          >
            <div className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Before vs After Comparison
            </div>
          </EducationalTooltip>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Without Positions */}
            <div className={`p-3 rounded-lg border-2 transition-all ${
              !usePositional ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-red-500">✗</span> Without Positions
              </div>
              <div className="space-y-1">
                {['The', 'cat', 'sat'].map((token, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-8 h-6 bg-gray-300 rounded text-xs flex items-center justify-center">
                      ?
                    </div>
                    <span className="text-xs text-gray-600">{token}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                ✗ No grammar<br/>
                ✗ No word order<br/>
                ✗ No structure
              </div>
            </div>

            {/* With Positions */}
            <div className={`p-3 rounded-lg border-2 transition-all ${
              usePositional ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <span className="text-green-500">✓</span> With Positions
              </div>
              <div className="space-y-1">
                {['The', 'cat', 'sat'].map((token, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-8 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded text-white text-xs flex items-center justify-center font-bold">
                      {idx}
                    </div>
                    <span className="text-xs text-gray-700">{token}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-green-600 mt-2">
                ✓ Understands grammar<br/>
                ✓ Knows word order<br/>
                ✓ Maintains structure
              </div>
            </div>
          </div>
        </div>

        {/* Word Order Demo */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <EducationalTooltip
              content={getTooltipContent('positional-encodings', 'wordOrderDemo')!}
              placement="top"
              size="md"
            >
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <Shuffle className="w-4 h-4" />
                Word Order Demo
              </div>
            </EducationalTooltip>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowWordOrderDemo(!showWordOrderDemo)}
            >
              {showWordOrderDemo ? 'Hide' : 'Show'} Demo
            </Button>
          </div>

          {showWordOrderDemo && (
            <div className="space-y-3">
              <div className="text-xs text-gray-600 mb-3">
                See how word order affects meaning when positions are understood:
              </div>
              
              {wordOrderExamples.map((example, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    selectedExample === idx ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedExample(idx)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-green-700">"{example.normal}"</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-mono text-red-700">"{example.scrambled}"</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 italic">{example.meaning}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theater Seat Analogy */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
            <Theater className="w-4 h-4" />
            Think of it like Theater Seats
          </div>
          <div className="text-xs text-purple-800 space-y-2">
            <div>• Each word is like a person in a theater</div>
            <div>• Without seat numbers: chaos! No one knows their role</div>
            <div>• With seat numbers: everyone knows exactly where they belong</div>
            <div>• Position encodings are like seat numbers for words</div>
          </div>
        </div>

        {/* Interactive Position Pattern Visualizer */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <EducationalTooltip
              content={getTooltipContent('positional-encodings', 'patternVisualizer')!}
              placement="top"
              size="md"
            >
              <div className="text-sm font-medium text-gray-800">
                Position Pattern Visualizer
              </div>
            </EducationalTooltip>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPatternVisualizer(!showPatternVisualizer)}
            >
              {showPatternVisualizer ? 'Hide' : 'Show'} Patterns
            </Button>
          </div>

          {showPatternVisualizer && (
            <div className="space-y-3">
              <div className="text-xs text-gray-600 mb-3">
                Each position gets a unique sine/cosine pattern across different dimensions:
              </div>
              
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 8 }, (_, pos) => (
                  <div key={pos} className="text-center">
                    <div className="text-xs font-medium text-gray-700 mb-1">Pos {pos}</div>
                    <div className="space-y-1">
                      {Array.from({ length: 4 }, (_, dim) => {
                        const sineValue = generateSinePattern(pos, dim * 2);
                        const cosineValue = generateCosinePattern(pos, dim * 2 + 1);
                        const intensity = Math.abs(sineValue + cosineValue) / 2;
                        return (
                          <div key={dim} className="flex gap-0.5">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                                border: '1px solid rgba(59, 130, 246, 0.3)'
                              }}
                              title={`Sine: ${sineValue.toFixed(2)}`}
                            />
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: `rgba(147, 51, 234, ${intensity})`,
                                border: '1px solid rgba(147, 51, 234, 0.3)'
                              }}
                              title={`Cosine: ${cosineValue.toFixed(2)}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Sine values
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Cosine values
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Try This Section */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-sm font-medium text-yellow-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Try This!
          </div>
          <div className="text-xs text-yellow-800 space-y-1">
            <div>1. Toggle positions ON/OFF and watch the attention change</div>
            <div>2. Compare how "The cat sat" vs "sat cat The" would be processed</div>
            <div>3. Notice how grammar understanding improves with positions</div>
          </div>
        </div>

        {/* Quick Status Summary */}
        <div className={`p-3 rounded-lg border transition-all ${
          usePositional 
            ? "bg-green-50 border-green-200" 
            : "bg-orange-50 border-orange-200"
        }`}>
          <div className={`text-sm font-medium ${
            usePositional ? "text-green-900" : "text-orange-900"
          }`}>
            Current Status: {usePositional ? "Positions Enabled ✓" : "Positions Disabled ✗"}
          </div>
          <div className={`text-xs mt-1 ${
            usePositional ? "text-green-800" : "text-orange-800"
          }`}>
            {usePositional 
              ? "Model can understand word order and grammar structure"
              : "Model treats words as an unordered bag - no grammar understanding"
            }
          </div>
        </div>
      </div>
    </PanelContainer>
  );
}