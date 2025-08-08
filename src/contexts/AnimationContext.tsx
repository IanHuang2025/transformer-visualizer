"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AnimationSettings {
  enabled: boolean;
  speed: 'slow' | 'normal' | 'fast';
  reducedMotion: boolean;
}

interface AnimationState {
  isCalculating: boolean;
  currentStep: string | null;
  isTransitioning: boolean;
  showCelebration: boolean;
  completedSteps: Set<string>;
}

interface AnimationContextType {
  settings: AnimationSettings;
  state: AnimationState;
  updateSettings: (settings: Partial<AnimationSettings>) => void;
  startCalculation: (step: string) => void;
  stopCalculation: () => void;
  startTransition: () => void;
  stopTransition: () => void;
  showCelebration: () => void;
  hideCelebration: () => void;
  markStepCompleted: (step: string) => void;
  getAnimationDuration: (type: 'fast' | 'normal' | 'slow') => number;
  getAnimationDelay: (index: number) => number;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AnimationSettings>({
    enabled: true,
    speed: 'normal',
    reducedMotion: false
  });

  const [state, setState] = useState<AnimationState>({
    isCalculating: false,
    currentStep: null,
    isTransitioning: false,
    showCelebration: false,
    completedSteps: new Set()
  });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSettings(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AnimationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const startCalculation = useCallback((step: string) => {
    if (!settings.enabled || settings.reducedMotion) return;
    setState(prev => ({ ...prev, isCalculating: true, currentStep: step }));
  }, [settings]);

  const stopCalculation = useCallback(() => {
    setState(prev => ({ ...prev, isCalculating: false, currentStep: null }));
  }, []);

  const startTransition = useCallback(() => {
    if (!settings.enabled || settings.reducedMotion) return;
    setState(prev => ({ ...prev, isTransitioning: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 400);
  }, [settings]);

  const stopTransition = useCallback(() => {
    setState(prev => ({ ...prev, isTransitioning: false }));
  }, []);

  const showCelebration = useCallback(() => {
    if (!settings.enabled || settings.reducedMotion) return;
    setState(prev => ({ ...prev, showCelebration: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, showCelebration: false }));
    }, 3000);
  }, [settings]);

  const hideCelebration = useCallback(() => {
    setState(prev => ({ ...prev, showCelebration: false }));
  }, []);

  const markStepCompleted = useCallback((step: string) => {
    setState(prev => ({
      ...prev,
      completedSteps: new Set([...prev.completedSteps, step])
    }));
  }, []);

  const getAnimationDuration = useCallback((type: 'fast' | 'normal' | 'slow'): number => {
    if (settings.reducedMotion) return 0;
    
    const baseDurations = { fast: 200, normal: 400, slow: 800 };
    const speedMultipliers = { slow: 1.5, normal: 1, fast: 0.7 };
    
    return baseDurations[type] * speedMultipliers[settings.speed];
  }, [settings]);

  const getAnimationDelay = useCallback((index: number): number => {
    if (settings.reducedMotion) return 0;
    
    const baseDelay = settings.speed === 'fast' ? 50 : settings.speed === 'slow' ? 150 : 100;
    return index * baseDelay;
  }, [settings]);

  const contextValue: AnimationContextType = {
    settings,
    state,
    updateSettings,
    startCalculation,
    stopCalculation,
    startTransition,
    stopTransition,
    showCelebration,
    hideCelebration,
    markStepCompleted,
    getAnimationDuration,
    getAnimationDelay
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation(): AnimationContextType {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}

// Animation utility hooks
export function useAnimationClasses() {
  const { settings } = useAnimation();
  
  return {
    enabled: settings.enabled && !settings.reducedMotion,
    tokenSplit: settings.enabled && !settings.reducedMotion ? 'animate-token-split' : '',
    tokenHighlight: settings.enabled && !settings.reducedMotion ? 'animate-token-highlight' : '',
    matrixFill: settings.enabled && !settings.reducedMotion ? 'animate-matrix-fill' : '',
    softmax: settings.enabled && !settings.reducedMotion ? 'animate-softmax' : '',
    dataFlow: settings.enabled && !settings.reducedMotion ? 'animate-data-flow' : '',
    fadeInUp: settings.enabled && !settings.reducedMotion ? 'animate-fade-in-up' : '',
    celebration: settings.enabled && !settings.reducedMotion ? 'animate-celebration' : '',
    cardHover: settings.enabled && !settings.reducedMotion ? 'animate-card-hover' : '',
    buttonHover: settings.enabled && !settings.reducedMotion ? 'animate-button-hover' : ''
  };
}

// Timing utilities
export const AnimationTimings = {
  TOKENIZATION_DELAY: 100,
  MATRIX_FILL_DELAY: 50,
  SOFTMAX_DURATION: 800,
  STEP_TRANSITION: 400,
  CELEBRATION_DURATION: 3000
} as const;