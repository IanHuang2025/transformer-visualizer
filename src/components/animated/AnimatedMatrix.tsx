"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAnimation, useAnimationClasses } from '@/contexts/AnimationContext';

interface AnimatedMatrixProps {
  matrix: number[][];
  highlightRow?: number;
  highlightCol?: number;
  mode: 'scores' | 'weights';
  isCalculating?: boolean;
  onCellClick?: (row: number, col: number) => void;
  showCalculation?: boolean;
  tokens?: string[];
}

interface CellState {
  value: number;
  isVisible: boolean;
  isHighlighted: boolean;
  isBeingCalculated: boolean;
  animationDelay: number;
}

function colorFromWeight(w: number): string {
  const light = 96;
  const dark = 45;
  const l = light - (light - dark) * Math.max(0, Math.min(1, w));
  return `hsl(220 90% ${l}%)`;
}

function colorFromScore(z: number): string {
  const t = Math.tanh(z / 4);
  const hue = t > 0 ? 10 : 210;
  const sat = 85;
  const light = 50 + (1 - Math.abs(t)) * 30;
  return `hsl(${hue} ${sat}% ${light}%)`;
}

export default function AnimatedMatrix({
  matrix,
  highlightRow,
  highlightCol,
  mode,
  isCalculating = false,
  onCellClick,
  showCalculation = false,
  tokens = []
}: AnimatedMatrixProps) {
  const { state: _state, getAnimationDelay, getAnimationDuration } = useAnimation();
  const animationClasses = useAnimationClasses();
  const [cellStates, setCellStates] = useState<CellState[][]>([]);
  const [calculationStep, setCalculationStep] = useState<{row: number; col: number} | null>(null);
  const matrixRef = useRef<HTMLDivElement>(null);

  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  // Initialize cell states
  useEffect(() => {
    const newCellStates: CellState[][] = matrix.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        value,
        isVisible: !isCalculating,
        isHighlighted: false,
        isBeingCalculated: false,
        animationDelay: getAnimationDelay(rowIndex * cols + colIndex)
      }))
    );
    setCellStates(newCellStates);
  }, [matrix, isCalculating, getAnimationDelay, cols]);

  // Animate matrix filling when calculating
  useEffect(() => {
    if (isCalculating && cellStates.length > 0) {
      const animateMatrixFill = async () => {
        // Reset all cells to invisible
        setCellStates(prev => prev.map(row => 
          row.map(cell => ({ ...cell, isVisible: false, isBeingCalculated: false }))
        ));

        // Animate cells appearing row by row
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            await new Promise(resolve => {
              setTimeout(() => {
                setCalculationStep({ row, col });
                setCellStates(prev => {
                  const newStates = [...prev];
                  if (newStates[row] && newStates[row][col]) {
                    newStates[row][col] = {
                      ...newStates[row][col],
                      isVisible: true,
                      isBeingCalculated: true
                    };
                  }
                  return newStates;
                });
                
                // Clear calculation state after animation
                setTimeout(() => {
                  setCellStates(prev => {
                    const newStates = [...prev];
                    if (newStates[row] && newStates[row][col]) {
                      newStates[row][col] = {
                        ...newStates[row][col],
                        isBeingCalculated: false
                      };
                    }
                    return newStates;
                  });
                }, getAnimationDuration('fast'));
                
                resolve(void 0);
              }, getAnimationDelay(row * cols + col));
            });
          }
        }
        
        setCalculationStep(null);
      };

      animateMatrixFill();
    } else if (!isCalculating) {
      // Make all cells visible immediately
      setCellStates(prev => prev.map(row => 
        row.map(cell => ({ ...cell, isVisible: true, isBeingCalculated: false }))
      ));
    }
  }, [isCalculating, cellStates.length, rows, cols, getAnimationDelay, getAnimationDuration]);

  const MatrixCell = ({ 
    rowIndex, 
    colIndex, 
    cellState 
  }: { 
    rowIndex: number; 
    colIndex: number; 
    cellState: CellState;
  }) => {
    const isHighlightedRow = highlightRow === rowIndex;
    const isHighlightedCol = highlightCol === colIndex;
    const isCurrentCalculation = calculationStep?.row === rowIndex && calculationStep?.col === colIndex;
    
    const backgroundColor = mode === 'weights' 
      ? colorFromWeight(cellState.value) 
      : colorFromScore(cellState.value);

    const cellValue = mode === 'weights' 
      ? `${(cellState.value * 100).toFixed(0)}%`
      : cellState.value.toFixed(3);

    return (
      <button
        className={`
          relative w-12 h-12 text-[10px] font-mono flex items-center justify-center 
          border border-white/30 transition-all duration-300
          ${isHighlightedRow || isHighlightedCol 
            ? 'outline outline-2 outline-blue-500 outline-offset-1 z-10' 
            : ''
          }
          ${onCellClick ? 'hover:scale-105 cursor-pointer' : ''}
          ${cellState.isBeingCalculated ? animationClasses.matrixFill : ''}
          ${cellState.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          ${isCurrentCalculation && animationClasses.enabled ? 'animate-pulse' : ''}
        `}
        style={{
          backgroundColor,
          color: mode === 'weights' && cellState.value > 0.5 ? 'white' : 'black',
          animationDelay: `${cellState.animationDelay}ms`,
          transform: isCurrentCalculation ? 'scale(1.1)' : undefined,
          boxShadow: isCurrentCalculation 
            ? '0 0 15px rgba(59, 130, 246, 0.5)' 
            : isHighlightedRow || isHighlightedCol
            ? '0 0 8px rgba(59, 130, 246, 0.3)'
            : undefined
        }}
        onClick={() => onCellClick?.(rowIndex, colIndex)}
        disabled={!cellState.isVisible || isCalculating}
      >
        <span className={cellState.isVisible ? '' : 'opacity-0'}>
          {cellValue}
        </span>
        
        {/* Calculation indicator */}
        {isCurrentCalculation && animationClasses.enabled && (
          <div className="absolute inset-0 bg-blue-400/20 rounded animate-pulse" />
        )}
        
        {/* Dot product visualization for scores mode */}
        {mode === 'scores' && isCurrentCalculation && showCalculation && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Q·K
          </div>
        )}
      </button>
    );
  };

  if (rows === 0 || cols === 0) {
    return (
      <div className="w-full h-32 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        No matrix data to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Matrix container */}
      <div className="overflow-auto border rounded-xl">
        <div ref={matrixRef} className="min-w-[360px] relative">
          {/* Row labels */}
          {tokens.length > 0 && (
            <div className="absolute -left-16 top-0 space-y-0">
              {tokens.map((token, index) => (
                <div 
                  key={index} 
                  className={`
                    h-12 flex items-center justify-end pr-2 text-xs font-mono
                    ${highlightRow === index ? 'text-blue-600 font-bold' : 'text-gray-600'}
                  `}
                >
                  {token}
                </div>
              ))}
            </div>
          )}
          
          {/* Column labels */}
          {tokens.length > 0 && (
            <div className="flex mb-1 ml-0">
              {tokens.map((token, index) => (
                <div 
                  key={index} 
                  className={`
                    w-12 text-xs font-mono text-center transform -rotate-45 origin-bottom-left
                    ${highlightCol === index ? 'text-blue-600 font-bold' : 'text-gray-600'}
                  `}
                  style={{ height: '24px' }}
                >
                  {token}
                </div>
              ))}
            </div>
          )}

          {/* Matrix grid */}
          <div className="space-y-0">
            {cellStates.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cellState, colIndex) => (
                  <MatrixCell
                    key={`${rowIndex}-${colIndex}`}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    cellState={cellState}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color legend */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-xs font-medium text-gray-700 mb-2">Color Legend</div>
        <div className="flex items-center gap-4 text-xs">
          {mode === 'scores' ? (
            <>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colorFromScore(-2) }} />
                <span>Negative (dissimilar)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colorFromScore(0) }} />
                <span>Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colorFromScore(2) }} />
                <span>Positive (similar)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colorFromWeight(0) }} />
                <span>0% attention</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colorFromWeight(0.5) }} />
                <span>50% attention</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: colorFromWeight(1) }} />
                <span>100% attention</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Calculation progress */}
      {isCalculating && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>
            {mode === 'scores' ? 'Computing attention scores...' : 'Applying softmax transformation...'}
          </span>
          {calculationStep && (
            <span className="text-xs text-gray-500">
              ({calculationStep.row + 1}, {calculationStep.col + 1})
            </span>
          )}
        </div>
      )}
    </div>
  );
}