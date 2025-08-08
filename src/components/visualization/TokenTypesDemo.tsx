"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Type,
  Hash,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Eye,
  Target,
  Layers,
  BookOpen,
  Zap,
  Brain,
  Search,
  Filter
} from 'lucide-react';

interface Token {
  id: number;
  text: string;
  type: 'word' | 'subword' | 'character' | 'special';
  category: 'noun' | 'verb' | 'adjective' | 'article' | 'preposition' | 'punctuation' | 'special' | 'unknown';
  position: number;
  attention: number;
  encoding: number[];
}

interface TokenTypesConfiguration {
  tokenizer: 'word' | 'subword' | 'character';
  vocabSize: number;
  maxLength: number;
}

interface TokenTypesDemoProps {
  initialText?: string;
  onTokenSelect?: (token: Token) => void;
  onComplete?: (insights: string[]) => void;
}

const TOKENIZER_CONFIGS = {
  word: { vocabSize: 50000, maxLength: 512, splitPattern: /\s+/ },
  subword: { vocabSize: 32000, maxLength: 512, splitPattern: /\B(?=[A-Z])|(?<=\w)(?=\W)|(?<=\W)(?=\w)/ },
  character: { vocabSize: 256, maxLength: 1024, splitPattern: /(?:)/ }
};

const TOKEN_CATEGORIES = {
  noun: { color: 'bg-blue-500', examples: ['cat', 'house', 'book'] },
  verb: { color: 'bg-green-500', examples: ['run', 'jump', 'think'] },
  adjective: { color: 'bg-purple-500', examples: ['big', 'fast', 'beautiful'] },
  article: { color: 'bg-orange-500', examples: ['the', 'a', 'an'] },
  preposition: { color: 'bg-red-500', examples: ['on', 'in', 'at'] },
  punctuation: { color: 'bg-gray-500', examples: ['.', ',', '!'] },
  special: { color: 'bg-pink-500', examples: ['<START>', '<END>', '<UNK>'] },
  unknown: { color: 'bg-gray-400', examples: ['???'] }
};

export function TokenTypesDemo({
  initialText = "The quick brown fox jumps over the lazy dog!",
  onTokenSelect,
  onComplete
}: TokenTypesDemoProps) {
  const [text, setText] = useState(initialText);
  const [config, setConfig] = useState<TokenTypesConfiguration>({
    tokenizer: 'word',
    vocabSize: 50000,
    maxLength: 512
  });
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [insights, setInsights] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Tokenize text based on configuration
  const tokens = useMemo(() => {
    const tokenizerConfig = TOKENIZER_CONFIGS[config.tokenizer];
    let rawTokens: string[] = [];
    
    switch (config.tokenizer) {
      case 'word':
        rawTokens = text.split(tokenizerConfig.splitPattern).filter(t => t.trim());
        break;
      case 'subword':
        // Simulate BPE-like tokenization
        rawTokens = text.split(/(\s+|[^\w\s])/).filter(t => t.trim());
        // Further split words into subwords
        const subwords: string[] = [];
        rawTokens.forEach(token => {
          if (token.length > 4 && /^\w+$/.test(token)) {
            // Split longer words into subwords
            for (let i = 0; i < token.length; i += 3) {
              subwords.push(token.slice(i, i + 3));
            }
          } else {
            subwords.push(token);
          }
        });
        rawTokens = subwords;
        break;
      case 'character':
        rawTokens = text.split('').filter(t => t.trim() || t === ' ');
        break;
    }

    return rawTokens.slice(0, tokenizerConfig.maxLength).map((tokenText, index) => {
      const token: Token = {
        id: index,
        text: tokenText,
        type: config.tokenizer === 'character' ? 'character' :
              config.tokenizer === 'subword' ? 'subword' : 'word',
        category: categorizeToken(tokenText),
        position: index,
        attention: Math.random() * 0.8 + 0.2, // Random attention for demo
        encoding: generateTokenEncoding()
      };
      return token;
    });
  }, [text, config]);

  const categorizeToken = (tokenText: string): Token['category'] => {
    const token = tokenText.toLowerCase().trim();
    
    if (['the', 'a', 'an'].includes(token)) return 'article';
    if (['on', 'in', 'at', 'over', 'under'].includes(token)) return 'preposition';
    if (['run', 'jump', 'sit', 'think', 'jumps'].includes(token)) return 'verb';
    if (['quick', 'brown', 'lazy', 'big', 'small'].includes(token)) return 'adjective';
    if (['cat', 'dog', 'fox', 'house', 'book'].includes(token)) return 'noun';
    if (['.', ',', '!', '?', ';'].includes(token)) return 'punctuation';
    if (token.startsWith('<') && token.endsWith('>')) return 'special';
    
    // Simple heuristic for unknown tokens
    if (/^\w+$/.test(token) && token.length > 1) {
      // Try to guess based on suffix
      if (token.endsWith('ing') || token.endsWith('ed')) return 'verb';
      if (token.endsWith('ly')) return 'adjective';
      return 'noun'; // Default for words
    }
    
    return 'unknown';
  };

  const generateTokenEncoding = (): number[] => {
    // Generate random encoding vector for demo
    return Array.from({ length: 8 }, () => Math.random() * 2 - 1);
  };

  // Filter tokens based on category
  const filteredTokens = useMemo(() => {
    if (filterCategory === 'all') return tokens;
    return tokens.filter(token => token.category === filterCategory);
  }, [tokens, filterCategory]);

  // Animation effect
  useEffect(() => {
    if (!isAnimating) return;

    const timer = setInterval(() => {
      setCurrentTokenIndex(prev => {
        const next = (prev + 1) % tokens.length;
        setSelectedToken(tokens[next]);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnimating, tokens]);

  // Generate insights
  useEffect(() => {
    if (tokens.length > 0) {
      const tokenTypes = [...new Set(tokens.map(t => t.type))];
      const categories = [...new Set(tokens.map(t => t.category))];
      
      const newInsights = [
        `${config.tokenizer} tokenization created ${tokens.length} tokens`,
        `Found ${tokenTypes.length} token types: ${tokenTypes.join(', ')}`,
        `Identified ${categories.length} categories: ${categories.join(', ')}`,
        `Vocabulary size: ${config.vocabSize.toLocaleString()} tokens`,
        `Each token gets its own position and attention weight`
      ];
      
      setInsights(newInsights);
    }
  }, [tokens, config]);

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
    onTokenSelect?.(token);
  };

  const handleTokenizerChange = (tokenizer: 'word' | 'subword' | 'character') => {
    setConfig(prev => ({
      ...prev,
      tokenizer,
      ...TOKENIZER_CONFIGS[tokenizer]
    }));
  };

  const TokenVisualization = ({ tokens: tokensToShow, title }: { 
    tokens: Token[]; 
    title: string;
  }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-800">{title}</h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-2">
          {tokensToShow.map((token) => {
            const categoryConfig = TOKEN_CATEGORIES[token.category];
            const isSelected = selectedToken?.id === token.id;
            const isHighlighted = isAnimating && currentTokenIndex === token.id;
            
            return (
              <div
                key={token.id}
                onClick={() => handleTokenClick(token)}
                className={`
                  relative cursor-pointer rounded-lg border-2 px-3 py-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-100 scale-110' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                  }
                  ${isHighlighted ? 'animate-pulse ring-2 ring-yellow-400' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${categoryConfig.color}`} />
                  <span className="font-mono text-sm">
                    {token.text === ' ' ? '·' : token.text}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {token.position}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {token.category}
                  </Badge>
                </div>
                
                {/* Attention strength indicator */}
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full"
                     style={{ 
                       backgroundColor: `rgba(59, 130, 246, ${token.attention})`,
                       opacity: token.attention 
                     }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const TokenDetails = ({ token }: { token: Token }) => (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-6 h-6 rounded-full ${TOKEN_CATEGORIES[token.category].color}`} />
        <div>
          <div className="font-bold text-lg font-mono">{token.text}</div>
          <div className="text-sm text-gray-600">Token #{token.position}</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Type</div>
            <div className="text-gray-600">{token.type}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Category</div>
            <div className="text-gray-600">{token.category}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Position</div>
            <div className="text-gray-600">{token.position}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Attention</div>
            <div className="text-gray-600">{Math.round(token.attention * 100)}%</div>
          </div>
        </div>
        
        {/* Token encoding visualization */}
        <div>
          <div className="font-medium text-gray-700 mb-2">Encoding Vector</div>
          <div className="flex gap-1">
            {token.encoding.map((value, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded border"
                style={{
                  backgroundColor: value > 0 
                    ? `rgba(59, 130, 246, ${Math.abs(value)})` 
                    : `rgba(239, 68, 68, ${Math.abs(value)})`
                }}
                title={`${value.toFixed(3)}`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Blue: positive values, Red: negative values
          </div>
        </div>
      </div>
    </div>
  );

  const TokenizerComparison = () => (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">Tokenizer Comparison</h3>
      
      <div className="grid gap-4">
        {(['word', 'subword', 'character'] as const).map(tokenizerType => {
          const tempConfig = { ...config, tokenizer: tokenizerType, ...TOKENIZER_CONFIGS[tokenizerType] };
          const tempTokens = useMemo(() => {
            // Quick tokenization for comparison
            let rawTokens: string[] = [];
            switch (tokenizerType) {
              case 'word':
                rawTokens = text.split(/\s+/).filter(t => t.trim());
                break;
              case 'subword':
                rawTokens = text.split(/(\s+|[^\w\s])/).filter(t => t.trim());
                break;
              case 'character':
                rawTokens = text.split('');
                break;
            }
            return rawTokens.slice(0, 20); // Limit for display
          }, [text, tokenizerType]);
          
          return (
            <div key={tokenizerType} className="border border-gray-200 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{tokenizerType} Tokenizer</span>
                <Badge variant="secondary">{tempTokens.length} tokens</Badge>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {tempTokens.map((tokenText, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-gray-100 rounded text-sm font-mono"
                  >
                    {tokenText === ' ' ? '·' : tokenText}
                  </span>
                ))}
                {tempTokens.length >= 20 && <span className="text-gray-500 text-sm">...</span>}
              </div>
              
              <div className="text-xs text-gray-600">
                Vocab: {tempConfig.vocabSize.toLocaleString()} | Max: {tempConfig.maxLength}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5 text-green-600" />
            Token Types & Tokenization Demo
            <Badge variant="secondary">{tokens.length} tokens</Badge>
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
                setText(initialText);
                setSelectedToken(null);
                setCurrentTokenIndex(0);
                setIsAnimating(false);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Explore different tokenization strategies and how they affect text representation
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Text */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={3}
            placeholder="Enter text to tokenize..."
          />
        </div>

        {/* Configuration */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Tokenization Configuration
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tokenizer Type
              </label>
              <Select value={config.tokenizer} onValueChange={handleTokenizerChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="word">Word-level</SelectItem>
                  <SelectItem value="subword">Subword (BPE-like)</SelectItem>
                  <SelectItem value="character">Character-level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Vocabulary Size
              </label>
              <div className="text-lg font-mono text-blue-600">
                {config.vocabSize.toLocaleString()}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Max Sequence Length
              </label>
              <div className="text-lg font-mono text-blue-600">
                {config.maxLength}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokens">Token Visualization</TabsTrigger>
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Tokenizer Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-6">
            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by category:</span>
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {Object.keys(TOKEN_CATEGORIES).map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Token Grid */}
            <TokenVisualization 
              tokens={filteredTokens} 
              title={`Tokenized Output (${filteredTokens.length} tokens)`}
            />
            
            {/* Token Details */}
            {selectedToken && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Token Details
                </h3>
                <TokenDetails token={selectedToken} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {/* Category Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(TOKEN_CATEGORIES).map(([category, config]) => {
                const count = tokens.filter(t => t.category === category).length;
                const percentage = (count / tokens.length) * 100;
                
                return (
                  <div key={category} className="bg-white border border-gray-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${config.color}`} />
                      <span className="font-medium text-sm capitalize">{category}</span>
                    </div>
                    <div className="text-lg font-bold">{count}</div>
                    <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
            
            {/* Category Examples */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Category Examples from Text</h3>
              <div className="grid gap-3">
                {Object.entries(TOKEN_CATEGORIES).map(([category, categoryConfig]) => {
                  const categoryTokens = tokens.filter(t => t.category === category);
                  if (categoryTokens.length === 0) return null;
                  
                  return (
                    <div key={category} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-4 h-4 rounded-full ${categoryConfig.color}`} />
                      <div className="font-medium capitalize min-w-24">{category}:</div>
                      <div className="flex flex-wrap gap-1">
                        {categoryTokens.slice(0, 10).map(token => (
                          <span
                            key={token.id}
                            className="px-2 py-1 bg-white rounded border text-sm font-mono cursor-pointer hover:bg-gray-100"
                            onClick={() => handleTokenClick(token)}
                          >
                            {token.text}
                          </span>
                        ))}
                        {categoryTokens.length > 10 && (
                          <span className="text-gray-500 text-sm">+{categoryTokens.length - 10} more</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <TokenizerComparison />
            
            {/* Comparison insights */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Tokenizer Trade-offs</span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium text-blue-800">Word-level</div>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>• Large vocabulary</li>
                    <li>• OOV (out-of-vocabulary) issues</li>
                    <li>• Natural word boundaries</li>
                    <li>• Less subword noise</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium text-blue-800">Subword</div>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>• Balanced vocabulary size</li>
                    <li>• Handles rare words</li>
                    <li>• Used in modern LLMs</li>
                    <li>• Good compression</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium text-blue-800">Character</div>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>• Small vocabulary</li>
                    <li>• No OOV issues</li>
                    <li>• Long sequences</li>
                    <li>• Character-level patterns</li>
                  </ul>
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
              Tokenization Insights
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

export default TokenTypesDemo;