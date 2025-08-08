"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  Grid3X3, 
  GitBranch, 
  Network,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Palette,
  Layers,
  Target,
  Zap,
  Activity
} from 'lucide-react';

// Positional Encoding Wave Visualizer
interface PositionalEncodingWavesProps {
  sequenceLength: number;
  modelDim: number;
  maxFreq?: number;
  animated?: boolean;
}

export function PositionalEncodingWaves({
  sequenceLength = 50,
  modelDim = 64,
  maxFreq = 10000,
  animated = true
}: PositionalEncodingWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [showAllDimensions, setShowAllDimensions] = useState(true);

  // Generate positional encodings
  const encodings = useMemo(() => {
    const encodings: number[][] = [];
    
    for (let pos = 0; pos < sequenceLength; pos++) {
      const encoding: number[] = [];
      
      for (let i = 0; i < modelDim; i++) {
        const angle = pos / Math.pow(maxFreq, 2 * Math.floor(i / 2) / modelDim);
        const value = i % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
        encoding.push(value);
      }
      
      encodings.push(encoding);
    }
    
    return encodings;
  }, [sequenceLength, modelDim, maxFreq]);

  // Animation loop
  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 0.1) % (2 * Math.PI));
    }, 50);

    return () => clearInterval(interval);
  }, [animated]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw position labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < sequenceLength; i += 10) {
      const x = padding + (i / sequenceLength) * plotWidth;
      ctx.fillText(i.toString(), x, height - padding + 15);
    }

    // Draw dimension labels
    ctx.textAlign = 'right';
    ctx.fillText('-1', padding - 5, padding);
    ctx.fillText('0', padding - 5, height / 2);
    ctx.fillText('1', padding - 5, height - padding);

    // Draw encoding waves
    if (showAllDimensions) {
      // Show multiple dimensions with different colors
      const dimensionsToShow = Math.min(8, modelDim);
      const colors = [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
      ];

      for (let dim = 0; dim < dimensionsToShow; dim++) {
        ctx.strokeStyle = colors[dim % colors.length];
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let pos = 0; pos < sequenceLength; pos++) {
          const x = padding + (pos / sequenceLength) * plotWidth;
          const value = encodings[pos][dim];
          const animatedValue = animated 
            ? value * Math.cos(animationPhase + dim * 0.5) 
            : value;
          const y = height - padding - ((animatedValue + 1) / 2) * plotHeight;

          if (pos === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }
    } else {
      // Show single selected dimension
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let pos = 0; pos < sequenceLength; pos++) {
        const x = padding + (pos / sequenceLength) * plotWidth;
        const value = encodings[pos][selectedDimension];
        const animatedValue = animated 
          ? value * Math.cos(animationPhase) 
          : value;
        const y = height - padding - ((animatedValue + 1) / 2) * plotHeight;

        if (pos === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

  }, [encodings, animationPhase, selectedDimension, showAllDimensions, animated]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          <Waves className="w-4 h-4" />
          Positional Encoding Waves
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAllDimensions}
              onChange={(e) => setShowAllDimensions(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show all dimensions</span>
          </div>
          
          {!showAllDimensions && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Dimension:</span>
              <Slider
                value={[selectedDimension]}
                onValueChange={([dim]) => setSelectedDimension(dim)}
                min={0}
                max={modelDim - 1}
                step={1}
                className="w-24"
              />
              <span className="text-sm w-8">{selectedDimension}</span>
            </div>
          )}
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-64 border border-gray-200 rounded-lg"
      />
      
      <div className="text-xs text-gray-500">
        <p>
          Positional encodings use sine and cosine waves of different frequencies to represent position.
          Each dimension uses a different frequency, creating unique patterns for each position.
        </p>
      </div>
    </div>
  );
}

// Attention Heatmap Visualizer
interface AttentionHeatmapProps {
  attentionWeights: number[][];
  tokens: string[];
  title?: string;
  colorScheme?: 'blue' | 'viridis' | 'plasma' | 'warm';
  interactive?: boolean;
  selectedHead?: number;
}

export function AttentionHeatmap({
  attentionWeights,
  tokens,
  title = "Attention Heatmap",
  colorScheme = 'blue',
  interactive = true,
  selectedHead = 0
}: AttentionHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const getColorValue = (value: number, scheme: string): string => {
    const intensity = Math.max(0, Math.min(1, value));
    
    switch (scheme) {
      case 'blue':
        return `rgba(59, 130, 246, ${intensity})`;
      case 'viridis':
        // Simplified viridis-like colormap
        const r = Math.floor(68 + (255 - 68) * intensity);
        const g = Math.floor(1 + (224 - 1) * intensity);
        const b = Math.floor(84 + (175 - 84) * intensity);
        return `rgba(${r}, ${g}, ${b}, ${intensity})`;
      case 'plasma':
        // Simplified plasma-like colormap
        const pr = Math.floor(13 + (240 - 13) * intensity);
        const pg = Math.floor(8 + (249 - 8) * intensity);
        const pb = Math.floor(135 + (33 - 135) * intensity);
        return `rgba(${pr}, ${pg}, ${pb}, ${intensity})`;
      case 'warm':
        return intensity > 0.5 
          ? `rgba(239, 68, 68, ${intensity})` 
          : `rgba(251, 146, 60, ${intensity})`;
      default:
        return `rgba(59, 130, 246, ${intensity})`;
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (interactive) {
      setSelectedCell({ row, col });
    }
  };

  const handleCellHover = (row: number, col: number) => {
    if (interactive) {
      setHoveredCell({ row, col });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          <Grid3X3 className="w-4 h-4" />
          {title}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Color:</span>
          <select 
            value={colorScheme}
            onChange={() => {}} // Would connect to parent state
            className="text-sm border rounded px-2 py-1"
          >
            <option value="blue">Blue</option>
            <option value="viridis">Viridis</option>
            <option value="plasma">Plasma</option>
            <option value="warm">Warm</option>
          </select>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
        {/* Column headers */}
        <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `40px repeat(${tokens.length}, 1fr)` }}>
          <div></div>
          {tokens.map((token, idx) => (
            <div key={idx} className="text-xs text-center font-medium text-gray-700 p-1 truncate rotate-45 origin-bottom-left h-8">
              {token}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div className="space-y-1">
          {attentionWeights.map((row, rowIdx) => (
            <div key={rowIdx} className="grid gap-1" style={{ gridTemplateColumns: `40px repeat(${tokens.length}, 1fr)` }}>
              {/* Row header */}
              <div className="text-xs font-medium text-gray-700 p-1 flex items-center justify-end pr-2 truncate">
                {tokens[rowIdx]}
              </div>
              
              {/* Attention cells */}
              {row.map((weight, colIdx) => {
                const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
                
                return (
                  <div
                    key={colIdx}
                    className={`
                      aspect-square rounded cursor-pointer transition-all duration-200 border
                      ${isHovered ? 'ring-2 ring-blue-400 scale-110' : ''}
                      ${isSelected ? 'ring-2 ring-yellow-400' : 'border-gray-200'}
                      hover:scale-105
                    `}
                    style={{
                      backgroundColor: getColorValue(weight, colorScheme),
                      minWidth: '24px',
                      minHeight: '24px'
                    }}
                    title={`${tokens[rowIdx]} → ${tokens[colIdx]}: ${(weight * 100).toFixed(1)}%`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    onMouseEnter={() => handleCellHover(rowIdx, colIdx)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {weight > 0.7 && (
                      <div className="flex items-center justify-center h-full text-xs font-bold text-white mix-blend-difference">
                        {Math.round(weight * 100)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Selection details */}
        {selectedCell && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm font-medium text-blue-800">
              Attention Detail: {tokens[selectedCell.row]} → {tokens[selectedCell.col]}
            </div>
            <div className="text-sm text-blue-600">
              Weight: {(attentionWeights[selectedCell.row][selectedCell.col] * 100).toFixed(2)}%
            </div>
          </div>
        )}
      </div>
      
      {/* Color scale legend */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Attention strength:</span>
        <div className="flex">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="w-4 h-4 border-r border-white last:border-r-0"
              style={{ backgroundColor: getColorValue(i / 9, colorScheme) }}
            />
          ))}
        </div>
        <span className="text-gray-600">Low → High</span>
      </div>
    </div>
  );
}

// Token Relationship Graph Visualizer
interface TokenRelationshipGraphProps {
  tokens: string[];
  relationships: Array<{
    from: number;
    to: number;
    weight: number;
    type: 'attention' | 'semantic' | 'syntactic' | 'positional';
  }>;
  layout?: 'circle' | 'force' | 'linear';
  showLabels?: boolean;
  threshold?: number;
}

export function TokenRelationshipGraph({
  tokens,
  relationships,
  layout = 'circle',
  showLabels = true,
  threshold = 0.3
}: TokenRelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Calculate node positions based on layout
  const nodePositions = useMemo(() => {
    const positions: Array<{ x: number; y: number }> = [];
    const width = 400;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;

    switch (layout) {
      case 'circle':
        tokens.forEach((_, i) => {
          const angle = (i / tokens.length) * 2 * Math.PI;
          const radius = Math.min(width, height) * 0.35;
          positions.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        });
        break;
      
      case 'linear':
        tokens.forEach((_, i) => {
          positions.push({
            x: 50 + (i / (tokens.length - 1)) * (width - 100),
            y: centerY
          });
        });
        break;
      
      case 'force':
        // Simplified force layout - would typically use d3-force
        tokens.forEach((_, i) => {
          positions.push({
            x: 50 + Math.random() * (width - 100),
            y: 50 + Math.random() * (height - 100)
          });
        });
        break;
    }

    return positions;
  }, [tokens, layout]);

  // Filter relationships by threshold
  const filteredRelationships = relationships.filter(rel => rel.weight >= threshold);

  const getRelationshipColor = (type: string): string => {
    switch (type) {
      case 'attention': return '#3b82f6';
      case 'semantic': return '#10b981';
      case 'syntactic': return '#f59e0b';
      case 'positional': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleNodeClick = (nodeIndex: number) => {
    setSelectedNode(selectedNode === nodeIndex ? null : nodeIndex);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          <Network className="w-4 h-4" />
          Token Relationship Graph
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Layout:</span>
            <select 
              value={layout}
              onChange={() => {}} // Would connect to parent state
              className="text-sm border rounded px-2 py-1"
            >
              <option value="circle">Circle</option>
              <option value="linear">Linear</option>
              <option value="force">Force</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Threshold:</span>
            <Slider
              value={[threshold]}
              onValueChange={() => {}} // Would connect to parent state
              min={0}
              max={1}
              step={0.1}
              className="w-20"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <svg ref={svgRef} width="100%" height="300" className="border border-gray-200 rounded">
          {/* Relationships (edges) */}
          {filteredRelationships.map((rel, idx) => {
            const fromPos = nodePositions[rel.from];
            const toPos = nodePositions[rel.to];
            if (!fromPos || !toPos) return null;
            
            const isHighlighted = selectedNode === rel.from || selectedNode === rel.to;
            
            return (
              <g key={idx}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={getRelationshipColor(rel.type)}
                  strokeWidth={isHighlighted ? Math.max(2, rel.weight * 4) : Math.max(1, rel.weight * 2)}
                  strokeOpacity={isHighlighted ? 0.9 : 0.6}
                  className="transition-all duration-200"
                />
                
                {/* Arrowhead */}
                <polygon
                  points={`${toPos.x-5},${toPos.y-3} ${toPos.x},${toPos.y} ${toPos.x-5},${toPos.y+3}`}
                  fill={getRelationshipColor(rel.type)}
                  fillOpacity={isHighlighted ? 0.9 : 0.6}
                />
              </g>
            );
          })}
          
          {/* Nodes */}
          {tokens.map((token, i) => {
            const pos = nodePositions[i];
            if (!pos) return null;
            
            const isSelected = selectedNode === i;
            const isHovered = hoveredNode === i;
            const isConnected = selectedNode !== null && filteredRelationships.some(
              rel => (rel.from === selectedNode && rel.to === i) || (rel.to === selectedNode && rel.from === i)
            );
            
            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 20 : isHovered ? 16 : 12}
                  fill={isSelected ? '#3b82f6' : isConnected ? '#10b981' : '#f3f4f6'}
                  stroke={isSelected ? '#1e40af' : '#d1d5db'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleNodeClick(i)}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                
                {showLabels && (
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    className="text-xs font-medium pointer-events-none select-none"
                    fill={isSelected ? 'white' : '#374151'}
                  >
                    {token.length > 8 ? token.slice(0, 6) + '...' : token}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Selected node details */}
        {selectedNode !== null && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm font-medium text-blue-800">
              Selected: "{tokens[selectedNode]}" (position {selectedNode})
            </div>
            <div className="text-sm text-blue-600">
              Connected to {filteredRelationships.filter(rel => 
                rel.from === selectedNode || rel.to === selectedNode
              ).length} other tokens
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-gray-600">Relationship types:</span>
        {['attention', 'semantic', 'syntactic', 'positional'].map(type => (
          <div key={type} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: getRelationshipColor(type) }}
            />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Combined Pattern Visualizers Component
interface PatternVisualizersProps {
  config: {
    sequenceLength: number;
    modelDim: number;
    tokens: string[];
    attentionWeights: number[][];
    relationships: Array<{
      from: number;
      to: number;
      weight: number;
      type: 'attention' | 'semantic' | 'syntactic' | 'positional';
    }>;
  };
  activeVisualizers?: string[];
  onVisualizerToggle?: (visualizer: string, enabled: boolean) => void;
}

export function PatternVisualizers({
  config,
  activeVisualizers = ['positional', 'heatmap', 'graph'],
  onVisualizerToggle
}: PatternVisualizersProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            Pattern Visualizers
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
              onClick={() => setIsAnimating(false)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeVisualizers[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="positional">Positional Waves</TabsTrigger>
            <TabsTrigger value="heatmap">Attention Heatmap</TabsTrigger>
            <TabsTrigger value="graph">Relationship Graph</TabsTrigger>
          </TabsList>

          <TabsContent value="positional" className="space-y-4">
            <PositionalEncodingWaves
              sequenceLength={config.sequenceLength}
              modelDim={config.modelDim}
              animated={isAnimating}
            />
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <AttentionHeatmap
              attentionWeights={config.attentionWeights}
              tokens={config.tokens}
              interactive={true}
            />
          </TabsContent>

          <TabsContent value="graph" className="space-y-4">
            <TokenRelationshipGraph
              tokens={config.tokens}
              relationships={config.relationships}
              showLabels={true}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default {
  PositionalEncodingWaves,
  AttentionHeatmap,
  TokenRelationshipGraph,
  PatternVisualizers
};