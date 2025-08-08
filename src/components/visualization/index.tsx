// Visualization Components Export
export { ComparisonView, useComparison } from './ComparisonView';
export { LivePreview } from './LivePreview';
export { 
  VisualIndicators, 
  ComplexityMeter, 
  AttentionStrengthBar, 
  PatternBadge, 
  ConnectionLines 
} from './VisualIndicators';
export { WordOrderDemo as InteractiveDemo } from './InteractiveDemo';
export { HeadSpecializationDemo } from './HeadSpecializationDemo';
export { CausalVsNonCausalDemo } from './CausalVsNonCausalDemo';
export { TokenTypesDemo } from './TokenTypesDemo';
export { 
  AnimationProvider,
  useAnimation,
  PanelTransition,
  AttentionFlow,
  HighlightPulse,
  ValueChangeAnimation,
  AnimationControls
} from './AnimationSystem';
export { 
  PositionalEncodingWaves,
  AttentionHeatmap,
  TokenRelationshipGraph,
  PatternVisualizers
} from './PatternVisualizers';
export { ExperimentMode } from './ExperimentMode';

// Utility types for visualization components
export interface VisualizationConfig {
  complexity: number;
  attentionStrengths: number[];
  patterns: Array<{
    pattern: string;
    confidence: number;
    type: 'syntax' | 'semantic' | 'positional' | 'attention' | 'other';
  }>;
  connections: Array<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    strength: number;
    type?: 'attention' | 'flow' | 'dependency';
  }>;
}

export interface PreviewConfig {
  heads: number;
  sequenceLength: number;
  modelDimension: number;
  useCausalMask: boolean;
  selectedToken: number;
  [key: string]: any;
}

export interface ComparisonItem {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  metadata?: {
    complexity?: number;
    performance?: 'fast' | 'moderate' | 'slow';
    accuracy?: number;
    [key: string]: any;
  };
}