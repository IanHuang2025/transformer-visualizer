"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Activity, 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Gauge,
  Layers,
  GitBranch,
  Eye,
  Brain,
  Clock,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface ComplexityMeterProps {
  value: number; // 0-1
  label: string;
  description?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ComplexityMeter({ 
  value, 
  label, 
  description, 
  animated = true, 
  size = 'md' 
}: ComplexityMeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setDisplayValue(prev => {
          const diff = value - prev;
          if (Math.abs(diff) < 0.01) {
            clearInterval(interval);
            return value;
          }
          return prev + diff * 0.1;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const getComplexityColor = (val: number) => {
    if (val < 0.3) return 'text-green-600 bg-green-500';
    if (val < 0.7) return 'text-yellow-600 bg-yellow-500';
    return 'text-red-600 bg-red-500';
  };

  const getComplexityIcon = (val: number) => {
    if (val < 0.3) return <TrendingDown className="w-4 h-4 text-green-600" />;
    if (val < 0.7) return <Activity className="w-4 h-4 text-yellow-600" />;
    return <TrendingUp className="w-4 h-4 text-red-600" />;
  };

  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-24 h-24 text-base'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`
        relative rounded-full border-4 border-gray-200 flex items-center justify-center
        ${sizeClasses[size]}
        transition-all duration-300
      `}>
        <svg 
          className="absolute inset-0 w-full h-full transform -rotate-90" 
          viewBox="0 0 36 36"
        >
          <path
            className="stroke-gray-200"
            strokeDasharray="100, 100"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            strokeWidth="2"
            fill="none"
          />
          <path
            className={getComplexityColor(displayValue).split(' ')[1]}
            strokeDasharray={`${displayValue * 100}, 100`}
            strokeLinecap="round"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            strokeWidth="2"
            fill="none"
            style={{ 
              transition: animated ? 'stroke-dasharray 0.5s ease-in-out' : 'none' 
            }}
          />
        </svg>
        <div className="flex flex-col items-center">
          {getComplexityIcon(displayValue)}
          <span className="font-bold text-xs mt-1">
            {Math.round(displayValue * 100)}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className={`font-medium ${sizeClasses[size].split(' ')[2]}`}>
          {label}
        </div>
        {description && (
          <div className="text-xs text-gray-500 max-w-24 text-center">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

interface AttentionStrengthBarProps {
  strengths: number[]; // Array of attention strengths 0-1
  labels?: string[];
  colors?: string[];
  animated?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function AttentionStrengthBar({ 
  strengths, 
  labels = [],
  colors = [],
  animated = true,
  orientation = 'horizontal'
}: AttentionStrengthBarProps) {
  const [animatedStrengths, setAnimatedStrengths] = useState(strengths.map(() => 0));
  
  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setAnimatedStrengths(prev => 
          prev.map((val, idx) => {
            const diff = strengths[idx] - val;
            if (Math.abs(diff) < 0.01) return strengths[idx];
            return val + diff * 0.15;
          })
        );
      }, 50);
      return () => clearInterval(interval);
    } else {
      setAnimatedStrengths(strengths);
    }
  }, [strengths, animated]);

  const defaultColors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-red-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  const barColors = colors.length > 0 ? colors : defaultColors;

  if (orientation === 'vertical') {
    return (
      <div className="flex items-end justify-center space-x-2 h-32">
        {animatedStrengths.map((strength, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1">
            <div className="relative bg-gray-200 w-6 h-24 rounded-full overflow-hidden">
              <div
                className={`absolute bottom-0 w-full ${barColors[idx % barColors.length]} rounded-full transition-all duration-300`}
                style={{ height: `${strength * 100}%` }}
              />
            </div>
            {labels[idx] && (
              <div className="text-xs text-gray-600 text-center max-w-8">
                {labels[idx]}
              </div>
            )}
            <div className="text-xs font-mono text-gray-500">
              {Math.round(strength * 100)}%
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {animatedStrengths.map((strength, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              {labels[idx] || `Item ${idx + 1}`}
            </span>
            <span className="text-xs font-mono text-gray-500">
              {Math.round(strength * 100)}%
            </span>
          </div>
          <div className="relative bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full ${barColors[idx % barColors.length]} rounded-full transition-all duration-300`}
              style={{ width: `${strength * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface PatternBadgeProps {
  pattern: string;
  confidence: number; // 0-1
  type: 'syntax' | 'semantic' | 'positional' | 'attention' | 'other';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function PatternBadge({ 
  pattern, 
  confidence, 
  type, 
  size = 'md',
  animated = true 
}: PatternBadgeProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setAnimatedConfidence(prev => {
          const diff = confidence - prev;
          if (Math.abs(diff) < 0.01) {
            clearInterval(interval);
            return confidence;
          }
          return prev + diff * 0.1;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setAnimatedConfidence(confidence);
    }
  }, [confidence, animated]);

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'syntax':
        return { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <GitBranch className="w-3 h-3" /> };
      case 'semantic':
        return { color: 'bg-green-100 text-green-800 border-green-300', icon: <Brain className="w-3 h-3" /> };
      case 'positional':
        return { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: <Target className="w-3 h-3" /> };
      case 'attention':
        return { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: <Eye className="w-3 h-3" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: <Activity className="w-3 h-3" /> };
    }
  };

  const typeConfig = getTypeConfig(type);
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const confidenceColor = animatedConfidence > 0.8 ? 'bg-green-500' : 
                         animatedConfidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`
      inline-flex items-center space-x-2 rounded-full border-2 ${typeConfig.color} ${sizeClasses[size]}
      transition-all duration-300 hover:shadow-md
    `}>
      {typeConfig.icon}
      <span className="font-medium">{pattern}</span>
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className={`h-full ${confidenceColor} transition-all duration-300`}
            style={{ width: `${animatedConfidence * 100}%` }}
          />
        </div>
        <span className="text-xs opacity-75">
          {Math.round(animatedConfidence * 100)}%
        </span>
      </div>
    </div>
  );
}

interface ConnectionLinesProps {
  connections: Array<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    strength: number; // 0-1
    type?: 'attention' | 'flow' | 'dependency';
    animated?: boolean;
  }>;
  width: number;
  height: number;
  className?: string;
}

export function ConnectionLines({ 
  connections, 
  width, 
  height, 
  className = "" 
}: ConnectionLinesProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getConnectionColor = (type?: string, strength?: number) => {
    const alpha = strength || 0.5;
    switch (type) {
      case 'attention': return `rgba(59, 130, 246, ${alpha})`;
      case 'flow': return `rgba(16, 185, 129, ${alpha})`;
      case 'dependency': return `rgba(139, 92, 246, ${alpha})`;
      default: return `rgba(107, 114, 128, ${alpha})`;
    }
  };

  return (
    <svg 
      width={width} 
      height={height} 
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="currentColor"
          />
        </marker>
      </defs>
      
      {connections.map((connection, idx) => {
        const { from, to, strength, type, animated = true } = connection;
        const strokeWidth = Math.max(1, strength * 4);
        const dashArray = animated ? "5,3" : undefined;
        const dashOffset = animated ? -(animationPhase * 0.5) : 0;
        
        return (
          <g key={idx}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={getConnectionColor(type, strength)}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              markerEnd="url(#arrowhead)"
              className="transition-all duration-300"
            />
            
            {/* Strength indicator at midpoint */}
            <circle
              cx={(from.x + to.x) / 2}
              cy={(from.y + to.y) / 2}
              r={Math.max(2, strength * 6)}
              fill={getConnectionColor(type, strength * 0.8)}
              className="transition-all duration-300"
            />
          </g>
        );
      })}
    </svg>
  );
}

interface VisualIndicatorsProps {
  config: {
    complexity: number;
    attentionStrengths: number[];
    patterns: Array<{
      pattern: string;
      confidence: number;
      type: 'syntax' | 'semantic' | 'positional' | 'attention' | 'other';
    }>;
    connections: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
      strength: number;
      type?: 'attention' | 'flow' | 'dependency';
    }>;
  };
  showComplexity?: boolean;
  showAttentionStrengths?: boolean;
  showPatterns?: boolean;
  showConnections?: boolean;
  animated?: boolean;
}

export function VisualIndicators({
  config,
  showComplexity = true,
  showAttentionStrengths = true,
  showPatterns = true,
  showConnections = true,
  animated = true
}: VisualIndicatorsProps) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          Visual Indicators
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Complexity Meters */}
        {showComplexity && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Complexity Analysis
            </h3>
            <div className="flex justify-center">
              <ComplexityMeter
                value={config.complexity}
                label="Overall Complexity"
                description="Computational demand"
                animated={animated}
                size="lg"
              />
            </div>
          </div>
        )}

        {/* Attention Strength Bars */}
        {showAttentionStrengths && config.attentionStrengths.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Attention Head Strengths
            </h3>
            <AttentionStrengthBar
              strengths={config.attentionStrengths}
              labels={config.attentionStrengths.map((_, i) => `Head ${i}`)}
              animated={animated}
            />
          </div>
        )}

        {/* Pattern Badges */}
        {showPatterns && config.patterns.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Detected Patterns
            </h3>
            <div className="flex flex-wrap gap-2">
              {config.patterns.map((pattern, idx) => (
                <PatternBadge
                  key={idx}
                  pattern={pattern.pattern}
                  confidence={pattern.confidence}
                  type={pattern.type}
                  animated={animated}
                />
              ))}
            </div>
          </div>
        )}

        {/* Connection Lines */}
        {showConnections && config.connections.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <LineChart className="w-4 h-4" />
              Information Flow
            </h3>
            <div className="relative bg-gray-50 rounded-lg h-48">
              <ConnectionLines
                connections={config.connections}
                width={400}
                height={192}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VisualIndicators;