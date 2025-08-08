"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAnimation, useAnimationClasses } from '@/contexts/AnimationContext';

interface AnimatedVectorTableProps {
  title: string;
  vectors: number[][];
  labels: string[];
  highlightRow?: number;
  animateTransformation?: boolean;
  transformationType?: 'embedding' | 'qkv' | 'attention' | 'output';
  isCalculating?: boolean;
  onRowClick?: (index: number) => void;
  showTransformationSteps?: boolean;
}

interface VectorCellState {
  value: number;
  originalValue?: number;
  isVisible: boolean;
  isTransforming: boolean;
  transformationStep: number;
  animationDelay: number;
}

function round4(x: number): number {
  return Math.round(x * 1000) / 1000;
}

export default function AnimatedVectorTable({
  title,
  vectors,
  labels,
  highlightRow,
  animateTransformation = false,
  transformationType = 'embedding',
  isCalculating = false,
  onRowClick,
  showTransformationSteps = false
}: AnimatedVectorTableProps) {
  const { state: _state, getAnimationDelay: _getAnimationDelay, getAnimationDuration: _getAnimationDuration } = useAnimation();
  const animationClasses = useAnimationClasses();
  const [cellStates, setCellStates] = useState<VectorCellState[][]>([]);
  const [transformationProgress, setTransformationProgress] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const rows = vectors.length;
  const cols = vectors[0]?.length || 0;

  // Initialize cell states
  useEffect(() => {
    const newCellStates: VectorCellState[][] = vectors.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        value,
        originalValue: value,
        isVisible: !animateTransformation || !isCalculating,
        isTransforming: false,
        transformationStep: 0,
        animationDelay: getAnimationDelay(rowIndex * cols + colIndex)
      }))
    );
    setCellStates(newCellStates);
  }, [vectors, animateTransformation, isCalculating, cols]);

  // Handle transformation animation
  useEffect(() => {
    if (animateTransformation && isCalculating && cellStates.length > 0) {
      animateVectorTransformation();
    }
  }, [animateTransformation, isCalculating, cellStates.length]);

  const animateVectorTransformation = async () => {
    // Reset states
    setCellStates(prev => prev.map(row => 
      row.map(cell => ({ 
        ...cell, 
        isVisible: false, 
        isTransforming: false, 
        transformationStep: 0 
      }))
    ));

    setTransformationProgress(0);

    // Step 1: Show original values transforming
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        await new Promise(resolve => {
          setTimeout(() => {
            setCellStates(prev => {
              const newStates = [...prev];
              if (newStates[row] && newStates[row][col]) {
                newStates[row][col] = {
                  ...newStates[row][col],
                  isVisible: true,
                  isTransforming: true,
                  transformationStep: 1
                };
              }
              return newStates;
            });
            resolve(void 0);
          }, getAnimationDelay(row * cols + col));
        });
      }
      setTransformationProgress((row + 1) / rows * 50); // 50% for visibility
    }

    // Step 2: Transform to final values
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        await new Promise(resolve => {
          setTimeout(() => {
            setCellStates(prev => {
              const newStates = [...prev];
              if (newStates[row] && newStates[row][col]) {
                newStates[row][col] = {
                  ...newStates[row][col],
                  transformationStep: 2,
                  isTransforming: false
                };
              }
              return newStates;
            });
            resolve(void 0);
          }, getAnimationDelay(row * cols + col));
        });
      }
      setTransformationProgress(50 + (row + 1) / rows * 50); // 50-100% for transformation
    }
  };

  const getTransformationLabel = () => {
    switch (transformationType) {
      case 'embedding': return 'Token → Embedding';
      case 'qkv': return 'Embedding → Q,K,V';
      case 'attention': return 'Scores → Weights';
      case 'output': return 'Weighted → Output';
      default: return 'Transforming';
    }
  };

  const VectorCell = ({ 
    rowIndex, 
    colIndex: _colIndex, 
    cellState 
  }: { 
    rowIndex: number; 
    colIndex: number; 
    cellState: VectorCellState;
  }) => {
    const isHighlighted = highlightRow === rowIndex;
    
    // Color coding based on value
    const getValueColor = (value: number) => {
      const intensity = Math.abs(value);
      if (value > 0) {
        return `rgba(34, 197, 94, ${Math.min(intensity * 0.5, 0.8)})`; // Green for positive
      } else if (value < 0) {
        return `rgba(239, 68, 68, ${Math.min(intensity * 0.5, 0.8)})`; // Red for negative  
      }
      return 'rgba(156, 163, 175, 0.3)'; // Gray for near-zero
    };

    return (
      <td 
        className={`
          p-2 text-right font-mono text-xs border-r border-gray-200 transition-all duration-300
          ${isHighlighted ? 'bg-blue-50 ring-1 ring-blue-200' : ''}
          ${cellState.isTransforming ? animationClasses.vectorTransform : ''}
          ${cellState.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        `}
        style={{
          backgroundColor: isHighlighted 
            ? 'rgba(59, 130, 246, 0.1)' 
            : getValueColor(cellState.value),
          animationDelay: `${cellState.animationDelay}ms`,
          transform: cellState.isTransforming ? 'scale(1.05)' : undefined
        }}
      >
        <div className={`transition-all duration-300 ${cellState.isVisible ? '' : 'opacity-0'}`}>
          {round4(cellState.value)}
        </div>
        
        {/* Transformation indicator */}
        {cellState.isTransforming && animationClasses.enabled && (
          <div className="absolute inset-0 bg-purple-200/50 animate-pulse rounded" />
        )}
      </td>
    );
  };

  const VectorRow = ({ rowIndex }: { rowIndex: number }) => {
    const isHighlighted = highlightRow === rowIndex;
    const rowStates = cellStates[rowIndex] || [];
    
    return (
      <tr 
        className={`
          ${isHighlighted ? 'bg-blue-50' : 'hover:bg-gray-50'} 
          ${onRowClick ? 'cursor-pointer' : ''}
          transition-colors duration-200
        `}
        onClick={() => onRowClick?.(rowIndex)}
      >
        <td className={`
          p-2 font-mono text-sm border-r border-gray-200 bg-gray-50
          ${isHighlighted ? 'bg-blue-100 text-blue-800 font-bold' : ''}
        `}>
          {labels[rowIndex] || rowIndex}
        </td>
        {rowStates.map((cellState, colIndex) => (
          <VectorCell 
            key={colIndex}
            rowIndex={rowIndex}
            colIndex={colIndex}
            cellState={cellState}
          />
        ))}
      </tr>
    );
  };

  if (rows === 0 || cols === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            No vector data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm ${animationClasses.cardHover}`}>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {showTransformationSteps && isCalculating && (
            <div className="flex items-center gap-2 text-xs text-purple-600">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
              <span>{getTransformationLabel()}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Transformation progress */}
        {animateTransformation && isCalculating && (
          <div className="mb-3 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Transformation Progress</span>
              <span>{Math.round(transformationProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${transformationProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="overflow-auto">
          <table className="w-full text-xs" ref={tableRef}>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 bg-gray-50 font-medium">Token</th>
                {vectors[0]?.map((_v, j) => (
                  <th 
                    key={j} 
                    className="p-2 text-right bg-gray-50 font-medium border-l border-gray-200"
                  >
                    d{j}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <VectorRow key={rowIndex} rowIndex={rowIndex} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Vector statistics */}
        {highlightRow !== undefined && vectors[highlightRow] && (
          <div className={`mt-3 p-2 bg-blue-50 rounded border ${animationClasses.fadeInUp}`}>
            <div className="text-xs text-blue-800 space-y-1">
              <div className="font-medium">Vector Statistics for {labels[highlightRow]}:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-blue-600">Magnitude:</span>{' '}
                  {Math.sqrt(vectors[highlightRow].reduce((sum, val) => sum + val * val, 0)).toFixed(3)}
                </div>
                <div>
                  <span className="text-blue-600">Mean:</span>{' '}
                  {(vectors[highlightRow].reduce((sum, val) => sum + val, 0) / vectors[highlightRow].length).toFixed(3)}
                </div>
                <div>
                  <span className="text-blue-600">Max:</span>{' '}
                  {Math.max(...vectors[highlightRow]).toFixed(3)}
                </div>
                <div>
                  <span className="text-blue-600">Min:</span>{' '}
                  {Math.min(...vectors[highlightRow]).toFixed(3)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculation status */}
        {isCalculating && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span>Computing {transformationType} transformation...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}