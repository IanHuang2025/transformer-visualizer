"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnimation, useAnimationClasses } from '@/contexts/AnimationContext';
import { ChevronLeft, ChevronRight, CheckCircle, Trophy, Star, Zap } from 'lucide-react';

interface Step {
  key: string;
  label: string;
  shortLabel: string;
  description?: string;
  isCompleted?: boolean;
}

interface StepTransitionsProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
  completedSteps: Set<string>;
  showProgress?: boolean;
  showCelebration?: boolean;
  onCelebrationEnd?: () => void;
  disabled?: boolean;
}

interface CelebrationParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export default function StepTransitions({
  steps,
  currentStep,
  onStepChange,
  completedSteps,
  showProgress = true,
  showCelebration = false,
  onCelebrationEnd,
  disabled = false
}: StepTransitionsProps) {
  const { state, getAnimationDelay, startTransition } = useAnimation();
  const animationClasses = useAnimationClasses();
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const celebrationRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const currentStepData = steps[currentStep];
  const canGoPrev = currentStep > 0 && !disabled;
  const canGoNext = currentStep < steps.length - 1 && !disabled;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const allStepsCompleted = steps.every(step => completedSteps.has(step.key));

  // Generate celebration particles
  const createCelebrationParticles = (count: number = 30) => {
    const newParticles: CelebrationParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      const particle: CelebrationParticle = {
        id: `particle-${Date.now()}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        size: 2 + Math.random() * 4,
        life: 60,
        maxLife: 60
      };
      newParticles.push(particle);
    }
    
    return newParticles;
  };

  // Celebration animation
  useEffect(() => {
    if (showCelebration && animationClasses.enabled) {
      const newParticles = createCelebrationParticles(50);
      setParticles(newParticles);
      
      const animateParticles = () => {
        setParticles(prevParticles => {
          const updatedParticles = prevParticles
            .map(particle => ({
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vy: particle.vy + 0.1, // gravity
              life: particle.life - 1
            }))
            .filter(particle => particle.life > 0 && particle.y < 110);
          
          if (updatedParticles.length === 0) {
            onCelebrationEnd?.();
          }
          
          return updatedParticles;
        });
        
        if (particles.length > 0) {
          animationFrameRef.current = requestAnimationFrame(animateParticles);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showCelebration, animationClasses.enabled, onCelebrationEnd, particles.length]);

  const handleStepChange = async (newStepIndex: number) => {
    if (isTransitioning || disabled) return;
    
    setIsTransitioning(true);
    startTransition();
    
    // Animate transition
    await new Promise(resolve => setTimeout(resolve, 200));
    
    onStepChange(newStepIndex);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsTransitioning(false);
  };

  const goPrevious = () => handleStepChange(currentStep - 1);
  const goNext = () => handleStepChange(currentStep + 1);

  const StepIndicator = ({ step, index }: { step: Step; index: number }) => {
    const isCompleted = completedSteps.has(step.key);
    const isCurrent = index === currentStep;
    const isPast = index < currentStep;
    
    return (
      <button
        className={`
          relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
          transition-all duration-300 transform hover:scale-105
          ${isCurrent 
            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300' 
            : isCompleted
            ? 'bg-green-500 text-white shadow-md'
            : isPast
            ? 'bg-gray-400 text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }
          ${isTransitioning && isCurrent ? animationClasses.tokenSelection : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && handleStepChange(index)}
        disabled={disabled}
        title={`${step.label}${isCompleted ? ' (Completed)' : ''}`}
      >
        {isCompleted ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <span>{index + 1}</span>
        )}
        
        {/* Current step pulse */}
        {isCurrent && !disabled && animationClasses.enabled && (
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30" />
        )}
      </button>
    );
  };

  const StepConnector = ({ isCompleted }: { isCompleted: boolean }) => (
    <div className={`
      flex-1 h-1 mx-2 rounded-full transition-all duration-500
      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
    `} />
  );

  return (
    <Card className={`relative overflow-hidden ${animationClasses.cardHover}`}>
      {/* Celebration particles */}
      {showCelebration && particles.length > 0 && (
        <div ref={celebrationRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.life / particle.maxLife,
                transform: `translate(-50%, -50%)`
              }}
            />
          ))}
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrevious}
              disabled={!canGoPrev || isTransitioning}
              className={animationClasses.buttonHover}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            
            <div className="text-center">
              <div className={`
                text-lg font-semibold transition-all duration-300
                ${isTransitioning ? 'scale-110 text-blue-600' : 'text-gray-900'}
              `}>
                {currentStepData?.label || 'Unknown Step'}
              </div>
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            
            <Button
              variant="outline" 
              size="sm"
              onClick={goNext}
              disabled={!canGoNext || isTransitioning}
              className={animationClasses.buttonHover}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Celebration indicator */}
          {allStepsCompleted && (
            <div className={`
              flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-yellow-100 
              rounded-full border border-green-300 text-green-800 text-sm font-medium
              ${animationClasses.celebration}
            `}>
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span>Completed!</span>
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`
                  h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500
                  ${animationClasses.progressFill}
                `}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Step indicators */}
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <StepIndicator step={step} index={index} />
              {index < steps.length - 1 && (
                <StepConnector isCompleted={completedSteps.has(step.key)} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Current step description */}
        {currentStepData?.description && (
          <div className={`
            text-center text-sm text-gray-600 p-3 bg-gray-50 rounded-lg
            ${animationClasses.fadeInUp}
          `}>
            {currentStepData.description}
          </div>
        )}

        {/* Transition indicator */}
        {isTransitioning && (
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>Transitioning...</span>
          </div>
        )}

        {/* Completion stats */}
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Completed: {completedSteps.size}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-gray-300" />
            <span>Remaining: {steps.length - completedSteps.size}</span>
          </div>
        </div>

        {/* Navigation tips */}
        <div className="text-xs text-center text-gray-500 space-y-1">
          <div>Use Previous/Next buttons or click step numbers to navigate</div>
          {!disabled && (
            <div>Complete each step to unlock the next learning phase</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}