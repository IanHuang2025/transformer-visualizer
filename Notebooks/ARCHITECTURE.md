# System Architecture

## 🏗 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Welcome  │ │Progressive│ │Tutorial │ │Animation │       │
│  │  Modal   │ │    UI     │ │Components│ │ System   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    State Management Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Learning │ │Animation │ │ Welcome  │ │   App    │       │
│  │ Journey  │ │ Context  │ │ Context  │ │  State   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Attention │ │  Matrix   │ │Educational│ │   Quiz   │       │
│  │   Calc   │ │Operations │ │  Content  │ │  Logic   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Local   │ │Educational│ │   Quiz   │ │Animation │       │
│  │ Storage  │ │   Data    │ │Questions │ │  Config  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Component Architecture

### Core Application Component (`page.tsx`)
The main application component that orchestrates all features:

```typescript
TransformerVisualizer
├── State Management
│   ├── learningMode (beginner/intermediate/advanced)
│   ├── stepIdx (current pipeline step)
│   ├── selectedToken (focused token)
│   ├── selectedHead (current attention head)
│   └── UI settings (causal, positional, etc.)
│
├── Calculations
│   ├── makeEmbeddings()
│   ├── makeWeights()
│   ├── attentionForHead()
│   └── matmul(), softmax(), etc.
│
└── UI Components
    ├── WelcomeModal
    ├── EducationalPanel
    ├── InteractiveQuiz
    ├── Matrix visualizations
    └── Progress tracking
```

### Component Hierarchy

```
App
├── Providers
│   ├── TooltipProvider
│   ├── WelcomeProvider
│   └── AnimationProvider
│
├── Layout Components
│   ├── Header (title, learning mode selector)
│   ├── Controls (settings, inputs)
│   └── Footer (resources, tips)
│
├── Educational Components
│   ├── WelcomeModal
│   ├── OnboardingModal
│   ├── EducationalPanel
│   ├── InteractiveQuiz
│   └── ProgressTracking
│
├── Visualization Components
│   ├── TokenChips
│   ├── Matrix
│   ├── VectorTable
│   └── AnimatedComponents
│
└── Tutorial Components
    ├── TokenizationTutorial
    ├── AttentionConceptTutorial
    ├── QueryKeyValueTutorial
    └── TutorialOrchestrator
```

## 🔄 Data Flow Architecture

### 1. User Input Flow
```
User Input → State Update → Recalculation → Re-render
    ↓             ↓              ↓              ↓
Text Entry → setText() → makeEmbeddings() → Update UI
```

### 2. Learning Journey Flow
```
Welcome → Path Selection → Step 1 → Validation → Step 2 → ...
    ↓          ↓             ↓          ↓          ↓
Modal → learningMode → Show Input → Quiz → Reveal Next
```

### 3. Animation Flow
```
User Action → Animation Context → Component Animation → Visual Feedback
     ↓              ↓                    ↓                   ↓
Click Token → setAnimating() → CSS Transitions → Highlight Effect
```

## 💾 State Management Strategy

### Context Providers

#### WelcomeContext
```typescript
interface WelcomeContextType {
  hasSeenWelcome: boolean;
  learningPath: 'beginner' | 'intermediate' | 'advanced';
  showWelcome: boolean;
  // ... methods
}
```

#### AnimationContext
```typescript
interface AnimationContextType {
  animationSpeed: 'slow' | 'normal' | 'fast';
  enableAnimations: boolean;
  currentAnimation: string | null;
  // ... methods
}
```

### Custom Hooks Architecture

#### useLearningJourney
Manages the progressive learning experience:
- Tracks completed steps
- Validates progression requirements
- Manages quiz states
- Handles achievements

#### useAnimation
Controls animation states:
- Animation timing
- Transition states
- Performance optimization
- Accessibility preferences

## 🧮 Calculation Architecture

### Transformer Calculations
```typescript
// Core calculation pipeline
1. Text → Tokens (tokenization)
2. Tokens → Embeddings (+ positional encoding)
3. Embeddings → Q, K, V (linear transformations)
4. Q, K → Scores (scaled dot product)
5. Scores → Weights (softmax)
6. Weights, V → Output (weighted sum)
7. Multi-head → Concatenate → Project
```

### Matrix Operations
- **matmul()**: Efficient matrix multiplication
- **transpose()**: Matrix transposition
- **softmaxRow()**: Row-wise softmax with optional masking
- **add()**: Element-wise matrix addition

## 🎨 Styling Architecture

### CSS Organization
```
globals.css
├── Base Styles (Tailwind)
├── Component Styles
├── Animation Keyframes (30+)
├── Utility Classes
└── Theme Variables
```

### Animation System
- CSS-based for performance
- GPU-accelerated transforms
- Reduced motion support
- Configurable timing

## 📦 Module Architecture

### Separation of Concerns
```
/components
  /ui           → Presentational components
  /tutorials    → Educational logic
  /animated     → Animation wrappers
  /progressive  → Progressive UI logic

/lib
  educational-content.ts → Content data
  utils.ts              → Helper functions
  welcomeStorage.ts     → Persistence layer

/contexts      → Global state
/hooks         → Business logic
```

## 🔐 Security Architecture

### Current Security Measures
- No external API calls
- All calculations client-side
- localStorage for persistence only
- No user data collection
- Content Security Policy ready

### Future Security Considerations
- Input sanitization for custom text
- Rate limiting for calculations
- Session management for accounts
- Secure storage for progress
- HTTPS enforcement

## ⚡ Performance Architecture

### Optimization Strategies
1. **React Optimizations**
   - useMemo for expensive calculations
   - useCallback for event handlers
   - React.memo for pure components
   - Lazy loading for tutorials

2. **Calculation Optimizations**
   - Cached matrix operations
   - Efficient array operations
   - Minimal re-calculations
   - Web Workers (future)

3. **Rendering Optimizations**
   - CSS animations over JS
   - GPU acceleration
   - Virtual scrolling (future)
   - Code splitting

## 🔌 Integration Points

### Current Integrations
- shadcn/ui component library
- Lucide React icons
- Tailwind CSS
- Local storage API

### Future Integration Points
- Analytics services
- Authentication providers
- Cloud storage
- Model APIs (Hugging Face)
- Export services

## 📊 Scalability Architecture

### Current Limitations
- Single-page application
- Client-side only
- Limited to browser capabilities
- Memory constraints for large matrices

### Scalability Plan
1. **Phase 1**: Optimize current architecture
2. **Phase 2**: Add server-side components
3. **Phase 3**: Implement microservices
4. **Phase 4**: Cloud-native architecture

## 🏭 Design Patterns Used

### React Patterns
- **Compound Components**: Tutorial system
- **Render Props**: Animation wrappers
- **Custom Hooks**: Logic encapsulation
- **Context Pattern**: Global state
- **HOC Pattern**: Progressive UI

### Software Patterns
- **Observer**: State updates
- **Strategy**: Learning modes
- **Factory**: Component creation
- **Decorator**: Animation enhancement
- **Facade**: Educational content API

## 🔄 Development Architecture

### Build Pipeline
```
Source Code → TypeScript Compilation → Next.js Build → Optimization → Output
     ↓              ↓                      ↓              ↓           ↓
   .tsx → Type Checking → Bundling → Minification → Static Assets
```

### Testing Architecture (Future)
```
Unit Tests → Integration Tests → E2E Tests → Performance Tests
    ↓              ↓                 ↓              ↓
Components → User Flows → Full Journey → Load Testing
```

This architecture provides a solid foundation for the educational transformer visualizer while maintaining flexibility for future enhancements and scalability.