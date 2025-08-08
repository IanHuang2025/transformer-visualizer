"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PanelContainer } from "./PanelContainer";
import { Type, BookOpen, Lightbulb, Info, Sparkles, BarChart3, Target } from "lucide-react";

// Enhanced preset structure with educational content
interface EducationalPreset {
  id: string;
  text: string;
  title: string;
  description: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Simple Relationships' | 'Ambiguity Resolution' | 'Code Structure' | 'Complex Dependencies' | 'Contextual Understanding' | 'Syntactic Parsing';
  whyInteresting: string;
  keyPhenomena: string[];
  expectedPatterns: string[];
  tokenCount?: number;
}

interface SentenceSettingsPanelProps {
  preset: string;
  text: string;
  presets?: Array<{ id: string; text: string }>; // Legacy support
  onPresetChange: (preset: string) => void;
  onTextChange: (text: string) => void;
  onLoadPreset: () => void;
  onTextInteraction: () => void;
}

// Comprehensive preset data with educational value
const EDUCATIONAL_PRESETS: EducationalPreset[] = [
  {
    id: "cat",
    text: "The cat sat on the mat",
    title: "Simple Subject-Verb-Object",
    description: "Classic example showing basic grammatical relationships",
    complexity: "Beginner",
    category: "Simple Relationships",
    whyInteresting: "Perfect for understanding how attention connects subjects with verbs and objects. Shows clear syntactic dependencies.",
    keyPhenomena: ["Subject-verb agreement", "Prepositional phrase attachment", "Article-noun relationships"],
    expectedPatterns: ["'cat' will attend to 'sat'", "Articles will attend to their nouns", "'sat' will connect to both subject and location"]
  },
  {
    id: "bank",
    text: "I saw a bank by the river",
    title: "Lexical Ambiguity Resolution",
    description: "Demonstrates how context resolves word meanings",
    complexity: "Intermediate",
    category: "Ambiguity Resolution",
    whyInteresting: "'Bank' can mean financial institution or riverbank. Context from 'river' helps resolve the ambiguity through attention patterns.",
    keyPhenomena: ["Contextual disambiguation", "Semantic coherence", "Long-range dependencies"],
    expectedPatterns: ["'bank' will attend strongly to 'river'", "Context words influence ambiguous terms", "Semantic relationships emerge in attention"]
  },
  {
    id: "code",
    text: "if ( x > 0 ) { return y }",
    title: "Code Structure Parsing",
    description: "Shows attention patterns in programming syntax",
    complexity: "Advanced",
    category: "Code Structure",
    whyInteresting: "Programming languages have different syntax rules. Attention learns to connect matching brackets, operators, and control flow structures.",
    keyPhenomena: ["Bracket matching", "Operator precedence", "Control flow understanding"],
    expectedPatterns: ["Opening brackets attend to closing brackets", "Variables connect to their operations", "Control structures show hierarchical patterns"]
  },
  {
    id: "complex",
    text: "The student who studies hard will succeed",
    title: "Relative Clause Dependencies",
    description: "Complex sentence with embedded clause structure",
    complexity: "Advanced",
    category: "Complex Dependencies",
    whyInteresting: "Relative clauses create long-distance dependencies. 'who' refers back to 'student', and the main verb 'will' connects across the embedded clause.",
    keyPhenomena: ["Relative pronoun resolution", "Embedded clause processing", "Long-distance dependencies"],
    expectedPatterns: ["'who' strongly attends to 'student'", "Main subject connects to main verb across clause", "Embedded elements show local cohesion"]
  },
  {
    id: "context",
    text: "She couldn't see the forest for the trees",
    title: "Idiomatic Expression Understanding",
    description: "Metaphorical language requiring contextual understanding",
    complexity: "Intermediate",
    category: "Contextual Understanding",
    whyInteresting: "Idiomatic expressions don't follow literal meaning. Attention patterns reveal how models handle figurative language and word associations.",
    keyPhenomena: ["Idiomatic processing", "Non-literal meaning", "Semantic cohesion"],
    expectedPatterns: ["'forest' and 'trees' show strong mutual attention", "Function words connect idiom components", "Overall coherence despite non-literal meaning"]
  },
  {
    id: "nested",
    text: "The book that I read yesterday was amazing",
    title: "Nested Syntactic Structure",
    description: "Multiple levels of syntactic embedding and modification",
    complexity: "Advanced",
    category: "Syntactic Parsing",
    whyInteresting: "Multiple layers of modification create complex dependency trees. Shows how attention handles nested grammatical structures.",
    keyPhenomena: ["Syntactic nesting", "Temporal modification", "Predicate-argument structure"],
    expectedPatterns: ["'book' connects to both 'read' and 'amazing'", "Temporal adverbs modify appropriate verbs", "Nested structures show hierarchical attention"]
  }
];

export function SentenceSettingsPanel({
  preset,
  text,
  presets, // Legacy support
  onPresetChange,
  onTextChange,
  onLoadPreset,
  onTextInteraction,
}: SentenceSettingsPanelProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Use enhanced presets or fall back to legacy
  const availablePresets = useMemo(() => {
    if (presets && presets.length > 0) {
      // Legacy mode - convert simple presets to enhanced format
      return presets.map(p => ({
        id: p.id,
        text: p.text,
        title: p.text,
        description: "Classic example",
        complexity: "Beginner" as const,
        category: "Simple Relationships" as const,
        whyInteresting: "Basic example for understanding attention patterns.",
        keyPhenomena: ["Basic relationships"],
        expectedPatterns: ["Standard attention patterns"]
      }));
    }
    return EDUCATIONAL_PRESETS;
  }, [presets]);
  
  // Find current preset data
  const currentPresetData = availablePresets.find(p => p.id === preset);
  
  // Token analysis
  const tokens = text.trim().split(/\s+/).filter(t => t.length > 0);
  const tokenCount = tokens.length;
  const isWithinLimit = tokenCount <= 16;
  
  // Complexity analysis
  const getComplexityLevel = (text: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    const tokenCount = text.split(/\s+/).length;
    const hasPunctuation = /[{}()<>\[\],.!?;:]/.test(text);
    const hasComplexWords = text.split(/\s+/).some(word => word.length > 8);
    
    if (tokenCount > 10 || (hasPunctuation && hasComplexWords)) return 'Advanced';
    if (tokenCount > 6 || hasPunctuation || hasComplexWords) return 'Intermediate';
    return 'Beginner';
  };
  
  const currentComplexity = getComplexityLevel(text);
  
  // Token type analysis
  const analyzeTokenTypes = (tokens: string[]) => {
    const functionWords = ['the', 'a', 'an', 'and', 'or', 'but', 'if', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'that', 'who', 'which', 'will', 'can', 'could', 'would', 'should'];
    const punctuation = /[{}()<>\[\],.!?;:]/;
    
    return tokens.map(token => {
      if (punctuation.test(token)) return 'punctuation';
      if (functionWords.includes(token.toLowerCase())) return 'function';
      return 'content';
    });
  };
  
  const tokenTypes = analyzeTokenTypes(tokens);
  const typeDistribution = {
    content: tokenTypes.filter(t => t === 'content').length,
    function: tokenTypes.filter(t => t === 'function').length,
    punctuation: tokenTypes.filter(t => t === 'punctuation').length
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTextChange(e.target.value);
    onTextInteraction();
  };
  
  const handlePresetSelect = (presetId: string) => {
    onPresetChange(presetId);
    setShowAnalysis(true); // Show analysis when a preset is selected
  };
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <PanelContainer
      title="Sentence & Text Settings"
      icon={<Type className="w-5 h-5" />}
      description="Configure input text and explore educational examples with detailed analysis"
      defaultExpanded={true}
    >
      <div className="space-y-6">
        
        {/* Purpose & Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Why Text Selection Matters</h3>
              <p className="text-xs text-blue-800 mb-3 leading-relaxed">
                Different sentences reveal different attention patterns. Choose examples that demonstrate specific linguistic phenomena, 
                or type your own to explore how transformers process various types of text structure.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Syntactic Relationships</Badge>
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Semantic Dependencies</Badge>
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Context Resolution</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Preset Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Educational Examples
            </label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs"
            >
              {showSuggestions ? 'Hide' : 'Show'} Suggestions
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select value={preset} onValueChange={handlePresetSelect}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose an educational example..." />
              </SelectTrigger>
              <SelectContent className="max-w-md">
                {availablePresets.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="py-3">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{p.title}</span>
                        <Badge className={`text-xs ${getComplexityColor(p.complexity)}`}>
                          {p.complexity}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{p.text}</div>
                      <div className="text-xs text-muted-foreground">{p.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={onLoadPreset}>
              Load
            </Button>
          </div>
          
          {/* Preset Analysis - Show when preset is selected */}
          {currentPresetData && showAnalysis && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-green-900">{currentPresetData.title}</h4>
                    <Badge className={`${getComplexityColor(currentPresetData.complexity)} text-xs`}>
                      {currentPresetData.complexity}
                    </Badge>
                  </div>
                  <p className="text-xs text-green-800 mb-3">{currentPresetData.whyInteresting}</p>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <h5 className="text-xs font-medium text-green-900 mb-1">Key Phenomena:</h5>
                      <ul className="text-xs text-green-700 space-y-0.5">
                        {currentPresetData.keyPhenomena.map((phenomenon, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            {phenomenon}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-green-900 mb-1">Expected Patterns:</h5>
                      <ul className="text-xs text-green-700 space-y-0.5">
                        {currentPresetData.expectedPatterns.map((pattern, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Text Input with Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Or type your own sentence
            </label>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getComplexityColor(currentComplexity)}`}>
                {currentComplexity}
              </Badge>
              <Badge variant={isWithinLimit ? "default" : "destructive"} className="text-xs">
                {tokenCount}/16 tokens
              </Badge>
            </div>
          </div>
          
          <Input
            value={text}
            onChange={handleTextChange}
            placeholder="Type a sentence to analyze its attention patterns..."
            className={`w-full ${!isWithinLimit ? 'border-red-300 focus:border-red-500' : ''}`}
          />
          
          {!isWithinLimit && (
            <div className="text-xs text-red-600 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Sentence too long. Please use 16 tokens or fewer for optimal visualization.
            </div>
          )}
          
          {/* Live Token Analysis */}
          {tokenCount > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Live Token Analysis</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="text-xs h-6"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  {showAnalysis ? 'Hide' : 'Show'} Details
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {tokens.map((token, idx) => {
                  const type = tokenTypes[idx];
                  const typeColor = type === 'content' ? 'bg-blue-100 text-blue-800' : 
                                  type === 'function' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';
                  return (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <Badge className={`text-xs ${typeColor} cursor-help`}>
                          {idx}:{token}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div className="font-medium capitalize">{type} Word</div>
                          <div>Position: {idx + 1}/{tokenCount}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              
              {showAnalysis && (
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-medium text-blue-900">{typeDistribution.content}</div>
                    <div className="text-blue-700">Content Words</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="font-medium text-yellow-900">{typeDistribution.function}</div>
                    <div className="text-yellow-700">Function Words</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium text-gray-900">{typeDistribution.punctuation}</div>
                    <div className="text-gray-700">Punctuation</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive Tips & Suggestions */}
        {showSuggestions && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-purple-900 mb-2">Try These Experiments</h4>
                <div className="space-y-2 text-xs text-purple-800">
                  <div><strong>Beginners:</strong> Start with &quot;The cat sat on the mat&quot; to understand basic subject-verb-object relationships.</div>
                  <div><strong>Intermediate:</strong> Try &quot;I saw a bank by the river&quot; to explore how context resolves ambiguous words.</div>
                  <div><strong>Advanced:</strong> Experiment with code syntax like &quot;if (x &gt; 0) return y&quot; to see structural pattern recognition.</div>
                  <div><strong>Custom Ideas:</strong> Questions, negations, compound sentences, or domain-specific terminology.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Context */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-sm">
            <div className="font-medium text-blue-900 mb-1 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Understanding Tokenization & Attention
            </div>
            <div className="text-blue-800 text-xs leading-relaxed">
              Each word becomes a "token" that the model processes. Attention patterns reveal how the model 
              understands relationships between words. Different sentence types showcase different linguistic 
              phenomena - try various examples to see how attention adapts to different structures and meanings.
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
}