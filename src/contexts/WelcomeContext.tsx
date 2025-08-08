"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { welcomeStorage, LearningPath } from "@/lib/welcomeStorage";

interface WelcomeContextValue {
  // State
  isFirstVisit: boolean;
  learningPath: LearningPath;
  showWelcome: boolean;
  completedSteps: string[];
  preferences: {
    showTips: boolean;
    enableAnimations: boolean;
  };
  
  // Actions
  setLearningPath: (path: LearningPath) => void;
  markWelcomeSeen: (path: LearningPath) => void;
  showWelcomeModal: () => void;
  hideWelcomeModal: () => void;
  restartTour: () => void;
  markStepCompleted: (stepKey: string) => void;
  isStepCompleted: (stepKey: string) => boolean;
  updatePreferences: (preferences: Partial<{ showTips: boolean; enableAnimations: boolean }>) => void;
}

const WelcomeContext = createContext<WelcomeContextValue | undefined>(undefined);

export function useWelcome(): WelcomeContextValue {
  const context = useContext(WelcomeContext);
  if (!context) {
    throw new Error("useWelcome must be used within a WelcomeProvider");
  }
  return context;
}

interface WelcomeProviderProps {
  children: ReactNode;
}

export function WelcomeProvider({ children }: WelcomeProviderProps) {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [learningPath, setLearningPathState] = useState<LearningPath>("beginner");
  const [showWelcome, setShowWelcome] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    showTips: true,
    enableAnimations: true,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from localStorage on mount
  useEffect(() => {
    const firstVisit = welcomeStorage.isFirstVisit();
    const state = welcomeStorage.getState();
    
    setIsFirstVisit(firstVisit);
    setLearningPathState(state.learningPath);
    setCompletedSteps(state.completedSteps);
    setPreferences(state.preferences);
    
    // Show welcome modal on first visit
    if (firstVisit) {
      setShowWelcome(true);
    }
    
    setIsInitialized(true);
  }, []);

  const handleSetLearningPath = (path: LearningPath) => {
    setLearningPathState(path);
    welcomeStorage.setLearningPath(path);
  };

  const handleMarkWelcomeSeen = (path: LearningPath) => {
    setIsFirstVisit(false);
    setLearningPathState(path);
    welcomeStorage.markWelcomeSeen(path);
  };

  const handleShowWelcomeModal = () => {
    setShowWelcome(true);
  };

  const handleHideWelcomeModal = () => {
    setShowWelcome(false);
  };

  const handleRestartTour = () => {
    // Reset completed steps but keep the learning path and welcome seen status
    setCompletedSteps([]);
    welcomeStorage.setState({ completedSteps: [] });
    setShowWelcome(true);
  };

  const handleMarkStepCompleted = (stepKey: string) => {
    if (!completedSteps.includes(stepKey)) {
      const newCompletedSteps = [...completedSteps, stepKey];
      setCompletedSteps(newCompletedSteps);
      welcomeStorage.markStepCompleted(stepKey);
    }
  };

  const handleIsStepCompleted = (stepKey: string): boolean => {
    return completedSteps.includes(stepKey);
  };

  const handleUpdatePreferences = (newPreferences: Partial<{ showTips: boolean; enableAnimations: boolean }>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    welcomeStorage.setPreferences(updatedPreferences);
  };

  const contextValue: WelcomeContextValue = {
    // State
    isFirstVisit,
    learningPath,
    showWelcome,
    completedSteps,
    preferences,
    
    // Actions
    setLearningPath: handleSetLearningPath,
    markWelcomeSeen: handleMarkWelcomeSeen,
    showWelcomeModal: handleShowWelcomeModal,
    hideWelcomeModal: handleHideWelcomeModal,
    restartTour: handleRestartTour,
    markStepCompleted: handleMarkStepCompleted,
    isStepCompleted: handleIsStepCompleted,
    updatePreferences: handleUpdatePreferences,
  };

  // Don't render until initialized to prevent hydration mismatches
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <WelcomeContext.Provider value={contextValue}>
      {children}
    </WelcomeContext.Provider>
  );
}