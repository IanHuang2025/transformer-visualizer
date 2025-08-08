"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Zap,
  Activity,
  Layers,
  GitBranch,
  ArrowRight,
  Eye,
  Target,
  Clock
} from 'lucide-react';

// Animation configuration interface
interface AnimationConfig {
  enabled: boolean;
  globalSpeed: number;
  panelTransitionDuration: number;
  attentionFlowSpeed: number;
  highlightPulseDuration: number;
  valueChangeDuration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
  reduceMotion: boolean;
}

// Animation context for global state management
interface AnimationContextType {
  config: AnimationConfig;
  updateConfig: (updates: Partial<AnimationConfig>) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  registerAnimation: (id: string, animation: AnimationInstance) => void;
  unregisterAnimation: (id: string) => void;
  playAll: () => void;
  pauseAll: () => void;
  resetAll: () => void;
}

// Animation instance interface
interface AnimationInstance {
  id: string;
  type: 'transition' | 'flow' | 'pulse' | 'morph';
  play: () => void;
  pause: () => void;
  reset: () => void;
  isPlaying: boolean;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

// Animation provider component
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AnimationConfig>({
    enabled: true,
    globalSpeed: 1.0,
    panelTransitionDuration: 300,
    attentionFlowSpeed: 1.0,
    highlightPulseDuration: 1000,
    valueChangeDuration: 500,
    easing: 'ease-in-out',
    reduceMotion: false
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animations, setAnimations] = useState<Map<string, AnimationInstance>>(new Map());

  const updateConfig = (updates: Partial<AnimationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const registerAnimation = (id: string, animation: AnimationInstance) => {
    setAnimations(prev => new Map(prev).set(id, animation));
  };

  const unregisterAnimation = (id: string) => {
    setAnimations(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const playAll = () => {
    setIsAnimating(true);
    animations.forEach(animation => animation.play());
  };

  const pauseAll = () => {
    setIsAnimating(false);
    animations.forEach(animation => animation.pause());
  };

  const resetAll = () => {
    setIsAnimating(false);
    animations.forEach(animation => animation.reset());
  };

  // Apply reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setConfig(prev => ({ ...prev, reduceMotion: mediaQuery.matches }));
    
    const handler = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, reduceMotion: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const contextValue: AnimationContextType = {
    config,
    updateConfig,
    isAnimating,
    setIsAnimating,
    registerAnimation,
    unregisterAnimation,
    playAll,
    pauseAll,
    resetAll
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
}

// Hook to use animation context
export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}

// Panel transition animation component
interface PanelTransitionProps {
  isVisible: boolean;
  children: React.ReactNode;
  direction?: 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'fade' | 'scale';
  delay?: number;
  className?: string;
}

export function PanelTransition({ 
  isVisible, 
  children, 
  direction = 'slide-up',
  delay = 0,
  className = ""
}: PanelTransitionProps) {
  const { config } = useAnimation();
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, config.panelTransitionDuration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, config.panelTransitionDuration]);

  if (!shouldRender) return null;

  const getTransitionClasses = () => {
    if (config.reduceMotion || !config.enabled) {
      return 'transition-opacity duration-150';
    }

    const baseClasses = 'transition-all duration-300 ease-in-out';
    const directionClasses = {
      'slide-up': isVisible 
        ? 'translate-y-0 opacity-100' 
        : 'translate-y-4 opacity-0',
      'slide-down': isVisible 
        ? 'translate-y-0 opacity-100' 
        : '-translate-y-4 opacity-0',
      'slide-left': isVisible 
        ? 'translate-x-0 opacity-100' 
        : 'translate-x-4 opacity-0',
      'slide-right': isVisible 
        ? 'translate-x-0 opacity-100' 
        : '-translate-x-4 opacity-0',
      'fade': isVisible ? 'opacity-100' : 'opacity-0',
      'scale': isVisible 
        ? 'scale-100 opacity-100' 
        : 'scale-95 opacity-0'
    };

    return `${baseClasses} ${directionClasses[direction]}`;
  };

  return (
    <div
      className={`${getTransitionClasses()} ${className}`}
      style={{
        transitionDuration: `${config.panelTransitionDuration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

// Attention flow animation component
interface AttentionFlowProps {
  fromElement: React.RefObject<HTMLElement>;
  toElement: React.RefObject<HTMLElement>;
  strength: number; // 0-1
  color?: string;
  isActive: boolean;
  onComplete?: () => void;
}

export function AttentionFlow({ 
  fromElement, 
  toElement, 
  strength, 
  color = '#3b82f6',
  isActive,
  onComplete 
}: AttentionFlowProps) {
  const { config } = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    progress: number;
    size: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    if (!isActive || config.reduceMotion || !config.enabled) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !fromElement.current || !toElement.current) return;

    // Setup canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Get element positions
    const fromRect = fromElement.current.getBoundingClientRect();
    const toRect = toElement.current.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
    const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;
    const toX = toRect.left + toRect.width / 2 - canvasRect.left;
    const toY = toRect.top + toRect.height / 2 - canvasRect.top;

    // Generate particles based on strength
    const numParticles = Math.max(1, Math.floor(strength * 20));
    const newParticles = Array.from({ length: numParticles }, (_, i) => ({
      x: fromX + (Math.random() - 0.5) * 10,
      y: fromY + (Math.random() - 0.5) * 10,
      targetX: toX + (Math.random() - 0.5) * 10,
      targetY: toY + (Math.random() - 0.5) * 10,
      progress: 0,
      size: 2 + Math.random() * 3,
      opacity: 0.7 + Math.random() * 0.3
    }));

    setParticles(newParticles);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles(prev => prev.map(particle => {
        const newProgress = Math.min(1, particle.progress + 0.02 * config.attentionFlowSpeed);
        const currentX = particle.x + (particle.targetX - particle.x) * newProgress;
        const currentY = particle.y + (particle.targetY - particle.y) * newProgress;

        // Draw particle
        ctx.beginPath();
        ctx.arc(currentX, currentY, particle.size, 0, 2 * Math.PI);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        return {
          ...particle,
          progress: newProgress
        };
      }).filter(particle => particle.progress < 1));

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, strength, color, config, fromElement, toElement]);

  if (config.reduceMotion || !config.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}

// Highlight pulse animation component
interface HighlightPulseProps {
  isActive: boolean;
  color?: string;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export function HighlightPulse({ 
  isActive, 
  color = 'bg-yellow-400', 
  duration,
  children, 
  className = "" 
}: HighlightPulseProps) {
  const { config } = useAnimation();
  const pulseDuration = duration || config.highlightPulseDuration;

  if (config.reduceMotion || !config.enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`
        ${className}
        ${isActive ? `animate-pulse ${color} shadow-lg` : ''}
        transition-all duration-300
      `}
      style={{
        animationDuration: isActive ? `${pulseDuration}ms` : undefined
      }}
    >
      {children}
    </div>
  );
}

// Value change animation component
interface ValueChangeAnimationProps {
  value: number;
  previousValue: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function ValueChangeAnimation({ 
  value, 
  previousValue, 
  formatter = (v) => v.toString(),
  className = ""
}: ValueChangeAnimationProps) {
  const { config } = useAnimation();
  const [displayValue, setDisplayValue] = useState(previousValue);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (value === previousValue || config.reduceMotion || !config.enabled) {
      setDisplayValue(value);
      return;
    }

    setIsChanging(true);
    
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    const duration = config.valueChangeDuration;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing
      const easedProgress = applyEasing(progress, config.easing);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsChanging(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, previousValue, config, displayValue]);

  const applyEasing = (progress: number, easing: string): number => {
    switch (easing) {
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      case 'ease-in-out':
        return progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'bounce':
        const n1 = 7.5625;
        const d1 = 2.75;
        if (progress < 1 / d1) {
          return n1 * progress * progress;
        } else if (progress < 2 / d1) {
          return n1 * (progress -= 1.5 / d1) * progress + 0.75;
        } else if (progress < 2.5 / d1) {
          return n1 * (progress -= 2.25 / d1) * progress + 0.9375;
        } else {
          return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
        }
      default:
        return progress;
    }
  };

  return (
    <span 
      className={`
        ${className}
        ${isChanging ? 'text-blue-600 font-bold scale-110' : ''}
        transition-all duration-200
      `}
    >
      {formatter(displayValue)}
    </span>
  );
}

// Animation control panel
export function AnimationControls() {
  const { config, updateConfig, isAnimating, playAll, pauseAll, resetAll } = useAnimation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Animation Controls
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Global Controls */}
        <div className="flex items-center gap-4">
          <Button onClick={playAll} disabled={isAnimating}>
            <Play className="w-4 h-4 mr-2" />
            Play All
          </Button>
          
          <Button onClick={pauseAll} disabled={!isAnimating}>
            <Pause className="w-4 h-4 mr-2" />
            Pause All
          </Button>
          
          <Button onClick={resetAll} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Animations</label>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => updateConfig({ enabled })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Global Speed: {config.globalSpeed}x</label>
            <Slider
              value={[config.globalSpeed]}
              onValueChange={([speed]) => updateConfig({ globalSpeed: speed })}
              min={0.1}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Panel Transitions: {config.panelTransitionDuration}ms</label>
            <Slider
              value={[config.panelTransitionDuration]}
              onValueChange={([duration]) => updateConfig({ panelTransitionDuration: duration })}
              min={100}
              max={1000}
              step={50}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attention Flow Speed: {config.attentionFlowSpeed}x</label>
            <Slider
              value={[config.attentionFlowSpeed]}
              onValueChange={([speed]) => updateConfig({ attentionFlowSpeed: speed })}
              min={0.1}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Highlight Pulse: {config.highlightPulseDuration}ms</label>
            <Slider
              value={[config.highlightPulseDuration]}
              onValueChange={([duration]) => updateConfig({ highlightPulseDuration: duration })}
              min={500}
              max={3000}
              step={100}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Easing Function</label>
            <select 
              value={config.easing}
              onChange={(e) => updateConfig({ easing: e.target.value as any })}
              className="w-full p-2 border rounded-md"
            >
              <option value="linear">Linear</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
              <option value="bounce">Bounce</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Respect Reduced Motion</label>
            <Switch
              checked={config.reduceMotion}
              onCheckedChange={(reduceMotion) => updateConfig({ reduceMotion })}
            />
          </div>
        </div>

        {/* Animation Status */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium text-sm">Animation Status</span>
          </div>
          
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Global State:</span>
              <span className={isAnimating ? 'text-green-600' : 'text-gray-600'}>
                {isAnimating ? 'Running' : 'Stopped'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Performance Mode:</span>
              <span className={config.reduceMotion ? 'text-yellow-600' : 'text-green-600'}>
                {config.reduceMotion ? 'Reduced' : 'Normal'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Animations:</span>
              <span className={config.enabled ? 'text-green-600' : 'text-red-600'}>
                {config.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default {
  AnimationProvider,
  useAnimation,
  PanelTransition,
  AttentionFlow,
  HighlightPulse,
  ValueChangeAnimation,
  AnimationControls
};