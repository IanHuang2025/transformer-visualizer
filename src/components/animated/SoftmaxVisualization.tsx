"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnimation, useAnimationClasses } from '@/contexts/AnimationContext';
import { Play, RotateCcw, TrendingUp, Percent } from 'lucide-react';

interface SoftmaxVisualizationProps {
  beforeScores: number[];
  afterWeights: number[];
  labels?: string[];
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
  showMathematicalSteps?: boolean;
}

interface SoftmaxStep {
  step: number;
  title: string;
  values: number[];
  formula: string;
  description: string;
}

function _softmaxRow(scores: number[]): number[] {
  const maxScore = Math.max(...scores);
  const exps = scores.map(score => Math.exp(score - maxScore));
  const sum = exps.reduce((acc, val) => acc + val, 0);
  return exps.map(exp => exp / sum);
}

function round4(x: number): number {
  return Math.round(x * 10000) / 10000;
}

export default function SoftmaxVisualization({
  beforeScores,
  afterWeights,
  labels = [],
  isAnimating = false,
  onAnimationComplete,
  showMathematicalSteps = false
}: SoftmaxVisualizationProps) {
  const { state: _state, getAnimationDelay, getAnimationDuration: _getAnimationDuration } = useAnimation();
  const animationClasses = useAnimationClasses();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [softmaxSteps, setSoftmaxSteps] = useState<SoftmaxStep[]>([]);
  const [visibleBars, setVisibleBars] = useState<boolean[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate softmax steps
  useEffect(() => {
    if (beforeScores.length === 0) return;

    const maxScore = Math.max(...beforeScores);
    const shiftedScores = beforeScores.map(score => score - maxScore);
    const exps = shiftedScores.map(score => Math.exp(score));
    const sum = exps.reduce((acc, val) => acc + val, 0);
    const probabilities = exps.map(exp => exp / sum);

    const steps: SoftmaxStep[] = [
      {
        step: 0,
        title: "Original Scores",
        values: beforeScores,
        formula: "z = [z₁, z₂, ..., zₙ]",
        description: "These are the raw attention scores from Q·K computation"
      },
      {
        step: 1, 
        title: "Subtract Maximum (Numerical Stability)",
        values: shiftedScores,
        formula: "z' = z - max(z)",
        description: "Subtracting the maximum prevents overflow in exponential calculation"
      },
      {
        step: 2,
        title: "Apply Exponential",
        values: exps,
        formula: "exp(z') = [e^z'₁, e^z'₂, ..., e^z'ₙ]", 
        description: "Exponential function makes all values positive and amplifies differences"
      },
      {
        step: 3,
        title: "Normalize (Sum to 1)",
        values: probabilities,
        formula: "softmax(z) = exp(z') / Σexp(z')",
        description: "Division by sum converts to probabilities that sum to exactly 1.0"
      }
    ];

    setSoftmaxSteps(steps);
  }, [beforeScores]);

  // Handle animation
  useEffect(() => {
    if (isAnimating && softmaxSteps.length > 0) {
      animateSoftmaxTransformation();
    }
  }, [isAnimating, softmaxSteps.length]);

  const animateSoftmaxTransformation = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setVisibleBars(new Array(beforeScores.length).fill(false));

    for (let step = 0; step < softmaxSteps.length; step++) {
      setCurrentStep(step);
      
      // Animate bars appearing for this step
      for (let i = 0; i < beforeScores.length; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            setVisibleBars(prev => {
              const newVisible = [...prev];
              newVisible[i] = true;
              return newVisible;
            });
            resolve(void 0);
          }, getAnimationDelay(i));
        });
      }
      
      // Wait before next step
      if (step < softmaxSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVisibleBars(new Array(beforeScores.length).fill(false));
      }
    }
    
    setIsPlaying(false);
    onAnimationComplete?.();
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setVisibleBars(new Array(beforeScores.length).fill(true));
  };

  const SoftmaxBar = ({ 
    value, 
    index, 
    maxValue, 
    isVisible,
    step 
  }: { 
    value: number; 
    index: number; 
    maxValue: number;
    isVisible: boolean;
    step: number;
  }) => {
    const percentage = maxValue > 0 ? Math.abs(value) / maxValue : 0;
    const isNegative = value < 0;
    const isProbability = step === 3;
    
    // Color scheme based on step
    const getBarColor = () => {
      if (isProbability) {
        return `hsl(${200 + percentage * 100}, 70%, ${65 - percentage * 20}%)`;
      }
      return isNegative 
        ? `hsl(0, 70%, ${75 - percentage * 25}%)`
        : `hsl(120, 70%, ${75 - percentage * 25}%)`;
    };

    const displayValue = isProbability 
      ? `${(value * 100).toFixed(1)}%`
      : round4(value);

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-xs text-gray-600 font-mono min-h-4">
          {labels[index] || `#${index}`}
        </div>
        
        <div className={`
          relative w-12 bg-gray-100 rounded-lg overflow-hidden
          ${isVisible ? animationClasses.softmax : 'opacity-0'}
        `} 
        style={{ 
          height: '120px',
          animationDelay: `${getAnimationDelay(index)}ms`
        }}>
          {/* Background grid */}
          <div className="absolute inset-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-full border-t border-gray-200"
                style={{ top: `${i * 25}%` }}
              />
            ))}
          </div>
          
          {/* Value bar */}
          <div
            className={`
              absolute bottom-0 w-full transition-all duration-500 rounded-t-sm
              ${isVisible ? 'scale-y-100' : 'scale-y-0'}
            `}
            style={{
              height: `${percentage * 100}%`,
              backgroundColor: getBarColor(),
              transformOrigin: 'bottom',
              animationDelay: `${getAnimationDelay(index)}ms`
            }}
          />
          
          {/* Value label */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <div className={`
              text-xs font-mono font-bold bg-white/90 rounded px-1 inline-block
              transition-all duration-300
              ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
            `}>
              {displayValue}
            </div>
          </div>
        </div>
        
        {/* Probability indicator for final step */}
        {isProbability && isVisible && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Percent className="w-3 h-3" />
            <span>Prob</span>
          </div>
        )}
      </div>
    );
  };

  if (beforeScores.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No scores to visualize
        </CardContent>
      </Card>
    );
  }

  const currentStepData = softmaxSteps[currentStep] || softmaxSteps[0];
  const maxValue = Math.max(...currentStepData.values.map(Math.abs));

  return (
    <Card className={animationClasses.cardHover}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Softmax Transformation
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => animateSoftmaxTransformation()}
              disabled={isPlaying || beforeScores.length === 0}
            >
              <Play className="w-4 h-4 mr-1" />
              {isPlaying ? 'Playing...' : 'Animate'}
            </Button>
            <Button variant="outline" size="sm" onClick={resetAnimation}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-2">
          {softmaxSteps.map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-300
                ${currentStep === index 
                  ? 'bg-purple-600 text-white scale-110' 
                  : currentStep > index
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {index + 1}
              </div>
              {index < softmaxSteps.length - 1 && (
                <div className={`
                  w-8 h-0.5 mx-1 transition-all duration-300
                  ${currentStep > index ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Current step info */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="space-y-2">
            <div className="font-semibold text-purple-900">
              Step {currentStep + 1}: {currentStepData.title}
            </div>
            <div className="text-sm text-purple-800">
              {currentStepData.description}
            </div>
            {showMathematicalSteps && (
              <div className="bg-white p-2 rounded font-mono text-sm border">
                {currentStepData.formula}
              </div>
            )}
          </div>
        </div>

        {/* Visualization */}
        <div ref={containerRef} className="space-y-4">
          <div className="flex justify-center items-end gap-3 p-4 bg-gray-50 rounded-lg min-h-[180px]">
            {currentStepData.values.map((value, index) => (
              <SoftmaxBar
                key={index}
                value={value}
                index={index}
                maxValue={maxValue}
                isVisible={visibleBars[index] || !isPlaying}
                step={currentStep}
              />
            ))}
          </div>

          {/* Sum verification for final step */}
          {currentStep === 3 && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-800">
                <div className="font-medium mb-1">✓ Probability Check</div>
                <div>
                  Sum of all probabilities: {' '}
                  <span className="font-mono">
                    {currentStepData.values.reduce((sum, val) => sum + val, 0).toFixed(6)}
                  </span>
                  {' '}≈ 1.000000
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Before/After comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="text-sm font-medium text-red-900 mb-2">Before (Raw Scores)</div>
            <div className="space-y-1">
              {beforeScores.map((score, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-red-700">{labels[index] || `Token ${index}`}:</span>
                  <span className="font-mono text-red-800">{round4(score)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-red-600">
              Range: {round4(Math.min(...beforeScores))} to {round4(Math.max(...beforeScores))}
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-900 mb-2">After (Probabilities)</div>
            <div className="space-y-1">
              {afterWeights.map((weight, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-green-700">{labels[index] || `Token ${index}`}:</span>
                  <span className="font-mono text-green-800">{(weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-green-600">
              Sum: {(afterWeights.reduce((sum, val) => sum + val, 0) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Key insights */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-900">
            <div className="font-medium mb-2">🧠 Key Insights:</div>
            <ul className="space-y-1 text-sm">
              <li>• Softmax preserves the <strong>relative ordering</strong> of values</li>
              <li>• Larger differences become more <strong>pronounced</strong> after exponential</li>
              <li>• All outputs are <strong>positive</strong> and sum to exactly <strong>1.0</strong></li>
              <li>• Acts as a "soft" version of winner-take-all selection</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}