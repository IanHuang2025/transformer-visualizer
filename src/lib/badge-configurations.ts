/**
 * Educational Badge Configurations
 * =================================
 * 
 * Achievement system to encourage exploration and learning.
 * Badges are designed to guide users through different aspects of transformer attention.
 */

import { EducationalBadge } from "@/components/educational/EducationalBadges";

export const EDUCATIONAL_BADGES: EducationalBadge[] = [
  // ==========================================
  // EXPLORATION BADGES
  // ==========================================
  {
    id: "first-steps",
    title: "First Steps",
    description: "Welcome to transformer attention! You've taken your first steps into understanding how AI processes language.",
    icon: "star",
    category: "exploration",
    difficulty: "bronze",
    points: 10,
    requirements: [
      {
        type: "action-count",
        description: "Interact with any panel",
        target: 1,
        details: { actionType: "panel-interact" }
      }
    ],
    unlockMessage: "🎉 Welcome! You've started your journey into transformer attention!",
    hints: [
      "Click on any panel or control to start exploring!",
      "Try changing the number of attention heads to see different patterns."
    ]
  },

  {
    id: "sentence-explorer",
    title: "Sentence Explorer",
    description: "Tried different sentences to see how attention patterns change with different text inputs.",
    icon: "eye",
    category: "exploration",
    difficulty: "bronze",
    points: 15,
    requirements: [
      {
        type: "action-count",
        description: "Try 5 different sentences",
        target: 5,
        details: { actionType: "sentence-change" }
      }
    ],
    unlockMessage: "Great exploration! You're discovering how different sentences create different attention patterns.",
    hints: [
      "Try simple sentences first, then move to complex ones",
      "Compare questions vs statements vs commands",
      "See how punctuation affects attention patterns"
    ]
  },

  {
    id: "preset-collector",
    title: "Preset Collector",
    description: "Explored all educational preset examples to understand different linguistic phenomena.",
    icon: "target",
    category: "exploration",
    difficulty: "silver",
    points: 25,
    requirements: [
      {
        type: "action-count",
        description: "Try all preset examples",
        target: 6,
        details: { actionType: "preset-select" }
      }
    ],
    unlockMessage: "Excellent! You've explored diverse examples and seen how transformers handle different language patterns.",
    hints: [
      "Each preset demonstrates a different linguistic concept",
      "Pay attention to the explanations for each preset",
      "Notice how attention patterns differ between simple and complex sentences"
    ]
  },

  {
    id: "head-hopper",
    title: "Head Hopper",
    description: "Explored different numbers of attention heads to understand multi-head attention.",
    icon: "brain",
    category: "exploration", 
    difficulty: "silver",
    points: 20,
    requirements: [
      {
        type: "setting-experiment",
        description: "Try at least 4 different head counts",
        target: 4,
        details: { settingType: "attention-heads" }
      }
    ],
    unlockMessage: "You understand how multiple heads work in parallel! Each head specializes in different patterns.",
    hints: [
      "Try both small (1-2) and large (6-8) head counts",
      "Notice how head specializations become clearer with more heads",
      "Compare the same sentence with different head counts"
    ]
  },

  {
    id: "panel-master",
    title: "Panel Master",
    description: "Actively used all major configuration panels to explore different aspects of attention.",
    icon: "award",
    category: "exploration",
    difficulty: "gold",
    points: 35,
    requirements: [
      {
        type: "action-count",
        description: "Interact with all 5 panels",
        target: 5,
        details: { actionType: "panel-use" }
      },
      {
        type: "time-spent",
        description: "Spend at least 10 minutes exploring",
        target: 10
      }
    ],
    unlockMessage: "You're a true explorer! You've mastered navigating all aspects of the transformer visualizer.",
    hints: [
      "Don't forget about the positional encodings panel",
      "Try the causal masking to see encoder vs decoder differences",
      "Explore individual token analysis in the selected token panel"
    ]
  },

  // ==========================================
  // UNDERSTANDING BADGES  
  // ==========================================
  {
    id: "position-matters",
    title: "Position Matters",
    description: "Discovered how crucial positional encodings are by toggling them on and off.",
    icon: "lightbulb",
    category: "understanding",
    difficulty: "bronze",
    points: 20,
    requirements: [
      {
        type: "combo",
        description: "Toggle positions off, then back on",
        target: 1,
        details: { 
          actions: ["position-disable", "position-enable"],
          timeWindow: 30000 
        }
      }
    ],
    unlockMessage: "Aha! You've discovered why word order is crucial for language understanding.",
    hints: [
      "Try the positional encodings toggle",
      "Notice how 'cat dog' becomes the same as 'dog cat' without positions",
      "Look at the before/after comparison visualization"
    ]
  },

  {
    id: "causal-insight",
    title: "Causal Insight", 
    description: "Understood the fundamental difference between causal and bidirectional attention by experimenting with masking.",
    icon: "zap",
    category: "understanding",
    difficulty: "silver",
    points: 30,
    requirements: [
      {
        type: "combo",
        description: "Toggle causal mask and observe matrix changes",
        target: 2,
        details: { 
          actions: ["causal-toggle", "matrix-observe"],
          timeWindow: 45000
        }
      }
    ],
    unlockMessage: "Excellent! You grasp the difference between encoder and decoder architectures.",
    hints: [
      "Watch how the attention matrix shape changes",
      "Think about when you'd want each type",
      "Try the use case selector to see practical applications"
    ]
  },

  {
    id: "attention-detective",
    title: "Attention Detective",
    description: "Analyzed individual token attention patterns to understand how words connect to each other.",
    icon: "eye",
    category: "understanding",
    difficulty: "silver",
    points: 25,
    requirements: [
      {
        type: "action-count",
        description: "Analyze 10 different tokens",
        target: 10,
        details: { actionType: "token-select" }
      },
      {
        type: "pattern-discovery",
        description: "Discover attention patterns",
        target: 5
      }
    ],
    unlockMessage: "You're seeing the connections! Each token has its own unique attention fingerprint.",
    hints: [
      "Click on different words to see their attention patterns",
      "Compare content words (nouns, verbs) with function words (the, of)",
      "Look for patterns in how similar word types behave"
    ]
  },

  {
    id: "head-specialist", 
    title: "Head Specialist",
    description: "Discovered how different attention heads specialize in different linguistic phenomena.",
    icon: "users",
    category: "understanding",
    difficulty: "gold",
    points: 40,
    requirements: [
      {
        type: "action-count",
        description: "Inspect individual heads",
        target: 8,
        details: { actionType: "head-inspect" }
      },
      {
        type: "combo",
        description: "Use head comparison mode",
        target: 1,
        details: { 
          actions: ["comparison-enable", "head-compare"],
          timeWindow: 60000
        }
      }
    ],
    unlockMessage: "You understand multi-head attention! Each head is like a specialist with different expertise.",
    hints: [
      "Switch between different head tabs to see their specializations",
      "Enable comparison mode to see heads side by side",
      "Look for heads that focus on different grammatical relationships"
    ]
  },

  // ==========================================
  // MASTERY BADGES
  // ==========================================
  {
    id: "tour-graduate",
    title: "Tour Graduate",
    description: "Completed a guided tour to build systematic understanding of transformer attention.",
    icon: "trophy",
    category: "mastery",
    difficulty: "silver",
    points: 50,
    requirements: [
      {
        type: "tour-complete",
        description: "Complete any guided tour",
        target: 1
      }
    ],
    unlockMessage: "Congratulations! You've completed structured learning about transformer attention.",
    hints: [
      "Try the 'Transformer Basics Tour' if you're new",
      "Advanced users might enjoy the 'Architecture Comparison' tour"
    ]
  },

  {
    id: "tour-master",
    title: "Tour Master",
    description: "Completed multiple guided tours, showing dedication to comprehensive understanding.",
    icon: "trophy", 
    category: "mastery",
    difficulty: "gold",
    points: 100,
    requirements: [
      {
        type: "tour-complete",
        description: "Complete 3 different tours",
        target: 3
      }
    ],
    unlockMessage: "Outstanding mastery! You've achieved comprehensive understanding through structured learning.",
    hints: [
      "Try tours of different difficulty levels",
      "Each tour teaches different aspects of attention"
    ],
    prerequisiteBadges: ["tour-graduate"]
  },

  {
    id: "pattern-master",
    title: "Pattern Master",
    description: "Achieved deep understanding by discovering complex attention patterns across diverse sentence types.",
    icon: "brain",
    category: "mastery",
    difficulty: "platinum",
    points: 150,
    requirements: [
      {
        type: "pattern-discovery",
        description: "Discover 20 unique attention patterns",
        target: 20
      },
      {
        type: "action-count",
        description: "Analyze 50+ different sentences",
        target: 50,
        details: { actionType: "sentence-analyze" }
      },
      {
        type: "time-spent",
        description: "Spend 30+ minutes exploring",
        target: 30
      }
    ],
    unlockMessage: "🏆 MASTERY ACHIEVED! You have deep intuition for how attention mechanisms work!",
    hints: [
      "Try sentences with ambiguous words",
      "Explore complex grammatical structures",
      "Compare how different heads handle the same patterns"
    ],
    prerequisiteBadges: ["attention-detective", "head-specialist"]
  },

  // ==========================================
  // DISCOVERY BADGES
  // ==========================================
  {
    id: "easter-egg-hunter",
    title: "Easter Egg Hunter",
    description: "Found a hidden feature by experimenting with unusual combinations.",
    icon: "star",
    category: "discovery",
    difficulty: "gold",
    points: 75,
    requirements: [
      {
        type: "combo",
        description: "Discover hidden interaction",
        target: 1,
        details: {
          actions: ["max-heads", "disable-positions", "causal-toggle"],
          timeWindow: 120000
        }
      }
    ],
    unlockMessage: "🔍 Discovery! You found an interesting edge case in transformer behavior!",
    hints: [
      "Try unusual combinations of settings",
      "What happens with maximum complexity?",
      "Some patterns only emerge under specific conditions"
    ],
    hidden: true
  },

  {
    id: "code-whisperer",
    title: "Code Whisperer",
    description: "Discovered how transformers handle programming code by analyzing code snippets.",
    icon: "zap",
    category: "discovery", 
    difficulty: "silver",
    points: 45,
    requirements: [
      {
        type: "action-count",
        description: "Analyze code-like sentences",
        target: 3,
        details: { actionType: "code-analyze" }
      }
    ],
    unlockMessage: "Interesting! You've explored how attention works with structured text like code.",
    hints: [
      "Try the code structure preset example",
      "Input programming syntax to see how it's processed",
      "Notice how brackets and operators create attention patterns"
    ]
  },

  {
    id: "linguistic-explorer",
    title: "Linguistic Explorer",
    description: "Explored diverse linguistic phenomena including ambiguity, idioms, and complex grammar.",
    icon: "book",
    category: "discovery",
    difficulty: "gold",
    points: 60,
    requirements: [
      {
        type: "action-count",
        description: "Try different linguistic phenomena",
        target: 8,
        details: { actionType: "linguistic-explore" }
      },
      {
        type: "pattern-discovery",
        description: "Discover varied language patterns",
        target: 10
      }
    ],
    unlockMessage: "🌟 You're a linguistic explorer! You understand how attention handles diverse language patterns.",
    hints: [
      "Try the ambiguity resolution examples",
      "Explore idiomatic expressions",
      "Test questions vs statements vs commands"
    ]
  },

  // ==========================================
  // PERSISTENCE BADGES
  // ==========================================
  {
    id: "dedicated-learner",
    title: "Dedicated Learner",
    description: "Showed persistence by spending significant time understanding transformer attention.",
    icon: "clock",
    category: "persistence",
    difficulty: "bronze",
    points: 30,
    requirements: [
      {
        type: "time-spent",
        description: "Spend 15+ minutes exploring",
        target: 15
      }
    ],
    unlockMessage: "Your dedication shows! Deep learning takes time and you're investing it wisely.",
    hints: [
      "Take your time to really understand each concept",
      "Quality exploration matters more than speed"
    ]
  },

  {
    id: "daily-explorer",
    title: "Daily Explorer",
    description: "Returned multiple days to continue learning about transformer attention.",
    icon: "trending",
    category: "persistence",
    difficulty: "silver",
    points: 40,
    requirements: [
      {
        type: "streak",
        description: "Visit on 3 different days",
        target: 3,
        details: { streakType: "daily" }
      }
    ],
    unlockMessage: "Consistency is key! You're building deep understanding over time.",
    hints: [
      "Regular practice builds intuition",
      "Try revisiting concepts after learning new ones"
    ]
  },

  {
    id: "attention-scholar",
    title: "Attention Scholar",
    description: "Demonstrated scholarly dedication through extensive and methodical exploration.",
    icon: "trophy",
    category: "persistence",
    difficulty: "platinum", 
    points: 200,
    requirements: [
      {
        type: "time-spent",
        description: "Spend 60+ minutes total exploring",
        target: 60
      },
      {
        type: "action-count",
        description: "Perform 200+ learning actions",
        target: 200,
        details: { actionType: "any" }
      },
      {
        type: "streak",
        description: "Visit on 5 different days",
        target: 5,
        details: { streakType: "daily" }
      }
    ],
    unlockMessage: "🎓 SCHOLAR ACHIEVEMENT! Your dedication to learning is truly exceptional!",
    hints: [
      "True mastery comes from consistent practice",
      "You're building expertise that will last"
    ],
    prerequisiteBadges: ["dedicated-learner", "daily-explorer"]
  }
];

// Utility functions for badge management
export function getBadgeById(badgeId: string): EducationalBadge | null {
  return EDUCATIONAL_BADGES.find(badge => badge.id === badgeId) || null;
}

export function getBadgesByCategory(category: string): EducationalBadge[] {
  return EDUCATIONAL_BADGES.filter(badge => badge.category === category);
}

export function getBadgesByDifficulty(difficulty: string): EducationalBadge[] {
  return EDUCATIONAL_BADGES.filter(badge => badge.difficulty === difficulty);
}

export function getAvailableBadges(unlockedBadgeIds: string[]): EducationalBadge[] {
  return EDUCATIONAL_BADGES.filter(badge => {
    // Check if prerequisites are met
    if (badge.prerequisiteBadges) {
      const hasPrerequisites = badge.prerequisiteBadges.every(prereqId =>
        unlockedBadgeIds.includes(prereqId)
      );
      if (!hasPrerequisites) return false;
    }
    
    // Include unlocked and available badges (but not hidden ones unless unlocked)
    if (badge.hidden && !unlockedBadgeIds.includes(badge.id)) {
      return false;
    }
    
    return true;
  });
}

export function calculateTotalPoints(unlockedBadgeIds: string[]): number {
  return unlockedBadgeIds.reduce((total, badgeId) => {
    const badge = getBadgeById(badgeId);
    return total + (badge?.points || 0);
  }, 0);
}

export function getProgressPercentage(unlockedBadgeIds: string[], availableBadgeIds?: string[]): number {
  const totalBadges = availableBadgeIds?.length || EDUCATIONAL_BADGES.filter(b => !b.hidden).length;
  return Math.round((unlockedBadgeIds.length / totalBadges) * 100);
}

// Achievement tracking helpers
export interface AchievementTracker {
  actions: Array<{ action: string; timestamp: number; context?: any }>;
  unlockedBadges: string[];
  startTime: number;
}

export function checkForNewAchievements(
  tracker: AchievementTracker, 
  newAction: { action: string; timestamp: number; context?: any }
): string[] {
  // Add new action
  tracker.actions.push(newAction);
  
  const availableBadges = getAvailableBadges(tracker.unlockedBadges);
  const newlyUnlocked: string[] = [];
  
  // Check each available badge
  for (const badge of availableBadges) {
    if (tracker.unlockedBadges.includes(badge.id)) continue;
    
    // Check if all requirements are met
    const allMet = badge.requirements.every(requirement => {
      switch (requirement.type) {
        case 'action-count':
          const actionType = requirement.details?.actionType;
          const count = tracker.actions.filter(a => 
            actionType === 'any' || !actionType || a.action.includes(actionType)
          ).length;
          return count >= requirement.target;
          
        case 'time-spent':
          const timeSpent = Math.floor((Date.now() - tracker.startTime) / (1000 * 60));
          return timeSpent >= requirement.target;
          
        // Add other requirement type checks as needed
        default:
          return false;
      }
    });
    
    if (allMet) {
      tracker.unlockedBadges.push(badge.id);
      newlyUnlocked.push(badge.id);
    }
  }
  
  return newlyUnlocked;
}