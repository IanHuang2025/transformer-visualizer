/**
 * Educational Tooltips Content Database
 * ====================================
 * 
 * Comprehensive tooltip content for all UI controls across panels.
 * Organized by panel and control type with progressive difficulty levels.
 */

import { EducationalTooltipContent } from "@/components/educational/EducationalTooltip";
import { ConceptExplanationData } from "@/components/educational/ConceptExplanation";

// ==============================================
// ATTENTION HEADS PANEL TOOLTIPS
// ==============================================

export const ATTENTION_HEADS_TOOLTIPS: Record<string, EducationalTooltipContent> = {
  headCount: {
    id: "attention-head-count",
    title: "Number of Attention Heads",
    description: "Controls how many parallel attention mechanisms work together. Each head can focus on different types of word relationships simultaneously.",
    difficulty: "beginner",
    category: "Multi-Head Attention",
    keyPoints: [
      "More heads = more types of relationships captured",
      "Each head specializes in different patterns",
      "Typical models use 8-16 heads per layer",
      "Too many heads can be computationally expensive"
    ],
    analogies: [
      "Like having multiple experts analyze the same text from different perspectives",
      "Similar to a team where each member has a different specialty",
      "Like having multiple camera angles filming the same scene"
    ],
    commonMistakes: [
      "Thinking more heads always means better performance",
      "Assuming all heads do the same thing",
      "Not considering computational trade-offs"
    ],
    interactiveTips: [
      "Try 1 head to see simple attention, then increase to see more complex patterns",
      "Compare attention patterns between different heads",
      "Notice how heads can focus on syntax, semantics, or position"
    ]
  },

  headPresets: {
    id: "attention-head-presets",
    title: "Attention Head Presets",
    description: "Pre-configured head counts optimized for different use cases, balancing model capability with computational efficiency.",
    difficulty: "beginner",
    category: "Configuration",
    keyPoints: [
      "Simple (1): Single attention pattern, fastest",
      "Balanced (3): Good for learning, moderate speed",
      "Production (6): Real-world model size",
      "Maximum (8): Most complex patterns, slowest"
    ],
    analogies: [
      "Like camera settings: auto, portrait, sport, manual",
      "Similar to car transmission: eco, normal, sport, manual"
    ],
    interactiveTips: [
      "Start with 'Balanced' for learning",
      "Use 'Simple' to understand basic attention",
      "Try 'Maximum' to see complex pattern interactions"
    ]
  },

  headInspector: {
    id: "attention-head-inspector",
    title: "Head Inspector",
    description: "Allows you to examine individual attention heads to see what patterns each one has learned to focus on.",
    difficulty: "intermediate",
    category: "Analysis",
    keyPoints: [
      "Each head shows different attention patterns",
      "Heads often specialize in different linguistic features",
      "Patterns reflect what the model considers important",
      "Comparison mode shows differences between heads"
    ],
    analogies: [
      "Like looking through different colored filters",
      "Similar to X-ray vs. MRI vs. ultrasound views",
      "Like having specialists examine the same patient"
    ],
    commonMistakes: [
      "Thinking all heads should look the same",
      "Over-interpreting attention patterns as human-like reasoning",
      "Ignoring that patterns are task-specific"
    ],
    interactiveTips: [
      "Click through different heads to see specialization",
      "Look for heads that focus on similar word types",
      "Compare how heads handle different sentence structures"
    ]
  },

  comparisonMode: {
    id: "comparison-mode",
    title: "Head Comparison Mode",
    description: "Compare attention patterns between different heads side-by-side to understand how they specialize in different aspects of language.",
    difficulty: "intermediate",
    category: "Analysis",
    keyPoints: [
      "Shows differences in head specialization",
      "Helps identify complementary attention patterns",
      "Reveals how heads work together",
      "Useful for understanding model behavior"
    ],
    analogies: [
      "Like comparing different expert opinions on the same case",
      "Similar to A/B testing different approaches"
    ],
    interactiveTips: [
      "Compare a syntax-focused head with a semantic-focused one",
      "Look for heads that attend to different parts of speech",
      "Notice how heads complement each other"
    ]
  }
};

// ==============================================
// SENTENCE SETTINGS PANEL TOOLTIPS
// ==============================================

export const SENTENCE_TOOLTIPS: Record<string, EducationalTooltipContent> = {
  textInput: {
    id: "text-input",
    title: "Text Input",
    description: "Enter any sentence to analyze how the transformer processes it. Different sentence structures reveal different attention patterns.",
    difficulty: "beginner",
    category: "Input Processing",
    keyPoints: [
      "Keep sentences under 16 tokens for best visualization",
      "Different sentence types show different patterns",
      "Punctuation and capitalization matter",
      "Try various linguistic structures"
    ],
    analogies: [
      "Like giving a reading comprehension test to the model",
      "Similar to feeding ingredients into a recipe analyzer"
    ],
    interactiveTips: [
      "Start with simple sentences like 'The cat sat'",
      "Try questions, commands, and complex sentences",
      "Compare how similar words behave in different contexts"
    ]
  },

  educationalPresets: {
    id: "educational-presets",
    title: "Educational Examples",
    description: "Carefully chosen sentences that demonstrate specific linguistic phenomena and attention patterns.",
    difficulty: "beginner",
    category: "Learning Examples",
    keyPoints: [
      "Each example highlights different language features",
      "Examples range from simple to complex structures",
      "Designed to show specific attention behaviors",
      "Great starting points for exploration"
    ],
    analogies: [
      "Like textbook examples chosen to illustrate concepts",
      "Similar to museum exhibits with educational placards"
    ],
    commonMistakes: [
      "Skipping examples and jumping to complex custom text",
      "Not reading the explanations for each example",
      "Not comparing different example types"
    ],
    interactiveTips: [
      "Try the 'bank by the river' example to see ambiguity resolution",
      "Compare simple and complex sentence examples",
      "Read the 'why interesting' explanations for each"
    ]
  },

  tokenAnalysis: {
    id: "token-analysis",
    title: "Live Token Analysis",
    description: "Real-time breakdown of your text into tokens with classification and linguistic analysis.",
    difficulty: "intermediate",
    category: "Tokenization",
    keyPoints: [
      "Shows how text becomes tokens (model's basic units)",
      "Classifies tokens by type (content, function, punctuation)",
      "Token count affects visualization performance",
      "Token boundaries might surprise you"
    ],
    analogies: [
      "Like breaking a sentence into individual words for analysis",
      "Similar to musical notes on a sheet - each token is a note"
    ],
    commonMistakes: [
      "Assuming tokens are always whole words",
      "Not understanding the difference between content and function words",
      "Ignoring token count limits"
    ],
    interactiveTips: [
      "Hover over tokens to see their classification",
      "Notice how function words (the, of, in) differ from content words",
      "Try compound words to see tokenization boundaries"
    ]
  },

  complexityIndicator: {
    id: "complexity-indicator",
    title: "Sentence Complexity",
    description: "Automatically assesses sentence complexity based on length, vocabulary, and syntactic structure.",
    difficulty: "beginner",
    category: "Analysis",
    keyPoints: [
      "Beginner: Short, simple sentences",
      "Intermediate: Longer or more complex vocabulary",
      "Advanced: Complex syntax, long dependencies",
      "Complexity affects attention patterns"
    ],
    interactiveTips: [
      "Start with beginner sentences to learn basics",
      "Progress to intermediate for more interesting patterns",
      "Try advanced sentences to see complex relationships"
    ]
  }
};

// ==============================================
// CAUSAL MASK PANEL TOOLTIPS
// ==============================================

export const CAUSAL_MASK_TOOLTIPS: Record<string, EducationalTooltipContent> = {
  causalToggle: {
    id: "causal-mask-toggle",
    title: "Causal Mask Toggle",
    description: "Controls whether tokens can see future positions. Essential difference between encoder and decoder architectures.",
    difficulty: "intermediate",
    category: "Architecture",
    keyPoints: [
      "ON = GPT-style (generative), can't see future",
      "OFF = BERT-style (understanding), sees all tokens",
      "Affects the shape of attention matrix",
      "Critical for different AI tasks"
    ],
    analogies: [
      "ON: Like writing a story word by word without knowing the ending",
      "OFF: Like editing a complete document with full context",
      "ON: Watching a movie scene by scene",
      "OFF: Having the complete movie to analyze"
    ],
    commonMistakes: [
      "Thinking causal masking is about causality in language",
      "Not understanding when to use each mode",
      "Confusing with attention weights"
    ],
    interactiveTips: [
      "Toggle on/off to see attention matrix shape change",
      "Try with text generation vs. classification tasks",
      "Notice how information flow changes"
    ]
  },

  useCaseSelector: {
    id: "use-case-selector",
    title: "Use Case Selector",
    description: "Automatically sets the correct masking for different AI application types.",
    difficulty: "beginner",
    category: "Applications",
    keyPoints: [
      "Text Generation → Causal (can't peek ahead)",
      "Classification → Bidirectional (needs full context)",
      "Chatbots → Causal (generate responses)",
      "Q&A Systems → Bidirectional (understand questions)"
    ],
    analogies: [
      "Like choosing the right tool for the job",
      "Similar to selecting camera mode for different photo types"
    ],
    interactiveTips: [
      "Try each use case to see the automatic settings",
      "Think about why each application needs its specific mode",
      "Compare the attention patterns for different use cases"
    ]
  },

  matrixVisualization: {
    id: "matrix-visualization",
    title: "Attention Matrix Shape",
    description: "Visual representation showing how causal masking creates triangular vs. square attention patterns.",
    difficulty: "intermediate",
    category: "Visualization",
    keyPoints: [
      "Square = bidirectional (all positions can attend to all)",
      "Triangle = causal (only past positions visible)",
      "Blue = can attend, Red = masked",
      "Shape directly affects information flow"
    ],
    analogies: [
      "Triangle: Like looking backward while walking forward",
      "Square: Like having a bird's eye view of everything"
    ],
    interactiveTips: [
      "Watch the shape change when toggling the mask",
      "Notice how triangular shape prevents future information",
      "Think about why each shape suits different tasks"
    ]
  },

  predictGame: {
    id: "predict-game",
    title: "Predict Next Word Game",
    description: "Interactive demonstration of how causal vs. bidirectional attention affects prediction tasks.",
    difficulty: "beginner",
    category: "Interactive Learning",
    keyPoints: [
      "Shows why causal masking matters for generation",
      "Demonstrates information available at each step",
      "Illustrates the prediction challenge",
      "Fun way to understand the concept"
    ],
    analogies: [
      "Like guessing the next word in a story",
      "Similar to filling in blanks in a sentence"
    ],
    interactiveTips: [
      "Play with both causal and bidirectional modes",
      "Notice how seeing the future makes prediction easier",
      "Think about why this would be 'cheating' during training"
    ]
  }
};

// ==============================================
// POSITIONAL ENCODINGS PANEL TOOLTIPS
// ==============================================

export const POSITIONAL_TOOLTIPS: Record<string, EducationalTooltipContent> = {
  positionalToggle: {
    id: "positional-encodings-toggle",
    title: "Positional Encodings Toggle",
    description: "Controls whether position information is added to word embeddings. Without this, the model can't understand word order.",
    difficulty: "intermediate",
    category: "Embeddings",
    keyPoints: [
      "Essential for understanding word order",
      "Uses sine/cosine patterns to encode positions",
      "Without it, 'cat dog' = 'dog cat' to the model",
      "Different from learned position embeddings"
    ],
    analogies: [
      "Like seat numbers in a theater - each word knows its place",
      "Similar to page numbers in a book",
      "Like GPS coordinates for words in a sentence"
    ],
    commonMistakes: [
      "Thinking position encodings are optional",
      "Not understanding why word order matters",
      "Confusing with attention weights"
    ],
    interactiveTips: [
      "Toggle off to see how word order disappears",
      "Try sentences where order changes meaning",
      "Notice how grammar understanding improves with positions"
    ]
  },

  beforeAfterComparison: {
    id: "before-after-comparison",
    title: "Before vs After Comparison",
    description: "Visual demonstration of embeddings with and without positional information.",
    difficulty: "intermediate",
    category: "Visualization",
    keyPoints: [
      "Without: No position awareness, pure word meaning",
      "With: Position + meaning combined",
      "Position patterns are mathematically determined",
      "Critical for grammatical understanding"
    ],
    interactiveTips: [
      "Compare the two visualizations side by side",
      "Notice how position adds structure",
      "Try with different sentence lengths"
    ]
  },

  wordOrderDemo: {
    id: "word-order-demo",
    title: "Word Order Demonstration",
    description: "Interactive examples showing how word order affects sentence meaning when positions are understood.",
    difficulty: "beginner",
    category: "Interactive Learning",
    keyPoints: [
      "Word order changes meaning dramatically",
      "Positions help models understand grammar",
      "Some languages are more order-dependent",
      "Critical for translation and generation"
    ],
    analogies: [
      "Like rearranging furniture - position changes everything",
      "Similar to changing the order of ingredients in cooking"
    ],
    interactiveTips: [
      "Click through different word order examples",
      "Notice how meaning changes completely",
      "Think about why position matters for your native language"
    ]
  },

  patternVisualizer: {
    id: "pattern-visualizer",
    title: "Position Pattern Visualizer",
    description: "Shows the actual sine/cosine patterns used to encode position information at different dimensions.",
    difficulty: "advanced",
    category: "Mathematics",
    keyPoints: [
      "Each position gets unique sine/cosine signature",
      "Different dimensions use different frequencies",
      "Patterns allow model to learn relative positions",
      "Mathematical beauty in transformer design"
    ],
    analogies: [
      "Like unique fingerprints for each position",
      "Similar to radio frequencies - each position has its 'channel'"
    ],
    commonMistakes: [
      "Thinking patterns are random or learned",
      "Not understanding why sine/cosine functions are used",
      "Missing the elegance of the mathematical solution"
    ],
    interactiveTips: [
      "Observe how each position has unique patterns",
      "Notice the relationship between position and frequency",
      "Think about why this encoding works so well"
    ]
  }
};

// ==============================================
// SELECTED TOKEN PANEL TOOLTIPS
// ==============================================

export const SELECTED_TOKEN_TOOLTIPS: Record<string, EducationalTooltipContent> = {
  tokenSelector: {
    id: "token-selector",
    title: "Token Selection",
    description: "Choose which token to focus on for detailed attention analysis. Each token shows different attention patterns.",
    difficulty: "beginner",
    category: "Analysis",
    keyPoints: [
      "Different tokens have different attention patterns",
      "Content words vs. function words behave differently",
      "Token position affects attention patterns",
      "Selection drives the entire visualization"
    ],
    analogies: [
      "Like choosing which character to follow in a story",
      "Similar to selecting a focal point in a photograph"
    ],
    interactiveTips: [
      "Try different tokens to see varied patterns",
      "Compare content words (nouns, verbs) with function words (the, of)",
      "Notice how position in sentence affects patterns"
    ]
  },

  attentionWeights: {
    id: "attention-weights",
    title: "Attention Weights",
    description: "Shows how much the selected token attends to each other token. Higher weights mean stronger connections.",
    difficulty: "intermediate",
    category: "Attention Mechanism",
    keyPoints: [
      "Weights always sum to 100% (probability distribution)",
      "Higher weights = more relevant for current token",
      "Patterns reveal learned linguistic relationships",
      "Different heads show different weight patterns"
    ],
    analogies: [
      "Like a budget - 100% attention to distribute across all words",
      "Similar to voting - each word gets a share of attention"
    ],
    commonMistakes: [
      "Thinking high weights always mean semantic similarity",
      "Not understanding that weights are learned, not hand-coded",
      "Forgetting that patterns are task and context dependent"
    ],
    interactiveTips: [
      "Look for patterns in which words get high attention",
      "Compare patterns across different heads",
      "Notice grammatical vs. semantic attention patterns"
    ]
  }
};

// ==============================================
// CONCEPT EXPLANATIONS DATABASE
// ==============================================

export const CONCEPT_EXPLANATIONS: Record<string, ConceptExplanationData> = {
  multiHeadAttention: {
    id: "multi-head-attention",
    title: "Multi-Head Attention Mechanism",
    overview: "Multi-head attention allows transformers to simultaneously attend to different types of relationships in the same layer, like having multiple specialists analyze the same text.",
    difficulty: "intermediate",
    category: "Core Concepts",
    sections: [
      {
        id: "parallel-processing",
        title: "Parallel Processing",
        content: "Multiple attention heads work simultaneously, each with different learned parameters. This enables the model to capture various types of relationships in parallel rather than sequentially.",
        difficulty: "beginner",
        examples: [
          "Head 1 focuses on subject-verb relationships",
          "Head 2 focuses on adjective-noun pairs",
          "Head 3 focuses on long-range dependencies"
        ]
      },
      {
        id: "head-specialization",
        title: "Head Specialization",
        content: "Through training, different heads naturally specialize in different linguistic phenomena. This emergent specialization wasn't explicitly programmed but arises from the learning process.",
        difficulty: "intermediate",
        examples: [
          "Syntactic heads: focus on grammar relationships",
          "Semantic heads: focus on meaning relationships",
          "Positional heads: focus on word order patterns"
        ]
      },
      {
        id: "concatenation-projection",
        title: "Concatenation and Projection",
        content: "After parallel computation, all head outputs are concatenated together and passed through a final linear transformation that allows heads to interact and combine their insights.",
        difficulty: "advanced",
        examples: [
          "8 heads × 64 dimensions = 512-dimensional concatenated output",
          "Final linear layer mixes information across heads",
          "Residual connections preserve information flow"
        ]
      }
    ],
    keyTakeaways: [
      "Multiple heads enable parallel processing of different relationship types",
      "Head specialization emerges naturally during training",
      "Concatenation and projection allow heads to work together",
      "More heads aren't always better - there's a sweet spot for each task"
    ],
    commonConfusions: [
      "Thinking all heads do the same thing",
      "Believing more heads automatically means better performance",
      "Not understanding how heads interact through the output projection"
    ],
    realWorldApplications: [
      "Language translation: different heads focus on alignment, grammar, semantics",
      "Text summarization: heads identify key information vs. supporting details",
      "Code generation: heads understand syntax, semantics, and context separately"
    ],
    furtherReading: [
      { title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
      { title: "What Does BERT Look At?", url: "https://arxiv.org/abs/1906.04341" }
    ]
  },

  attentionMechanism: {
    id: "attention-mechanism",
    title: "Attention Mechanism Fundamentals",
    overview: "The core attention mechanism enables selective information processing by computing relevance scores between different positions in a sequence.",
    difficulty: "beginner",
    category: "Core Concepts",
    sections: [
      {
        id: "query-key-value",
        title: "Query-Key-Value Framework",
        content: "Every token gets three representations: Query (what am I looking for?), Key (what do I offer?), and Value (what information do I contain?). This enables content-based information retrieval.",
        difficulty: "beginner",
        examples: [
          "Query: 'I need information about subjects'",
          "Key: 'I am a noun/subject'", 
          "Value: 'Here is my semantic information'"
        ]
      },
      {
        id: "attention-scores",
        title: "Computing Attention Scores",
        content: "Attention scores measure how relevant each Key is to a given Query using dot-product similarity. Higher scores indicate stronger relevance.",
        difficulty: "intermediate",
        examples: [
          "score = Query · Key / √(dimension)",
          "High score: Query and Key are similar",
          "Low score: Query and Key are dissimilar"
        ]
      },
      {
        id: "softmax-normalization",
        title: "Softmax Normalization",
        content: "Raw scores are converted to probabilities using softmax, ensuring all attention weights sum to 1. This creates a principled way to combine information.",
        difficulty: "intermediate",
        examples: [
          "Raw scores: [2.1, 1.5, 0.8] → Probabilities: [0.65, 0.26, 0.09]",
          "All probabilities sum to 1.0",
          "Higher raw scores become higher probabilities"
        ]
      }
    ],
    keyTakeaways: [
      "Attention enables selective information processing",
      "QKV framework provides flexible information retrieval",
      "Softmax ensures principled information combination",
      "Attention weights reveal learned relationships"
    ],
    commonConfusions: [
      "Thinking attention weights show 'what the model is thinking'",
      "Confusing attention with human visual attention",
      "Not understanding that attention is learned, not programmed"
    ],
    realWorldApplications: [
      "Search engines: matching queries to relevant documents",
      "Recommendation systems: finding relevant items for users",
      "Computer vision: focusing on important image regions"
    ],
    furtherReading: [
      { title: "Neural Machine Translation by Jointly Learning to Align and Translate", url: "https://arxiv.org/abs/1409.0473" },
      { title: "Effective Approaches to Attention-based Neural Machine Translation", url: "https://arxiv.org/abs/1508.04025" }
    ]
  }
};

// ==============================================
// TOOLTIP UTILITIES
// ==============================================

export function getTooltipContent(panelId: string, controlId: string): EducationalTooltipContent | null {
  const tooltipMaps: Record<string, Record<string, EducationalTooltipContent>> = {
    'attention-heads': ATTENTION_HEADS_TOOLTIPS,
    'sentence-settings': SENTENCE_TOOLTIPS,
    'causal-mask': CAUSAL_MASK_TOOLTIPS,
    'positional-encodings': POSITIONAL_TOOLTIPS,
    'selected-token': SELECTED_TOKEN_TOOLTIPS
  };

  return tooltipMaps[panelId]?.[controlId] || null;
}

export function getConceptExplanation(conceptId: string): ConceptExplanationData | null {
  return CONCEPT_EXPLANATIONS[conceptId] || null;
}

// Progressive learning path generator
export function generateLearningPath(userLevel: 'beginner' | 'intermediate' | 'advanced') {
  const concepts = Object.values(CONCEPT_EXPLANATIONS)
    .filter(concept => {
      switch (userLevel) {
        case 'beginner': return concept.difficulty === 'beginner';
        case 'intermediate': return ['beginner', 'intermediate'].includes(concept.difficulty);
        case 'advanced': return true;
        default: return true;
      }
    })
    .sort((a, b) => {
      const order = { beginner: 1, intermediate: 2, advanced: 3 };
      return order[a.difficulty] - order[b.difficulty];
    });

  return concepts;
}

// Context-sensitive tooltip selection
export function selectContextualTooltip(
  panelId: string, 
  controlId: string, 
  userLevel: 'beginner' | 'intermediate' | 'advanced',
  context?: { currentAction?: string; previousActions?: string[] }
): EducationalTooltipContent | null {
  const baseTooltip = getTooltipContent(panelId, controlId);
  if (!baseTooltip) return null;

  // Adapt content based on user level
  const adaptedTooltip: EducationalTooltipContent = {
    ...baseTooltip,
    description: baseTooltip.description,
    keyPoints: baseTooltip.keyPoints?.slice(0, userLevel === 'beginner' ? 2 : userLevel === 'intermediate' ? 3 : undefined),
    analogies: baseTooltip.analogies?.slice(0, userLevel === 'beginner' ? 1 : userLevel === 'intermediate' ? 2 : undefined)
  };

  return adaptedTooltip;
}

// Common mistakes detector
export function detectPotentialMistakes(
  panelId: string,
  userActions: Array<{ action: string; timestamp: number; context: any }>
): string[] {
  const mistakes: string[] = [];
  
  // Analyze user behavior patterns
  const recentActions = userActions.slice(-5);
  
  // Check for common anti-patterns
  if (recentActions.length > 3 && recentActions.every(a => a.action === 'change-heads')) {
    mistakes.push("Try focusing on understanding what each head does rather than just changing the count");
  }
  
  if (recentActions.some(a => a.action === 'disable-positions') && 
      recentActions.some(a => a.action === 'complex-sentence')) {
    mistakes.push("Complex sentences need positional encodings to be understood correctly");
  }
  
  return mistakes;
}