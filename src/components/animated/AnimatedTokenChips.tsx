"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAnimation, useAnimationClasses } from '@/contexts/AnimationContext';

interface Token {
  id: string;
  text: string;
  index: number;
}

interface AnimatedTokenChipsProps {
  originalText: string;
  tokens: string[];
  selectedToken: number;
  onTokenSelect: (index: number) => void;
  isTokenizing?: boolean;
  onTokenizationComplete?: () => void;
}

export default function AnimatedTokenChips({
  originalText,
  tokens,
  selectedToken,
  onTokenSelect,
  isTokenizing = false,
  onTokenizationComplete
}: AnimatedTokenChipsProps) {
  const { state: _state, getAnimationDelay, getAnimationDuration } = useAnimation();
  const animationClasses = useAnimationClasses();
  const [visibleTokens, setVisibleTokens] = useState<Token[]>([]);
  const [isAnimatingTokenization, setIsAnimatingTokenization] = useState(false);
  const [highlightedToken, setHighlightedToken] = useState<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Convert string tokens to Token objects
  const tokenObjects: Token[] = tokens.map((text, index) => ({
    id: `token-${index}`,
    text,
    index
  }));

  // Handle tokenization animation
  useEffect(() => {
    if (isTokenizing && tokenObjects.length > 0) {
      setIsAnimatingTokenization(true);
      setVisibleTokens([]);
      
      // Animate tokens appearing one by one
      const animateTokens = async () => {
        for (let i = 0; i < tokenObjects.length; i++) {
          await new Promise(resolve => {
            setTimeout(() => {
              setVisibleTokens(prev => [...prev, tokenObjects[i]]);
              resolve(void 0);
            }, getAnimationDelay(i));
          });
        }
        
        setIsAnimatingTokenization(false);
        onTokenizationComplete?.();
      };
      
      animateTokens();
    } else if (!isTokenizing) {
      setVisibleTokens(tokenObjects);
      setIsAnimatingTokenization(false);
    }
  }, [isTokenizing, tokenObjects, onTokenizationComplete]);

  // Handle token selection with highlight animation
  const handleTokenClick = (index: number) => {
    if (isAnimatingTokenization) return;
    
    setHighlightedToken(index);
    onTokenSelect(index);
    
    // Clear highlight after animation
    setTimeout(() => {
      setHighlightedToken(null);
    }, getAnimationDuration('normal'));
  };

  const TokenChip = ({ token, isVisible }: { token: Token; isVisible: boolean }) => {
    const isSelected = token.index === selectedToken;
    const isHighlighted = highlightedToken === token.index;
    
    return (
      <button
        key={token.id}
        onClick={() => handleTokenClick(token.index)}
        disabled={isAnimatingTokenization}
        className={`
          relative px-3 py-2 rounded-full text-sm font-medium border-2 
          transition-all duration-300 transform hover:scale-105 
          ${isSelected 
            ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }
          ${isHighlighted ? animationClasses.tokenHighlight : ''}
          ${isVisible ? animationClasses.tokenSplit : 'opacity-0 scale-50'}
          ${animationClasses.enabled ? 'hover:shadow-md' : ''}
        `}
        style={{
          animationDelay: `${getAnimationDelay(token.index)}ms`,
          boxShadow: isSelected 
            ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
            : isHighlighted 
            ? '0 0 20px rgba(59, 130, 246, 0.5)' 
            : undefined
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70 font-mono">#{token.index}</span>
          <span>{token.text}</span>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
        )}
        
        {/* Ripple effect on click */}
        {isHighlighted && animationClasses.enabled && (
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Original text display */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Original Text:</div>
        <div 
          ref={textRef}
          className="p-3 bg-gray-50 rounded-lg border text-lg font-mono relative overflow-hidden"
        >
          {originalText}
          
          {/* Splitting animation overlay */}
          {isAnimatingTokenization && animationClasses.enabled && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent animate-pulse" />
          )}
        </div>
      </div>

      {/* Token chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-700">
            Tokens Generated:
          </div>
          <div className="text-xs text-gray-500">
            ({visibleTokens.length}/{tokenObjects.length} tokens)
          </div>
          {isAnimatingTokenization && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Tokenizing...
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 p-4 bg-green-50 rounded-lg border border-green-200 min-h-[80px] relative">
          {visibleTokens.length === 0 && !isAnimatingTokenization ? (
            <div className="text-sm text-gray-500 italic flex items-center justify-center w-full h-12">
              Click &quot;Start Tokenization&quot; to see tokens appear
            </div>
          ) : (
            visibleTokens.map((token) => (
              <TokenChip 
                key={token.id} 
                token={token} 
                isVisible={true}
              />
            ))
          )}
          
          {/* Flow particles for tokenization */}
          {isAnimatingTokenization && animationClasses.enabled && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-data-flow"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 200}ms`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Token insights */}
      {selectedToken >= 0 && selectedToken < visibleTokens.length && (
        <div className={`
          p-3 bg-blue-50 rounded-lg border border-blue-200 
          ${animationClasses.fadeInUp}
        `}>
          <div className="text-sm">
            <div className="font-medium text-blue-900 mb-1">
              Selected Token: &quot;{visibleTokens[selectedToken]?.text}&quot;
            </div>
            <div className="text-blue-700 text-xs space-y-1">
              <div>Position: {selectedToken} (zero-indexed)</div>
              <div>Length: {visibleTokens[selectedToken]?.text.length} characters</div>
              <div>Type: {/^[A-Z]/.test(visibleTokens[selectedToken]?.text || '') ? 'Capitalized' : 'Lowercase'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}