/**
 * Guided Tour Configurations
 * ==========================
 * 
 * Complete tour definitions for different learning paths through the transformer visualizer.
 * Each tour is carefully crafted to build understanding progressively.
 */

import { TourConfiguration } from "@/components/educational/GuidedTour";

export const TOUR_CONFIGURATIONS: TourConfiguration[] = [
  {
    id: "transformer-basics",
    title: "Transformer Basics Tour",
    description: "Your first journey through transformer attention. Perfect for beginners who want to understand the fundamental concepts.",
    difficulty: "beginner",
    estimatedDuration: "10-12 minutes",
    prerequisites: [],
    learningObjectives: [
      "Understand what attention heads are and why we need multiple ones",
      "Learn how sentence input affects attention patterns",
      "Discover the role of positional encodings",
      "See how causal masking changes model behavior"
    ],
    steps: [
      {
        id: "welcome",
        title: "Welcome to Transformer Attention!",
        content: "This tour will guide you through the key concepts of how transformers process text. We'll explore each component step by step.",
        target: "[data-panel='sentence-settings']",
        placement: "right",
        difficulty: "beginner",
        estimatedTime: "1 min",
        tip: "Take your time to read each step carefully. You can pause or go back anytime!"
      },
      {
        id: "sentence-input",
        title: "Starting with Text Input",
        content: "Every transformer analysis begins with text. This is where you input the sentence that will be analyzed by the attention mechanism.",
        target: "[data-panel='sentence-settings'] input",
        placement: "top",
        action: "observe",
        actionDescription: "Look at the current sentence and notice how it's broken down into tokens below.",
        difficulty: "beginner",
        estimatedTime: "1 min",
        tip: "Try typing a simple sentence like 'The cat sat on the mat' to see how it gets tokenized."
      },
      {
        id: "educational-presets",
        title: "Learning with Examples",
        content: "These preset sentences are specially chosen to demonstrate different linguistic phenomena. Each teaches something specific about attention.",
        target: "[data-panel='sentence-settings'] select",
        placement: "bottom",
        action: "click",
        actionDescription: "Click the dropdown and select the 'Simple Subject-Verb-Object' example.",
        difficulty: "beginner",
        estimatedTime: "1 min"
      },
      {
        id: "token-analysis",
        title: "Understanding Tokens",
        content: "Tokens are the basic units that transformers work with. See how your sentence gets broken down and classified by type.",
        target: "[data-panel='sentence-settings'] .bg-gray-50",
        placement: "left",
        action: "observe",
        actionDescription: "Notice the colored tokens - blue for content words, yellow for function words, gray for punctuation.",
        difficulty: "beginner",
        estimatedTime: "1 min",
        tip: "Content words carry meaning, function words provide structure, and punctuation marks boundaries."
      },
      {
        id: "attention-heads-intro",
        title: "Meet the Attention Heads",
        content: "Attention heads are like different specialists, each focusing on different types of word relationships. More heads = more perspectives!",
        target: "[data-panel='attention-heads']",
        placement: "left",
        difficulty: "beginner",
        estimatedTime: "1 min",
        tip: "Think of each head as an expert who notices different patterns in language."
      },
      {
        id: "head-count-slider",
        title: "Controlling Head Count",
        content: "This slider controls how many attention heads work simultaneously. Start with fewer heads to see simpler patterns, then increase for complexity.",
        target: "[data-panel='attention-heads'] .w-full[role='slider']",
        placement: "top",
        action: "click",
        actionDescription: "Try moving the slider to 3 heads to see a balanced view.",
        difficulty: "beginner",
        estimatedTime: "1 min"
      },
      {
        id: "head-presets",
        title: "Quick Head Configurations",
        content: "These presets give you optimized head counts for different purposes. 'Balanced' is perfect for learning!",
        target: "[data-panel='attention-heads'] .grid-cols-2",
        placement: "bottom",
        action: "click",
        actionDescription: "Click on the 'Balanced' preset to set 3 attention heads.",
        difficulty: "beginner",
        estimatedTime: "1 min"
      },
      {
        id: "head-inspector",
        title: "Inspecting Individual Heads",
        content: "Each head learns to focus on different aspects of language. Use these tabs to see what each head specializes in.",
        target: "[data-panel='attention-heads'] [role='tablist']",
        placement: "bottom",
        action: "click",
        actionDescription: "Click through different head tabs to see their specializations.",
        difficulty: "beginner",
        estimatedTime: "2 min",
        tip: "Notice how Head 0 might focus on subjects, Head 1 on verbs, etc."
      },
      {
        id: "positional-encodings",
        title: "The Importance of Position",
        content: "Positional encodings tell the model where each word is in the sentence. Without them, 'dog bites man' would be the same as 'man bites dog'!",
        target: "[data-panel='positional-encodings']",
        placement: "right",
        difficulty: "beginner",
        estimatedTime: "1 min"
      },
      {
        id: "position-toggle",
        title: "Position On vs Off",
        content: "Toggle this to see the dramatic difference position information makes. Try turning it off, then back on.",
        target: "[data-panel='positional-encodings'] [role='switch']",
        placement: "top",
        action: "click",
        actionDescription: "Click the switch to toggle positional encodings off, then back on.",
        difficulty: "beginner",
        estimatedTime: "1 min",
        tip: "Notice how the 'Before vs After' comparison changes!"
      },
      {
        id: "causal-mask-intro",
        title: "Understanding Causal Masking",
        content: "Causal masking controls whether words can 'see' future words. It's the difference between writing (can't see ahead) and reading (can see everything).",
        target: "[data-panel='causal-mask']",
        placement: "left",
        difficulty: "beginner",
        estimatedTime: "1 min"
      },
      {
        id: "causal-toggle",
        title: "Writer vs Reader Mode",
        content: "Toggle between GPT-style (writing mode - causal) and BERT-style (reading mode - bidirectional). See how this changes the attention matrix shape!",
        target: "[data-panel='causal-mask'] [role='switch']",
        placement: "right",
        action: "click",
        actionDescription: "Toggle the causal mask on and off to see the attention matrix change from triangle to square.",
        difficulty: "beginner",
        estimatedTime: "2 min",
        tip: "Triangle = causal (can't see future), Square = bidirectional (sees all)"
      },
      {
        id: "token-selection",
        title: "Selecting Tokens for Analysis",
        content: "Click on any token to see its specific attention pattern. Different tokens will show different connection strengths to other words.",
        target: "[data-panel='selected-token']",
        placement: "left",
        action: "click",
        actionDescription: "Click on different tokens in the interactive context section to see how their attention patterns differ.",
        difficulty: "beginner",
        estimatedTime: "2 min",
        tip: "Try comparing a content word like 'cat' with a function word like 'the'."
      },
      {
        id: "tour-complete",
        title: "Congratulations! 🎉",
        content: "You've completed the Transformer Basics Tour! You now understand the fundamental components. Try exploring on your own or take another tour to dive deeper.",
        target: "[data-panel='sentence-settings']",
        placement: "right",
        difficulty: "beginner",
        estimatedTime: "1 min",
        nextButton: "Finish Tour"
      }
    ]
  },
  
  {
    id: "attention-deep-dive",
    title: "Attention Mechanism Deep Dive",
    description: "Explore the mathematical foundations and detailed mechanics of how attention works under the hood.",
    difficulty: "intermediate",
    estimatedDuration: "15-18 minutes",
    prerequisites: ["Basic understanding of transformers", "Completed Transformer Basics Tour"],
    learningObjectives: [
      "Understand Query, Key, Value mechanism in detail",
      "Learn how attention scores are computed and normalized",
      "Explore multi-head attention specialization",
      "Analyze attention patterns for different sentence types"
    ],
    steps: [
      {
        id: "qkv-intro",
        title: "Query, Key, Value Foundation",
        content: "Every attention computation starts with three representations for each token: Query (what am I looking for?), Key (what do I offer?), and Value (what information do I contain?).",
        target: "[data-visualization='qkv-matrices']",
        placement: "right",
        difficulty: "intermediate",
        estimatedTime: "2 min",
        tip: "Think of this like a database query system - queries search through keys to retrieve values."
      },
      {
        id: "attention-scores",
        title: "Computing Attention Scores", 
        content: "Attention scores measure how relevant each key is to a given query using dot-product similarity. Higher scores mean stronger connections.",
        target: "[data-visualization='attention-scores']",
        placement: "bottom",
        action: "observe",
        actionDescription: "Look at the attention score matrix and notice the color patterns - darker means higher relevance.",
        difficulty: "intermediate",
        estimatedTime: "2 min"
      },
      {
        id: "softmax-normalization",
        title: "Softmax: Creating Probability Distributions",
        content: "Raw scores are converted to probabilities using softmax. This ensures all attention weights sum to 100%, creating a 'budget' to distribute.",
        target: "[data-visualization='attention-weights']",
        placement: "top",
        action: "observe",
        actionDescription: "Notice how each row sums to 100% - this is the attention budget for that token.",
        difficulty: "intermediate",
        estimatedTime: "2 min",
        tip: "Softmax preserves the ranking of scores while making them interpretable as probabilities."
      },
      {
        id: "head-specialization",
        title: "How Heads Specialize",
        content: "Different heads naturally learn to focus on different linguistic phenomena during training. Let's explore what each head has learned.",
        target: "[data-panel='attention-heads'] [role='tablist']",
        placement: "bottom",
        action: "click",
        actionDescription: "Switch between different heads and observe their specialization descriptions.",
        difficulty: "intermediate",
        estimatedTime: "3 min"
      },
      {
        id: "comparison-mode",
        title: "Comparing Head Behaviors",
        content: "Comparison mode lets you see how different heads attend to the same sentence. This reveals complementary attention patterns.",
        target: "[data-panel='attention-heads'] [role='switch'][aria-label*='Compare']",
        placement: "left",
        action: "click",
        actionDescription: "Enable comparison mode and select two different heads to compare.",
        difficulty: "intermediate",
        estimatedTime: "2 min",
        tip: "Look for heads that focus on different parts of speech or syntactic relationships."
      },
      {
        id: "sentence-complexity",
        title: "Testing Different Sentence Types",
        content: "Different sentence structures reveal different attention patterns. Let's try a more complex example.",
        target: "[data-panel='sentence-settings'] select",
        placement: "top",
        action: "click",
        actionDescription: "Select the 'Relative Clause Dependencies' example to see complex attention patterns.",
        difficulty: "intermediate",
        estimatedTime: "2 min"
      },
      {
        id: "pattern-analysis",
        title: "Analyzing Complex Patterns",
        content: "With complex sentences, you can see long-range dependencies and hierarchical relationships. Notice how 'who' connects back to 'student'.",
        target: "[data-visualization='attention-matrix']",
        placement: "right", 
        action: "observe",
        actionDescription: "Look for long-distance connections in the attention matrix.",
        difficulty: "intermediate",
        estimatedTime: "2 min",
        tip: "Complex sentences reveal the transformer's ability to handle nested structures and long dependencies."
      },
      {
        id: "deep-dive-complete",
        title: "Advanced Understanding Achieved!",
        content: "You now understand the detailed mechanics of attention! You can analyze how transformers process complex language patterns and why multi-head attention is so powerful.",
        target: "[data-panel='attention-heads']",
        placement: "left",
        difficulty: "intermediate",
        estimatedTime: "1 min",
        nextButton: "Complete Deep Dive"
      }
    ]
  },

  {
    id: "architecture-comparison",
    title: "Architecture Comparison: Encoder vs Decoder",
    description: "Learn the crucial differences between encoder and decoder architectures through hands-on experimentation with causal masking.",
    difficulty: "advanced",
    estimatedDuration: "12-15 minutes",
    prerequisites: ["Understanding of attention mechanism", "Completed previous tours"],
    learningObjectives: [
      "Master the difference between causal and bidirectional attention",
      "Understand when to use each architecture type",
      "Learn how masking affects information flow",
      "Practice with real-world use cases"
    ],
    steps: [
      {
        id: "architecture-overview",
        title: "Two Fundamentally Different Approaches",
        content: "Transformers come in two main flavors: Encoders (like BERT) that can see everything, and Decoders (like GPT) that can only see the past.",
        target: "[data-panel='causal-mask']",
        placement: "right",
        difficulty: "advanced",
        estimatedTime: "1 min"
      },
      {
        id: "bidirectional-mode",
        title: "Bidirectional Attention (BERT-style)",
        content: "Start with bidirectional attention where every token can attend to every other token. This is perfect for understanding complete context.",
        target: "[data-panel='causal-mask'] [role='switch']",
        placement: "top",
        action: "click",
        actionDescription: "Make sure causal masking is OFF to enable bidirectional attention.",
        difficulty: "advanced",
        estimatedTime: "1 min"
      },
      {
        id: "bidirectional-matrix",
        title: "Square Matrix Pattern",
        content: "Notice the square attention matrix - every position can attend to every other position. This gives the model complete context awareness.",
        target: "[data-visualization='attention-matrix-shape']",
        placement: "bottom",
        action: "observe",
        actionDescription: "Observe the square pattern in the matrix visualization.",
        difficulty: "advanced",
        estimatedTime: "1 min"
      },
      {
        id: "use-case-classification",
        title: "Perfect for Understanding Tasks",
        content: "Bidirectional models excel at tasks requiring complete context: classification, question answering, sentiment analysis.",
        target: "[data-panel='causal-mask'] .border-rounded-lg",
        placement: "left",
        action: "click",
        actionDescription: "Click on the 'Text Classification' use case to see why bidirectional attention is needed.",
        difficulty: "advanced",
        estimatedTime: "2 min"
      },
      {
        id: "causal-mode",
        title: "Causal Attention (GPT-style)",
        content: "Now enable causal masking. This prevents tokens from seeing future positions - essential for text generation.",
        target: "[data-panel='causal-mask'] [role='switch']",
        placement: "top",
        action: "click",
        actionDescription: "Turn ON causal masking to enable autoregressive behavior.",
        difficulty: "advanced",
        estimatedTime: "1 min"
      },
      {
        id: "triangular-matrix",
        title: "Triangular Matrix Pattern",
        content: "The attention matrix becomes triangular - each position can only attend to previous positions, never future ones.",
        target: "[data-visualization='attention-matrix-shape']",
        placement: "bottom",
        action: "observe",
        actionDescription: "Notice how the matrix shape changes from square to triangle.",
        difficulty: "advanced",
        estimatedTime: "1 min",
        tip: "Red areas are masked (forbidden), blue areas allow attention flow."
      },
      {
        id: "generation-use-case",
        title: "Essential for Generation",
        content: "Causal masking prevents 'cheating' during training. The model learns to predict the next word without seeing it first.",
        target: "[data-panel='causal-mask'] .border-rounded-lg",
        placement: "right",
        action: "click",
        actionDescription: "Click 'Text Generation' to see why causal masking is necessary.",
        difficulty: "advanced",
        estimatedTime: "2 min"
      },
      {
        id: "prediction-game",
        title: "The Prediction Challenge",
        content: "Try the prediction game to experience the difference between causal and bidirectional processing firsthand.",
        target: "[data-interactive='predict-game']",
        placement: "top",
        action: "click",
        actionDescription: "Play the word prediction game in both causal and bidirectional modes.",
        difficulty: "advanced",
        estimatedTime: "3 min",
        optional: true
      },
      {
        id: "information-flow",
        title: "Understanding Information Flow",
        content: "The key insight: causal masking controls information flow direction. This architectural choice determines what tasks the model can perform.",
        target: "[data-visualization='attention-flow']",
        placement: "left",
        action: "observe",
        actionDescription: "Toggle between causal and bidirectional to see information flow changes.",
        difficulty: "advanced",
        estimatedTime: "2 min"
      },
      {
        id: "architecture-mastery",
        title: "Architecture Expert!",
        content: "You now understand the fundamental architectural differences in transformers! You can choose the right approach for any NLP task.",
        target: "[data-panel='causal-mask']",
        placement: "right",
        difficulty: "advanced", 
        estimatedTime: "1 min",
        nextButton: "Master Complete"
      }
    ]
  },

  {
    id: "practical-exploration",
    title: "Practical Exploration Playground",
    description: "Free-form exploration with guided suggestions for discovering attention patterns in different types of text.",
    difficulty: "intermediate",
    estimatedDuration: "20+ minutes",
    prerequisites: ["Basic tour completed"],
    learningObjectives: [
      "Discover attention patterns in different text types",
      "Learn to interpret attention visualizations",
      "Practice hypothesis testing with attention",
      "Build intuition through experimentation"
    ],
    steps: [
      {
        id: "exploration-intro",
        title: "Your Attention Laboratory",
        content: "This is your playground for discovering how attention works with different types of text. We'll guide you through interesting experiments.",
        target: "[data-panel='sentence-settings']",
        placement: "right",
        difficulty: "intermediate",
        estimatedTime: "1 min"
      },
      {
        id: "ambiguity-resolution",
        title: "Experiment 1: Ambiguous Words",
        content: "Let's see how attention resolves word ambiguity. Load an example with an ambiguous word that context helps clarify.",
        target: "[data-panel='sentence-settings'] select",
        placement: "bottom",
        action: "click",
        actionDescription: "Select the 'Lexical Ambiguity Resolution' example with the word 'bank'.",
        difficulty: "intermediate",
        estimatedTime: "2 min"
      },
      {
        id: "ambiguity-analysis",
        title: "Analyzing Ambiguity Resolution",
        content: "Click on the word 'bank' and see how it strongly attends to 'river'. This shows contextual disambiguation in action!",
        target: "[data-token='bank']",
        placement: "top",
        action: "click",
        actionDescription: "Click on the word 'bank' to see its attention pattern.",
        difficulty: "intermediate",
        estimatedTime: "2 min",
        tip: "Notice the strong connection to 'river' - context resolves the ambiguity!"
      },
      {
        id: "syntactic-experiment",
        title: "Experiment 2: Syntactic Relationships",
        content: "Now let's explore how attention captures grammatical relationships. Try a sentence with clear subject-verb-object structure.",
        target: "[data-panel='sentence-settings'] input",
        placement: "top",
        action: "input",
        actionDescription: "Type 'The teacher explains concepts clearly' and press Enter.",
        difficulty: "intermediate",
        estimatedTime: "2 min"
      },
      {
        id: "syntactic-analysis",
        title: "Discovering Syntactic Patterns",
        content: "Click on 'teacher' and 'explains' to see how subjects and verbs connect. Then try 'concepts' to see object relationships.",
        target: "[data-visualization='token-selection']",
        placement: "left",
        action: "click",
        actionDescription: "Click different words to explore their syntactic connections.",
        difficulty: "intermediate",
        estimatedTime: "3 min"
      },
      {
        id: "head-specialization-discovery",
        title: "Experiment 3: Head Specialization",
        content: "Set up multiple heads and discover their specializations. Each head learns different linguistic patterns.",
        target: "[data-panel='attention-heads'] .w-full[role='slider']",
        placement: "bottom",
        action: "click",
        actionDescription: "Set the heads to 6 and explore different head specializations.",
        difficulty: "intermediate",
        estimatedTime: "3 min"
      },
      {
        id: "head-comparison-experiment",
        title: "Comparing Head Behaviors",
        content: "Use comparison mode to see how different heads attend to the same sentence differently.",
        target: "[data-panel='attention-heads'] [role='switch'][aria-label*='Compare']",
        placement: "right",
        action: "click",
        actionDescription: "Enable comparison mode and compare heads that seem to have different specializations.",
        difficulty: "intermediate",
        estimatedTime: "3 min"
      },
      {
        id: "position-importance",
        title: "Experiment 4: Position Matters",
        content: "Test how crucial positional information is by toggling it with different sentence types.",
        target: "[data-panel='sentence-settings'] input",
        placement: "top",
        action: "input",
        actionDescription: "Try 'Dog bites man' vs 'Man bites dog' - very different meanings!",
        difficulty: "intermediate",
        estimatedTime: "2 min"
      },
      {
        id: "position-toggle-experiment",
        title: "Testing Without Positions",
        content: "Turn off positional encodings and see how word order meaning disappears.",
        target: "[data-panel='positional-encodings'] [role='switch']",
        placement: "right",
        action: "click",
        actionDescription: "Toggle positional encodings off, then back on, to see the dramatic difference.",
        difficulty: "intermediate",
        estimatedTime: "2 min"
      },
      {
        id: "free-exploration",
        title: "Free Exploration Time!",
        content: "Now explore on your own! Try questions, exclamations, complex sentences, technical text, or anything interesting. What patterns do you discover?",
        target: "[data-panel='sentence-settings'] input",
        placement: "bottom",
        action: "input",
        actionDescription: "Try any text you're curious about - song lyrics, news headlines, technical docs, poetry!",
        difficulty: "intermediate",
        estimatedTime: "5+ min",
        optional: true,
        tip: "The best learning happens through curiosity-driven exploration!"
      },
      {
        id: "exploration-complete",
        title: "Expert Explorer!",
        content: "Congratulations! You've developed the skills to independently explore and understand attention patterns. Keep experimenting!",
        target: "[data-panel='sentence-settings']",
        placement: "right",
        difficulty: "intermediate",
        estimatedTime: "1 min",
        nextButton: "Continue Exploring"
      }
    ]
  }
];

// Utility functions for tour management
export function getTourById(tourId: string): TourConfiguration | null {
  return TOUR_CONFIGURATIONS.find(tour => tour.id === tourId) || null;
}

export function getToursForLevel(userLevel: 'beginner' | 'intermediate' | 'advanced'): TourConfiguration[] {
  const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
  return TOUR_CONFIGURATIONS.filter(tour => levelOrder[tour.difficulty] <= levelOrder[userLevel]);
}

export function getRecommendedTour(userLevel: 'beginner' | 'intermediate' | 'advanced', completedTours: string[] = []): TourConfiguration | null {
  const availableTours = getToursForLevel(userLevel);
  
  // Find first uncompleted tour appropriate for user level
  const uncompletedTours = availableTours.filter(tour => !completedTours.includes(tour.id));
  
  if (uncompletedTours.length === 0) return null;
  
  // Recommend based on user level and prerequisites
  for (const tour of uncompletedTours) {
    const hasPrerequisites = tour.prerequisites?.every(prereq => 
      completedTours.some(completed => completed.includes(prereq.toLowerCase().replace(/\s+/g, '-')))
    ) ?? true;
    
    if (hasPrerequisites) {
      return tour;
    }
  }
  
  // Fallback to first available tour
  return uncompletedTours[0];
}

// Tour progress tracking
export interface TourProgress {
  tourId: string;
  currentStep: number;
  completedSteps: string[];
  startedAt: Date;
  lastActiveAt: Date;
  completed: boolean;
  completedAt?: Date;
}

export function createTourProgress(tourId: string): TourProgress {
  return {
    tourId,
    currentStep: 0,
    completedSteps: [],
    startedAt: new Date(),
    lastActiveAt: new Date(),
    completed: false
  };
}

export function updateTourProgress(progress: TourProgress, stepId: string, stepIndex: number): TourProgress {
  return {
    ...progress,
    currentStep: stepIndex,
    completedSteps: [...progress.completedSteps, stepId],
    lastActiveAt: new Date()
  };
}

export function completeTourProgress(progress: TourProgress): TourProgress {
  return {
    ...progress,
    completed: true,
    completedAt: new Date(),
    lastActiveAt: new Date()
  };
}

// Content difficulty adapter
export function adaptTourForLevel(tour: TourConfiguration, userLevel: 'beginner' | 'intermediate' | 'advanced'): TourConfiguration {
  const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
  const userLevelOrder = levelOrder[userLevel];
  
  // Filter steps based on difficulty
  const adaptedSteps = tour.steps.filter(step => levelOrder[step.difficulty] <= userLevelOrder);
  
  // Simplify content for beginners
  if (userLevel === 'beginner') {
    return {
      ...tour,
      steps: adaptedSteps.map(step => ({
        ...step,
        content: step.content.length > 150 ? step.content.substring(0, 150) + '...' : step.content,
        tip: step.tip || "Take your time to understand each concept before moving on."
      }))
    };
  }
  
  return {
    ...tour,
    steps: adaptedSteps
  };
}