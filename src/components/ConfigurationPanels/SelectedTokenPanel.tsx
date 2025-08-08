"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { PanelContainer } from "./PanelContainer";
import { 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  BarChart3, 
  Eye, 
  BookOpen, 
  Zap, 
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Compare,
  RotateCcw
} from "lucide-react";

interface TokenAnalysis {
  type: 'content' | 'function' | 'punctuation' | 'unknown';
  category: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  expectedBehavior: string[];
}

interface AttentionStats {
  totalAttentionReceived: number;
  topAttendedTokens: Array<{ token: string; index: number; weight: number }>;
  attentionSpread: 'focused' | 'distributed' | 'scattered';
  dominantConnections: string[];
}

interface SelectedTokenPanelProps {
  selectedToken: number;
  tokens: string[];
  onTokenSelect: (index: number) => void;
  // Optional attention data for enhanced analysis
  attentionWeights?: number[][]; // [query_token][key_token] attention weights
  currentHead?: number;
}

export function SelectedTokenPanel({
  selectedToken,
  tokens,
  onTokenSelect,
  attentionWeights,
  currentHead = 0 // eslint-disable-line @typescript-eslint/no-unused-vars
}: SelectedTokenPanelProps) {
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonToken, setComparisonToken] = useState<number | null>(null);
  const [showPredictions, setShowPredictions] = useState(false);
  
  const currentToken = tokens[selectedToken] || "";
  
  // Enhanced token analysis
  const analyzeToken = (token: string, position: number): TokenAnalysis => {
    const functionWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'if', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with',
      'that', 'which', 'who', 'what', 'when', 'where', 'why', 'how', 'will', 'would', 'can', 'could',
      'should', 'may', 'might', 'must', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
      'has', 'had', 'do', 'does', 'did', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your',
      'his', 'her', 'its', 'our', 'their', 'this', 'these', 'that', 'those'
    ]);
    
    const punctuation = /^[{}()<>\[\],.!?;:"'`~\-_+=|\\\/>]+$|^[a-zA-Z]*[{}()<>\[\],.!?;:"'`~\-_+=|\\\/>]+$/;
    const lowerToken = token.toLowerCase();
    
    if (punctuation.test(token)) {
      return {
        type: 'punctuation',
        category: 'Structural',
        description: 'Punctuation marks that provide grammatical structure',
        importance: 'medium',
        expectedBehavior: [
          'Often receives attention from nearby content words',
          'May help with syntactic parsing',
          'Creates boundaries and groupings'
        ]
      };
    }
    
    if (functionWords.has(lowerToken)) {
      return {
        type: 'function',
        category: 'Grammatical',
        description: 'Function words that provide grammatical relationships',
        importance: position < 3 || position > tokens.length - 3 ? 'high' : 'medium',
        expectedBehavior: [
          'Connects content words together',
          'May show consistent attention patterns',
          'Critical for understanding sentence structure'
        ]
      };
    }
    
    return {
      type: 'content',
      category: 'Semantic',
      description: 'Content words that carry the main meaning',
      importance: 'high',
      expectedBehavior: [
        'Likely to receive strong attention from related concepts',
        'May form semantic clusters with similar words',
        'Central to understanding sentence meaning'
      ]
    };
  };
  
  // Calculate attention statistics
  const calculateAttentionStats = (tokenIndex: number): AttentionStats | null => {
    if (!attentionWeights || !attentionWeights[tokenIndex]) {
      return null;
    }
    
    const tokenWeights = attentionWeights[tokenIndex];
    const totalAttention = tokenWeights.reduce((sum, weight) => sum + weight, 0);
    
    // Find top attended tokens
    const topTokens = tokenWeights
      .map((weight, idx) => ({ token: tokens[idx], index: idx, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .filter(item => item.weight > 0.05); // Only show significant attention
    
    // Determine attention spread
    const maxWeight = Math.max(...tokenWeights);
    const significantWeights = tokenWeights.filter(w => w > 0.1).length;
    
    let spread: 'focused' | 'distributed' | 'scattered';
    if (maxWeight > 0.7 && significantWeights <= 2) {
      spread = 'focused';
    } else if (significantWeights <= 4) {
      spread = 'distributed';
    } else {
      spread = 'scattered';
    }
    
    // Identify dominant connections
    const dominantConnections = topTokens.map(t => 
      `Strong connection to "${t.token}" (${Math.round(t.weight * 100)}%)`
    );
    
    return {
      totalAttentionReceived: totalAttention,
      topAttendedTokens: topTokens,
      attentionSpread: spread,
      dominantConnections
    };
  };
  
  const tokenAnalysis = analyzeToken(currentToken, selectedToken);
  const attentionStats = calculateAttentionStats(selectedToken);
  const comparisonAnalysis = comparisonToken !== null ? analyzeToken(tokens[comparisonToken], comparisonToken) : null;
  // const comparisonStats = comparisonToken !== null ? calculateAttentionStats(comparisonToken) : null;
  
  const goToPrevious = () => {
    if (selectedToken > 0) {
      onTokenSelect(selectedToken - 1);
    }
  };

  const goToNext = () => {
    if (selectedToken < tokens.length - 1) {
      onTokenSelect(selectedToken + 1);
    }
  };
  
  const handleQuickJump = (position: 'first' | 'middle' | 'last') => {
    let targetIndex: number;
    switch (position) {
      case 'first':
        targetIndex = 0;
        break;
      case 'middle':
        targetIndex = Math.floor(tokens.length / 2);
        break;
      case 'last':
        targetIndex = tokens.length - 1;
        break;
    }
    onTokenSelect(targetIndex);
  };
  
  const getTypeColor = (type: string, importance?: string) => {
    const colors = {
      content: importance === 'high' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-50 text-blue-700 border-blue-200',
      function: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      punctuation: 'bg-gray-100 text-gray-800 border-gray-300',
      unknown: 'bg-gray-50 text-gray-600 border-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.unknown;
  };
  
  const getSpreadColor = (spread: string) => {
    const colors = {
      focused: 'text-green-800 bg-green-100',
      distributed: 'text-blue-800 bg-blue-100',
      scattered: 'text-orange-800 bg-orange-100'
    };
    return colors[spread as keyof typeof colors] || 'text-gray-800 bg-gray-100';
  };
  
  const generateTokenPredictions = (analysis: TokenAnalysis): string[] => {
    switch (analysis.type) {
      case 'content':
        return [
          'Will likely attend to semantically related words',
          'May show strong connections to subjects/objects if verb',
          'Could form clusters with other content words'
        ];
      case 'function':
        return [
          'Will connect different parts of the sentence',
          'May show consistent patterns across similar sentences',
          'Attention might be more grammatically driven'
        ];
      case 'punctuation':
        return [
          'May receive attention from adjacent words',
          'Could help with structural understanding',
          'Attention patterns depend on syntactic role'
        ];
      default:
        return ['Attention patterns may vary based on context'];
    }
  };

  return (
    <PanelContainer
      title="Token Analysis & Navigation"
      icon={<Target className="w-5 h-5" />}
      description="Deep analysis of selected token with attention statistics and comparison tools"
      defaultExpanded={true}
    >
      <div className="space-y-6">
        
        {/* Token Header with Analysis Toggle */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                #{selectedToken}
              </div>
              <div className="text-xl font-bold text-blue-900">
                "{currentToken}"
              </div>
              <Badge className={`${getTypeColor(tokenAnalysis.type, tokenAnalysis.importance)} text-xs`}>
                {tokenAnalysis.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="text-xs"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                {showAnalysis ? 'Hide' : 'Show'} Analysis
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setComparisonMode(!comparisonMode)}
                className="text-xs"
              >
                <Compare className="w-3 h-3 mr-1" />
                Compare
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-blue-800">{tokenAnalysis.description}</p>
          
          {/* Quick Stats */}
          {attentionStats && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className={`text-xs ${getSpreadColor(attentionStats.attentionSpread)}`}>
                {attentionStats.attentionSpread} attention
              </Badge>
              <Badge variant="outline" className="text-xs">
                {attentionStats.topAttendedTokens.length} strong connections
              </Badge>
              <Badge variant="outline" className="text-xs">
                Position {selectedToken + 1}/{tokens.length}
              </Badge>
            </div>
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Token Navigation
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Sequential Navigation */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-600">Sequential</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={selectedToken === 0}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="px-3 py-2 bg-gray-100 rounded text-xs font-mono text-center min-w-[50px]">
                  {selectedToken + 1}/{tokens.length}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={goToNext}
                  disabled={selectedToken === tokens.length - 1}
                  className="flex-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            
            {/* Quick Jump */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-600">Quick Jump</span>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickJump('first')}
                  disabled={selectedToken === 0}
                  className="text-xs"
                >
                  First
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickJump('middle')}
                  disabled={selectedToken === Math.floor(tokens.length / 2)}
                  className="text-xs"
                >
                  Middle
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickJump('last')}
                  disabled={selectedToken === tokens.length - 1}
                  className="text-xs"
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Token Context */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Interactive Context</span>
            <span className="text-xs text-gray-500">Click any token to analyze</span>
          </div>
          <div className="flex flex-wrap gap-1 p-3 bg-gray-50 rounded-lg border">
            {tokens.map((token, index) => {
              const analysis = analyzeToken(token, index);
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onTokenSelect(index)}
                      className={`px-2 py-1 rounded text-xs transition-all transform hover:scale-105 ${
                        index === selectedToken
                          ? "bg-blue-600 text-white shadow-lg font-bold ring-2 ring-blue-300"
                          : index === comparisonToken
                          ? "bg-purple-500 text-white shadow-md font-bold ring-2 ring-purple-300"
                          : `${getTypeColor(analysis.type)} hover:shadow-sm`
                      }`}
                    >
                      <span className="opacity-70 mr-1">{index}</span>
                      {token}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs max-w-xs">
                      <div className="font-medium">{analysis.category} Word</div>
                      <div className="text-gray-600">Position: {index + 1}/{tokens.length}</div>
                      <div className="text-gray-600 mt-1">{analysis.description}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Detailed Token Analysis */}
        {showAnalysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Token Personality Analysis</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Token Characteristics */}
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    Characteristics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Type:</span>
                    <Badge className={`${getTypeColor(tokenAnalysis.type)} text-xs`}>
                      {tokenAnalysis.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Importance:</span>
                    <Badge className={`text-xs ${
                      tokenAnalysis.importance === 'high' ? 'bg-red-100 text-red-800' :
                      tokenAnalysis.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tokenAnalysis.importance}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs font-medium block mb-1">Expected Behavior:</span>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {tokenAnalysis.expectedBehavior.map((behavior, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-green-500 mt-0.5">•</span>
                          {behavior}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Attention Statistics */}
              {attentionStats && (
                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Attention Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Attention Pattern:</span>
                      <Badge className={`text-xs ${getSpreadColor(attentionStats.attentionSpread)}`}>
                        {attentionStats.attentionSpread}
                      </Badge>
                    </div>
                    
                    {attentionStats.topAttendedTokens.length > 0 && (
                      <div>
                        <span className="text-xs font-medium block mb-2">Top Connections:</span>
                        <div className="space-y-1">
                          {attentionStats.topAttendedTokens.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-700">"{item.token}"</span>
                              <div className="flex items-center gap-1">
                                <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${Math.min(item.weight * 100, 100)}%` }}
                                  />
                                </div>
                                <span className="font-mono text-gray-600">{Math.round(item.weight * 100)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Comparison Mode */}
        {comparisonMode && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compare className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Comparison Mode</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setComparisonToken(null)}
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-purple-800 block mb-1">Select token to compare with:</label>
                <Select 
                  value={comparisonToken?.toString() || ""} 
                  onValueChange={(value) => setComparisonToken(value ? parseInt(value) : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a token to compare..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token, idx) => {
                      if (idx === selectedToken) return null;
                      return (
                        <SelectItem key={idx} value={idx.toString()}>
                          #{idx}: "{token}"
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              {comparisonToken !== null && comparisonAnalysis && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-blue-100 p-3 rounded border border-blue-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600 text-white text-xs">Current</Badge>
                      <span className="text-sm font-medium">"{currentToken}"</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div>Type: <span className="font-medium">{tokenAnalysis.type}</span></div>
                      <div>Category: <span className="font-medium">{tokenAnalysis.category}</span></div>
                      <div>Importance: <span className="font-medium">{tokenAnalysis.importance}</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-100 p-3 rounded border border-purple-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-600 text-white text-xs">Compare</Badge>
                      <span className="text-sm font-medium">"{tokens[comparisonToken]}"</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div>Type: <span className="font-medium">{comparisonAnalysis.type}</span></div>
                      <div>Category: <span className="font-medium">{comparisonAnalysis.category}</span></div>
                      <div>Importance: <span className="font-medium">{comparisonAnalysis.importance}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attention Pattern Predictions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Attention Predictions
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPredictions(!showPredictions)}
              className="text-xs"
            >
              {showPredictions ? 'Hide' : 'Show'} Predictions
            </Button>
          </div>
          
          {showPredictions && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="space-y-2">
                {generateTokenPredictions(tokenAnalysis).map((prediction, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-amber-800">
                    <ArrowRight className="w-3 h-3 mt-0.5 text-amber-600" />
                    {prediction}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Educational Context */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-sm">
            <div className="font-medium text-blue-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Understanding Token Attention
            </div>
            <div className="text-blue-800 text-xs space-y-1 leading-relaxed">
              <div>• Each token&apos;s <strong>query</strong> determines what information it seeks from other tokens</div>
              <div>• The <strong>highlighted row</strong> in attention matrices shows this token&apos;s attention pattern</div>
              <div>• <strong>Function words</strong> often show different patterns than <strong>content words</strong></div>
              <div>• Try comparing different token types to understand how attention varies by word role</div>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
}