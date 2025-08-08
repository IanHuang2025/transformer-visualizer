"use client";

export type LearningPath = "beginner" | "intermediate" | "advanced";

interface WelcomeState {
  hasSeenWelcome: boolean;
  learningPath: LearningPath;
  lastVisited: string;
  completedSteps: string[];
  preferences: {
    showTips: boolean;
    enableAnimations: boolean;
  };
}

const STORAGE_KEY = "transformer-visualizer-welcome";
const CURRENT_VERSION = "1.0.0";

const defaultState: WelcomeState = {
  hasSeenWelcome: false,
  learningPath: "beginner",
  lastVisited: new Date().toISOString(),
  completedSteps: [],
  preferences: {
    showTips: true,
    enableAnimations: true,
  },
};

// Safe localStorage operations with fallbacks
export const welcomeStorage = {
  // Check if this is the user's first visit
  isFirstVisit(): boolean {
    try {
      if (typeof window === "undefined") return true; // SSR safe
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return true;
      
      const state: WelcomeState = JSON.parse(stored);
      return !state.hasSeenWelcome;
    } catch (error) {
      console.warn("Failed to check first visit status:", error);
      return true; // Default to showing welcome on error
    }
  },

  // Get the current welcome state
  getState(): WelcomeState {
    try {
      if (typeof window === "undefined") return defaultState; // SSR safe
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultState;
      
      const state: WelcomeState = JSON.parse(stored);
      
      // Migrate or validate state if needed
      return {
        ...defaultState,
        ...state,
        preferences: {
          ...defaultState.preferences,
          ...state.preferences,
        },
      };
    } catch (error) {
      console.warn("Failed to get welcome state:", error);
      return defaultState;
    }
  },

  // Save the welcome state
  setState(state: Partial<WelcomeState>): void {
    try {
      if (typeof window === "undefined") return; // SSR safe
      
      const currentState = this.getState();
      const newState: WelcomeState = {
        ...currentState,
        ...state,
        lastVisited: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.warn("Failed to save welcome state:", error);
    }
  },

  // Mark that the user has seen the welcome
  markWelcomeSeen(learningPath: LearningPath): void {
    this.setState({
      hasSeenWelcome: true,
      learningPath,
    });
  },

  // Reset the welcome state (useful for testing or "restart tour")
  reset(): void {
    try {
      if (typeof window === "undefined") return; // SSR safe
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to reset welcome state:", error);
    }
  },

  // Update learning path
  setLearningPath(path: LearningPath): void {
    this.setState({ learningPath: path });
  },

  // Track completed steps
  markStepCompleted(stepKey: string): void {
    const currentState = this.getState();
    const completedSteps = [...currentState.completedSteps];
    
    if (!completedSteps.includes(stepKey)) {
      completedSteps.push(stepKey);
      this.setState({ completedSteps });
    }
  },

  // Check if a step is completed
  isStepCompleted(stepKey: string): boolean {
    const state = this.getState();
    return state.completedSteps.includes(stepKey);
  },

  // Update preferences
  setPreferences(preferences: Partial<WelcomeState["preferences"]>): void {
    const currentState = this.getState();
    this.setState({
      preferences: {
        ...currentState.preferences,
        ...preferences,
      },
    });
  },
};