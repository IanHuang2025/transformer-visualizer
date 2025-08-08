# Setup and Development Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation Steps

```bash
# 1. Clone the repository (if not already done)
cd /Users/apple/Development/transformer-visualizer

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

## 📦 Dependencies

### Core Dependencies
```json
{
  "next": "15.4.6",
  "react": "^18",
  "react-dom": "^18",
  "typescript": "^5",
  "tailwindcss": "^3",
  "@radix-ui/react-*": "UI primitives",
  "lucide-react": "Icons",
  "clsx": "Class utilities",
  "tailwind-merge": "Tailwind merging"
}
```

### Development Dependencies
```json
{
  "@types/react": "TypeScript types",
  "@types/node": "Node types",
  "eslint": "Linting",
  "eslint-config-next": "Next.js ESLint config"
}
```

## 🛠 Development Commands

### Essential Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues (where possible)
npm run lint -- --fix

# Type checking
npm run type-check  # (needs to be added)

# Run tests
npm test  # (needs to be configured)
```

### Helpful Commands
```bash
# Check bundle size
npm run analyze  # (needs to be added)

# Format code
npm run format  # (needs to be added)

# Clean build cache
rm -rf .next node_modules
npm install
```

## 📁 Project Structure

```
transformer-visualizer/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx            # Main application (~1100 lines)
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles + animations
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── animated/           # Animation components
│   │   │   ├── AnimatedMatrix.tsx
│   │   │   ├── AnimatedTokenChips.tsx
│   │   │   └── ...
│   │   │
│   │   ├── tutorials/          # Interactive tutorials
│   │   │   ├── TokenizationTutorial.tsx
│   │   │   ├── AttentionConceptTutorial.tsx
│   │   │   └── ...
│   │   │
│   │   ├── progressive-ui/     # Progressive UI components
│   │   │   ├── ProgressTracking.tsx
│   │   │   ├── ValidationGates.tsx
│   │   │   └── ...
│   │   │
│   │   └── [Other components]
│   │
│   ├── contexts/               # React contexts
│   │   ├── WelcomeContext.tsx
│   │   └── AnimationContext.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useWelcome.tsx
│   │   ├── useLearningJourney.tsx
│   │   └── useAnimation.tsx
│   │
│   └── lib/                    # Utilities and libraries
│       ├── educational-content.ts
│       ├── utils.ts
│       └── welcomeStorage.ts
│
├── public/                     # Static assets
│
├── Notebooks/                  # Documentation
│   ├── README.md
│   ├── PROJECT_OVERVIEW.md
│   └── ...
│
└── [Config files]             # Configuration
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── eslint.config.mjs
    └── package.json
```

## 🔧 Development Workflow

### 1. Setting Up Your Environment
```bash
# Install VS Code extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

# Configure git
git config user.name "Your Name"
git config user.email "your@email.com"
```

### 2. Making Changes
```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Run linting
npm run lint

# Test your changes
npm run dev
# Test in browser

# Commit changes
git add .
git commit -m "feat: add your feature description"
```

### 3. Code Style Guidelines
- Use TypeScript for all new code
- Follow existing component patterns
- Use Tailwind CSS for styling
- Keep components modular and reusable
- Add comments for complex logic
- Use meaningful variable names

## 🐛 Debugging

### Common Issues and Solutions

#### Server Won't Start
```bash
# Kill existing process
pkill -f "next dev"

# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

#### Linting Errors
```bash
# Auto-fix what's possible
npm run lint -- --fix

# For stubborn errors, check:
# - Unescaped quotes in JSX
# - Unused variables
# - Missing dependencies in useEffect
```

#### Build Failures
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clear build cache
rm -rf .next
npm run build
```

### Debug Tools
- React DevTools extension
- Browser DevTools (F12)
- Network tab for API calls
- Console for errors
- Performance tab for optimization

## 🚀 Deployment

### Production Build
```bash
# Create optimized build
npm run build

# Test production build locally
npm start
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

#### Static Export
```bash
# Add to next.config.ts
output: 'export'

# Build static site
npm run build

# Deploy to any static host
```

## 🧪 Testing

### Adding Tests (Future)
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Create test files
# ComponentName.test.tsx

# Run tests
npm test
```

### Test Structure
```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 📊 Performance Optimization

### Current Performance Metrics
- Lighthouse Score: ~85
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Bundle Size: ~500KB gzipped

### Optimization Tips
1. Use `dynamic` imports for large components
2. Optimize images with Next.js Image
3. Minimize third-party scripts
4. Use React.memo for expensive components
5. Implement virtual scrolling for large lists

## 🔐 Environment Variables

### Development (.env.local)
```bash
# Currently no env vars needed
# Future additions:
# NEXT_PUBLIC_API_URL=
# NEXT_PUBLIC_ANALYTICS_ID=
```

## 🤝 Contributing

### Guidelines
1. Follow the existing code style
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation
5. Create pull requests with clear descriptions

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Learning Resources
- Transformer architecture papers
- Attention mechanism tutorials
- React best practices
- TypeScript patterns

## 🆘 Getting Help

### Support Channels
- GitHub Issues for bugs
- Discussions for questions
- Documentation in /Notebooks
- Code comments for implementation details

This guide should help you get started with development. For more specific information, refer to the other documentation files in the Notebooks folder.