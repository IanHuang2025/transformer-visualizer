"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Learning path types
export type LearningPath = 'beginner' | 'intermediate' | 'free-explore';

// Journey steps - matches the 6-step transformer pipeline
export type JourneyStep = 
  | 'welcome'
  | 'text-input'
  | 'tokenization'
  | 'attention-intro'
  | 'heads-setup'
  | 'advanced-settings'
  | 'embed'
  | 'qkv'
  | 'scores'
  | 'softmax'
  | 'weighted'
  | 'mh'
  | 'complete';

// Concept completion status
export interface ConceptStatus {
  step: JourneyStep;
  completed: boolean;
  interacted: boolean;
  quizPassed: boolean;
  timestamp?: Date;
}

// Learning journey state
export interface LearningJourneyState {
  // Core progression
  currentStep: JourneyStep;
  completedSteps: Set<JourneyStep>;
  learningPath: LearningPath;
  
  // Concept mastery tracking
  conceptStatuses: Map<JourneyStep, ConceptStatus>;
  
  // UI state
  showOnboarding: boolean;
  showProgressBar: boolean;
  
  // User interactions
  hasEnteredText: boolean;
  hasSelectedToken: boolean;
  hasExploredHeads: boolean;
  hasToggledSettings: boolean;
  
  // Quiz states
  quizScores: Map<JourneyStep, number>;
  
  // Actions
  setCurrentStep: (step: JourneyStep) => void;
  completeStep: (step: JourneyStep) => void;
  setLearningPath: (path: LearningPath) => void;
  markInteraction: (step: JourneyStep, interactionType: string) => void;
  updateQuizScore: (step: JourneyStep, score: number) => void;
  resetJourney: () => void;
  canProceedToStep: (step: JourneyStep) => boolean;
  getProgressPercentage: () => number;
}

// Local storage keys
const STORAGE_KEY = 'transformer-visualizer-progress';

// Step dependencies and validation requirements
const STEP_REQUIREMENTS: Record<JourneyStep, {
  prerequisite?: JourneyStep;
  validationChecks?: string[];
}> = {
  'welcome': {},
  'text-input': { prerequisite: 'welcome' },
  'tokenization': { 
    prerequisite: 'text-input',
    validationChecks: ['hasEnteredText']
  },
  'attention-intro': { prerequisite: 'tokenization' },
  'heads-setup': { prerequisite: 'attention-intro' },
  'advanced-settings': { prerequisite: 'heads-setup' },
  'embed': { 
    prerequisite: 'advanced-settings',
    validationChecks: ['hasSelectedToken']
  },
  'qkv': { prerequisite: 'embed' },
  'scores': { prerequisite: 'qkv' },
  'softmax': { prerequisite: 'scores' },
  'weighted': { prerequisite: 'softmax' },
  'mh': { prerequisite: 'weighted' },
  'complete': { prerequisite: 'mh' }
};

// Step progression order
const STEP_ORDER: JourneyStep[] = [
  'welcome',
  'text-input', 
  'tokenization',
  'attention-intro',
  'heads-setup',
  'advanced-settings',
  'embed',
  'qkv',
  'scores', 
  'softmax',
  'weighted',
  'mh',
  'complete'
];

// Create context
const LearningJourneyContext = createContext<LearningJourneyState | null>(null);

// Load state from localStorage
function loadJourneyState(): Partial<LearningJourneyState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      completedSteps: new Set(parsed.completedSteps || []),
      conceptStatuses: new Map(parsed.conceptStatuses || []),
      quizScores: new Map(parsed.quizScores || [])
    };
  } catch {
    return {};
  }
}

// Save state to localStorage
function saveJourneyState(state: LearningJourneyState) {
  try {
    const toSave = {
      currentStep: state.currentStep,
      completedSteps: Array.from(state.completedSteps),
      learningPath: state.learningPath,
      conceptStatuses: Array.from(state.conceptStatuses.entries()),
      hasEnteredText: state.hasEnteredText,
      hasSelectedToken: state.hasSelectedToken,
      hasExploredHeads: state.hasExploredHeads,
      hasToggledSettings: state.hasToggledSettings,
      quizScores: Array.from(state.quizScores.entries()),
      showOnboarding: state.showOnboarding
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Handle localStorage errors gracefully
  }
}

// Provider component
export function LearningJourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningJourneyState>(() => {
    const stored = loadJourneyState();
    
    return {
      // Core progression
      currentStep: stored.currentStep || 'welcome',
      completedSteps: stored.completedSteps || new Set(),
      learningPath: stored.learningPath || 'beginner',
      
      // Concept tracking
      conceptStatuses: stored.conceptStatuses || new Map(),
      
      // UI state
      showOnboarding: stored.showOnboarding !== false, // Default to true
      showProgressBar: true,
      
      // User interactions
      hasEnteredText: stored.hasEnteredText || false,
      hasSelectedToken: stored.hasSelectedToken || false,
      hasExploredHeads: stored.hasExploredHeads || false,
      hasToggledSettings: stored.hasToggledSettings || false,
      
      // Quiz tracking
      quizScores: stored.quizScores || new Map(),
      
      // Actions (will be set below)
      setCurrentStep: () => {},
      completeStep: () => {},
      setLearningPath: () => {},
      markInteraction: () => {},
      updateQuizScore: () => {},
      resetJourney: () => {},
      canProceedToStep: () => false,
      getProgressPercentage: () => 0
    };
  });

  // Validation function
  const canProceedToStep = (targetStep: JourneyStep): boolean => {
    if (state.learningPath === 'free-explore') return true;
    
    const requirements = STEP_REQUIREMENTS[targetStep];
    
    // Check prerequisite completion
    if (requirements.prerequisite && !state.completedSteps.has(requirements.prerequisite)) {
      return false;
    }
    
    // Check validation requirements
    if (requirements.validationChecks) {
      for (const check of requirements.validationChecks) {
        switch (check) {
          case 'hasEnteredText':
            if (!state.hasEnteredText) return false;
            break;
          case 'hasSelectedToken':
            if (!state.hasSelectedToken) return false;
            break;
          case 'hasExploredHeads':
            if (!state.hasExploredHeads) return false;
            break;
          case 'hasToggledSettings':
            if (!state.hasToggledSettings) return false;
            break;
        }
      }
    }
    
    return true;
  };

  // Progress calculation
  const getProgressPercentage = (): number => {
    const totalSteps = STEP_ORDER.length - 1; // Exclude 'complete'
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    return Math.min(100, (currentIndex / totalSteps) * 100);
  };

  // Actions
  const actions = {
    setCurrentStep: (step: JourneyStep) => {
      setState(prev => ({ ...prev, currentStep: step }));
    },
    
    completeStep: (step: JourneyStep) => {
      setState(prev => {
        const newCompletedSteps = new Set(prev.completedSteps);
        newCompletedSteps.add(step);
        
        const newConceptStatuses = new Map(prev.conceptStatuses);
        newConceptStatuses.set(step, {
          step,
          completed: true,
          interacted: true,
          quizPassed: prev.quizScores.get(step) ? prev.quizScores.get(step)! > 0.7 : true,
          timestamp: new Date()
        });
        
        return {
          ...prev,
          completedSteps: newCompletedSteps,
          conceptStatuses: newConceptStatuses
        };
      });
    },
    
    setLearningPath: (path: LearningPath) => {
      setState(prev => ({
        ...prev,
        learningPath: path,
        showOnboarding: path !== 'free-explore'
      }));
    },
    
    markInteraction: (step: JourneyStep, interactionType: string) => {
      setState(prev => {
        const updates: Partial<LearningJourneyState> = {};
        
        switch (interactionType) {
          case 'text-entered':
            updates.hasEnteredText = true;
            break;
          case 'token-selected':
            updates.hasSelectedToken = true;
            break;
          case 'head-explored':
            updates.hasExploredHeads = true;
            break;
          case 'setting-toggled':
            updates.hasToggledSettings = true;
            break;
        }
        
        const newConceptStatuses = new Map(prev.conceptStatuses);
        const existing = newConceptStatuses.get(step) || { step, completed: false, interacted: false, quizPassed: false };
        newConceptStatuses.set(step, { ...existing, interacted: true });
        
        return {
          ...prev,
          ...updates,
          conceptStatuses: newConceptStatuses
        };
      });
    },
    
    updateQuizScore: (step: JourneyStep, score: number) => {
      setState(prev => {
        const newQuizScores = new Map(prev.quizScores);
        newQuizScores.set(step, score);
        
        const newConceptStatuses = new Map(prev.conceptStatuses);
        const existing = newConceptStatuses.get(step) || { step, completed: false, interacted: false, quizPassed: false };
        newConceptStatuses.set(step, { ...existing, quizPassed: score > 0.7 });
        
        return {
          ...prev,
          quizScores: newQuizScores,
          conceptStatuses: newConceptStatuses
        };
      });
    },
    
    resetJourney: () => {
      setState(prev => ({
        ...prev,
        currentStep: 'welcome',
        completedSteps: new Set(),
        conceptStatuses: new Map(),
        showOnboarding: true,
        hasEnteredText: false,
        hasSelectedToken: false,
        hasExploredHeads: false,
        hasToggledSettings: false,
        quizScores: new Map()
      }));
    },
    
    canProceedToStep,
    getProgressPercentage
  };

  const stateWithActions = { ...state, ...actions };

  // Save to localStorage on state changes
  useEffect(() => {
    saveJourneyState(stateWithActions);
  }, [state, stateWithActions]);

  return (
    <LearningJourneyContext.Provider value={stateWithActions}>
      {children}
    </LearningJourneyContext.Provider>
  );
}

// Hook to use the learning journey context
export function useLearningJourney(): LearningJourneyState {
  const context = useContext(LearningJourneyContext);
  if (!context) {
    throw new Error('useLearningJourney must be used within a LearningJourneyProvider');
  }
  return context;
}

// Helper functions
export function getNextStep(currentStep: JourneyStep): JourneyStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === STEP_ORDER.length - 1) {
    return null;
  }
  return STEP_ORDER[currentIndex + 1];
}

export function getPreviousStep(currentStep: JourneyStep): JourneyStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return STEP_ORDER[currentIndex - 1];
}

export function getStepTitle(step: JourneyStep): string {
  const titles: Record<JourneyStep, string> = {
    'welcome': 'Welcome to Transformer Attention',
    'text-input': 'Enter Your Text',
    'tokenization': 'Understanding Tokens',
    'attention-intro': 'What is Attention?',
    'heads-setup': 'Multiple Perspectives',
    'advanced-settings': 'Fine-tuning Options',
    'embed': 'Token Embeddings',
    'qkv': 'Query, Key & Value',
    'scores': 'Attention Scores',
    'softmax': 'Softmax Weights',
    'weighted': 'Weighted Values',
    'mh': 'Multi-Head Output',
    'complete': 'Journey Complete!'
  };
  return titles[step] || step;
}

export function getStepDescription(step: JourneyStep): string {
  const descriptions: Record<JourneyStep, string> = {
    'welcome': 'Learn how transformers understand relationships between words',
    'text-input': 'Start with a sentence to analyze',
    'tokenization': 'See how text becomes tokens',
    'attention-intro': 'Discover the core concept of attention',
    'heads-setup': 'Learn about multiple attention perspectives',
    'advanced-settings': 'Explore positional encodings and causal masking',
    'embed': 'Convert words to mathematical representations',
    'qkv': 'Transform embeddings into queries, keys, and values',
    'scores': 'Calculate how much tokens relate to each other',
    'softmax': 'Convert scores to attention probabilities',
    'weighted': 'Combine information using attention weights',
    'mh': 'Integrate multiple attention heads',
    'complete': 'You\'ve mastered transformer attention!'
  };
  return descriptions[step] || step;
}