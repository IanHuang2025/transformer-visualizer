"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnimation, useAnimationClasses } from '@/contexts/AnimationContext';
import { Play, RotateCcw, GitMerge, ArrowRight, Zap } from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  inputData: number[][];
  outputData: number[][];
  operation: string;
}

interface InformationFlowVisualizerProps {
  steps: FlowStep[];
  currentStep: number;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
  showMultiHeadMerging?: boolean;
  headOutputs?: number[][][]; // [head][token][dim]
  finalOutput?: number[][];
  tokens?: string[];
}

interface FlowParticle {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  speed: number;
  opacity: number;
}

function round4(x: number): number {
  return Math.round(x * 1000) / 1000;
}

export default function InformationFlowVisualizer({
  steps,
  currentStep: _currentStep,
  isAnimating: _isAnimating = false,
  onAnimationComplete,
  showMultiHeadMerging = false,
  headOutputs = [],
  finalOutput = [],
  tokens: _tokens = []
}: InformationFlowVisualizerProps) {
  const { state: _state, getAnimationDelay: _getAnimationDelay, getAnimationDuration: _getAnimationDuration } = useAnimation();
  const animationClasses = useAnimationClasses();
  const [flowParticles, setFlowParticles] = useState<FlowParticle[]>([]);
  const [isFlowActive, setIsFlowActive] = useState(false);
  const [currentFlowStep, setCurrentFlowStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation frame for particles
  const animationFrameRef = useRef<number>();

  // Generate flow particles
  const generateFlowParticles = (fromElement: string, toElement: string, count: number = 20) => {
    const particles: FlowParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      const particle: FlowParticle = {
        id: `particle-${Date.now()}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        targetX: Math.random() * 100,
        targetY: Math.random() * 100,
        color: `hsl(${200 + Math.random() * 160}, 70%, 60%)`,
        size: 2 + Math.random() * 4,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7
      };
      particles.push(particle);
    }
    
    return particles;
  };

  // Start flow animation
  const startFlowAnimation = () => {
    if (steps.length === 0) return;
    
    setIsFlowActive(true);
    setCurrentFlowStep(0);
    
    const animateStep = async (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setIsFlowActive(false);
        onAnimationComplete?.();
        return;
      }
      
      setCurrentFlowStep(stepIndex);
      const particles = generateFlowParticles('input', 'output', 15);
      setFlowParticles(particles);
      
      // Animate particles for this step
      await new Promise(resolve => {
        setTimeout(() => {
          setFlowParticles([]);
          resolve(void 0);
        }, 2000);
      });
      
      // Move to next step
      setTimeout(() => animateStep(stepIndex + 1), 500);
    };
    
    animateStep(0);
  };

  // Multi-head merging animation
  const animateMultiHeadMerging = async () => {
    if (headOutputs.length === 0) return;
    
    setIsFlowActive(true);
    
    // Step 1: Show individual head outputs
    for (let head = 0; head < headOutputs.length; head++) {
      const particles = generateFlowParticles(`head-${head}`, 'concat', 10);
      setFlowParticles(particles);
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Step 2: Show concatenation
    const concatParticles = generateFlowParticles('concat', 'output', 20);
    setFlowParticles(concatParticles);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setFlowParticles([]);
    setIsFlowActive(false);
    onAnimationComplete?.();
  };

  // Particle animation loop
  useEffect(() => {
    if (!isFlowActive || flowParticles.length === 0) return;
    
    const animate = () => {
      setFlowParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + (particle.targetX - particle.x) * 0.02,
        y: particle.y + (particle.targetY - particle.y) * 0.02,
        opacity: Math.max(0, particle.opacity - 0.005)
      })).filter(particle => particle.opacity > 0.1));
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFlowActive, flowParticles.length]);

  const DataFlowArrow = ({ 
    from, 
    to, 
    label, 
    isActive = false 
  }: { 
    from: string; 
    to: string; 
    label: string; 
    isActive?: boolean;
  }) => (
    <div className={`
      flex items-center justify-center py-2 transition-all duration-500
      ${isActive ? 'scale-110' : 'scale-100'}
    `}>
      <div className={`
        flex items-center gap-2 px-3 py-1 rounded-full border-2 transition-all duration-300
        ${isActive 
          ? 'bg-blue-100 border-blue-500 text-blue-800 shadow-lg' 
          : 'bg-gray-50 border-gray-300 text-gray-600'
        }
      `}>
        <ArrowRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
        <span className="text-sm font-medium">{label}</span>
        {isActive && animationClasses.enabled && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );

  const DataVisualization = ({ 
    data, 
    title, 
    isHighlighted = false,
    showValues = false 
  }: { 
    data: number[][]; 
    title: string; 
    isHighlighted?: boolean;
    showValues?: boolean;
  }) => {
    if (data.length === 0) return null;
    
    return (
      <div className={`
        p-3 rounded-lg border-2 transition-all duration-300 relative overflow-hidden
        ${isHighlighted 
          ? 'bg-blue-50 border-blue-400 shadow-lg' 
          : 'bg-gray-50 border-gray-300'
        }
      `}>
        <div className={`
          text-sm font-semibold mb-2 transition-colors duration-300
          ${isHighlighted ? 'text-blue-900' : 'text-gray-700'}
        `}>
          {title}
        </div>
        
        <div className="space-y-1">
          {data.slice(0, 3).map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.slice(0, 4).map((value, colIndex) => {
                const intensity = Math.min(Math.abs(value), 1);
                const hue = value > 0 ? 120 : 0;
                
                return (
                  <div
                    key={colIndex}
                    className={`
                      w-6 h-6 rounded text-xs flex items-center justify-center font-mono
                      transition-all duration-300
                      ${isHighlighted && animationClasses.enabled ? 'animate-pulse' : ''}
                    `}
                    style={{
                      backgroundColor: `hsl(${hue}, 70%, ${80 - intensity * 30}%)`,
                      color: intensity > 0.5 ? 'white' : 'black'
                    }}
                    title={`${round4(value)}`}
                  >
                    {showValues ? round4(value) : ''}
                  </div>
                );
              })}
              {row.length > 4 && (
                <div className="flex items-center text-xs text-gray-500">...</div>
              )}
            </div>
          ))}
          {data.length > 3 && (
            <div className="text-xs text-gray-500 text-center">...</div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          {data.length}×{data[0]?.length || 0} matrix
        </div>
        
        {/* Flow particles overlay */}
        {isHighlighted && flowParticles.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {flowParticles.map(particle => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 rounded-full animate-pulse"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  transform: `scale(${particle.size / 2})`
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const MultiHeadVisualization = () => {
    if (!showMultiHeadMerging || headOutputs.length === 0) return null;
    
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-purple-600" />
            Multi-Head Information Merging
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-purple-700">
            Watch how information from multiple attention heads gets combined:
          </div>
          
          {/* Individual heads */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {headOutputs.map((headOutput, headIndex) => (
              <DataVisualization
                key={headIndex}
                data={headOutput}
                title={`Head ${headIndex}`}
                isHighlighted={isFlowActive && currentFlowStep === headIndex}
              />
            ))}
          </div>
          
          <DataFlowArrow
            from="heads"
            to="concat"
            label="Concatenate"
            isActive={isFlowActive}
          />
          
          {/* Concatenated output */}
          {finalOutput.length > 0 && (
            <DataVisualization
              data={finalOutput}
              title="Final Multi-Head Output"
              isHighlighted={isFlowActive}
              showValues={true}
            />
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={animateMultiHeadMerging}
              disabled={isFlowActive}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Animate Merging
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main flow visualization */}
      {steps.length > 0 && (
        <Card className={animationClasses.cardHover}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Information Flow Pipeline
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startFlowAnimation}
                  disabled={isFlowActive}
                >
                  <Play className="w-4 h-4 mr-1" />
                  {isFlowActive ? 'Flowing...' : 'Start Flow'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsFlowActive(false)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6" ref={containerRef}>
            {/* Flow steps */}
            {steps.map((step, stepIndex) => (
              <div 
                key={step.id}
                className={`
                  space-y-3 p-4 rounded-lg transition-all duration-500
                  ${stepIndex === currentFlowStep && isFlowActive
                    ? 'bg-blue-50 border-2 border-blue-300 shadow-lg' 
                    : 'bg-gray-50 border border-gray-200'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`
                    font-semibold transition-colors duration-300
                    ${stepIndex === currentFlowStep && isFlowActive 
                      ? 'text-blue-900' 
                      : 'text-gray-700'
                    }
                  `}>
                    {stepIndex + 1}. {step.title}
                  </h3>
                  
                  {stepIndex === currentFlowStep && isFlowActive && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      Processing...
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  {step.description}
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <DataVisualization
                    data={step.inputData}
                    title="Input"
                    isHighlighted={stepIndex === currentFlowStep && isFlowActive}
                  />
                  
                  <DataFlowArrow
                    from="input"
                    to="output"
                    label={step.operation}
                    isActive={stepIndex === currentFlowStep && isFlowActive}
                  />
                  
                  <DataVisualization
                    data={step.outputData}
                    title="Output"
                    isHighlighted={stepIndex === currentFlowStep && isFlowActive}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Multi-head merging visualization */}
      <MultiHeadVisualization />
      
      {/* Flow insights */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Information Flow Insights
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <div className="font-medium text-sm">Token-to-Token Communication</div>
                  <div className="text-xs text-gray-600">Information flows between all token positions through attention weights</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <div className="font-medium text-sm">Weighted Combination</div>
                  <div className="text-xs text-gray-600">Each token's output is a weighted sum of all value vectors</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <div className="font-medium text-sm">Multi-Head Fusion</div>
                  <div className="text-xs text-gray-600">Different attention heads capture different relationship types</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm font-medium mb-2">🔄 Key Flow Patterns:</div>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• <strong>Parallel Processing:</strong> All heads work simultaneously</div>
                <div>• <strong>Context Mixing:</strong> Each position gets info from all others</div>
                <div>• <strong>Selective Focus:</strong> Attention weights control information flow</div>
                <div>• <strong>Representation Enrichment:</strong> Final output contains contextual information</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}