"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useLearningJourney, JourneyStep } from "@/hooks/useLearningJourney";

interface ProgressiveRevealProps {
  step: JourneyStep;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ProgressiveReveal({ step, children, className = "", delay = 0 }: ProgressiveRevealProps) {
  const { currentStep, completedSteps, learningPath } = useLearningJourney();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Free exploration mode shows everything
  if (learningPath === 'free-explore') {
    return <div className={className}>{children}</div>;
  }

  // Determine if this step should be visible
  const shouldBeVisible = currentStep === step || completedSteps.has(step);

  useEffect(() => {
    if (shouldBeVisible && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shouldBeVisible, hasAnimated, delay]);

  // If not visible yet, render nothing
  if (!shouldBeVisible) {
    return null;
  }

  // If visible but not animated in yet, render with opacity 0
  if (shouldBeVisible && !isVisible) {
    return (
      <div 
        ref={elementRef}
        className={`opacity-0 ${className}`}
      >
        {children}
      </div>
    );
  }

  // Fully visible with animation
  return (
    <div 
      ref={elementRef}
      className={`transition-all duration-700 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface ProgressiveSectionProps {
  steps: JourneyStep[];
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function ProgressiveSection({ 
  steps, 
  children, 
  className = "", 
  staggerDelay = 200 
}: ProgressiveSectionProps) {
  const { currentStep, completedSteps, learningPath } = useLearningJourney();
  
  // Free exploration shows everything
  if (learningPath === 'free-explore') {
    return <div className={className}>{children}</div>;
  }

  // Check if any of the required steps are current or completed
  const shouldShow = steps.some(step => currentStep === step || completedSteps.has(step));

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`animate-fade-in-up ${className}`} style={{ animationDelay: `${staggerDelay}ms` }}>
      {children}
    </div>
  );
}

// Hook to manage step visibility
export function useStepVisibility(step: JourneyStep) {
  const { currentStep, completedSteps, learningPath } = useLearningJourney();
  
  if (learningPath === 'free-explore') {
    return { isVisible: true, isCurrent: false, isCompleted: false };
  }
  
  const isVisible = currentStep === step || completedSteps.has(step);
  const isCurrent = currentStep === step;
  const isCompleted = completedSteps.has(step);
  
  return { isVisible, isCurrent, isCompleted };
}

// Animation helper component
interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

export function AnimatedCounter({ target, duration = 1000, suffix = "" }: AnimatedCounterProps) {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [target, duration]);
  
  return <span>{current}{suffix}</span>;
}