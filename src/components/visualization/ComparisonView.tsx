"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  GitCompare, 
  ArrowLeftRight, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2,
  Settings,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface ComparisonItem {
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

interface ComparisonViewProps {
  leftItem: ComparisonItem;
  rightItem: ComparisonItem;
  onSwap?: () => void;
  showDifferences?: boolean;
  syncScrolling?: boolean;
  splitView?: boolean;
  className?: string;
}

interface DifferenceHighlight {
  type: 'added' | 'removed' | 'modified';
  position: { top: number; left: number; width: number; height: number };
  description: string;
}

export function ComparisonView({
  leftItem,
  rightItem,
  onSwap,
  showDifferences = true,
  syncScrolling = true,
  splitView = true,
  className = ""
}: ComparisonViewProps) {
  const [differences, setDifferences] = useState<DifferenceHighlight[]>([]);
  const [showMetadata, setShowMetadata] = useState(true);
  const [highlightIntensity, setHighlightIntensity] = useState([0.7]);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'diff-only'>('side-by-side');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  // Synchronized scrolling
  useEffect(() => {
    if (!syncScrolling) return;

    const handleLeftScroll = () => {
      if (rightScrollRef.current && leftScrollRef.current) {
        rightScrollRef.current.scrollTop = leftScrollRef.current.scrollTop;
        rightScrollRef.current.scrollLeft = leftScrollRef.current.scrollLeft;
      }
    };

    const handleRightScroll = () => {
      if (leftScrollRef.current && rightScrollRef.current) {
        leftScrollRef.current.scrollTop = rightScrollRef.current.scrollTop;
        leftScrollRef.current.scrollLeft = rightScrollRef.current.scrollLeft;
      }
    };

    const leftElement = leftScrollRef.current;
    const rightElement = rightScrollRef.current;

    if (leftElement && rightElement) {
      leftElement.addEventListener('scroll', handleLeftScroll);
      rightElement.addEventListener('scroll', handleRightScroll);

      return () => {
        leftElement.removeEventListener('scroll', handleLeftScroll);
        rightElement.removeEventListener('scroll', handleRightScroll);
      };
    }
  }, [syncScrolling]);

  // Mock difference detection (in real implementation, this would analyze the content)
  useEffect(() => {
    const mockDifferences: DifferenceHighlight[] = [
      {
        type: 'modified',
        position: { top: 20, left: 10, width: 100, height: 30 },
        description: 'Configuration difference detected'
      },
      {
        type: 'added',
        position: { top: 80, left: 50, width: 150, height: 25 },
        description: 'New feature in right panel'
      }
    ];
    setDifferences(mockDifferences);
  }, [leftItem, rightItem]);

  const getComplexityColor = (complexity?: number) => {
    if (!complexity) return 'bg-gray-100 text-gray-700';
    if (complexity < 0.3) return 'bg-green-100 text-green-700';
    if (complexity < 0.7) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getPerformanceIcon = (performance?: string) => {
    switch (performance) {
      case 'fast': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'slow': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  const ComparisonPanel = ({ 
    item, 
    side, 
    scrollRef 
  }: { 
    item: ComparisonItem; 
    side: 'left' | 'right'; 
    scrollRef: React.RefObject<HTMLDivElement>;
  }) => (
    <div className={`flex-1 min-w-0 ${splitView ? 'border-r last:border-r-0 border-gray-200' : ''}`}>
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{item.title}</h3>
          {showMetadata && item.metadata && (
            <div className="flex items-center gap-2">
              {item.metadata.performance && getPerformanceIcon(item.metadata.performance)}
              {item.metadata.complexity !== undefined && (
                <Badge className={getComplexityColor(item.metadata.complexity)}>
                  {Math.round(item.metadata.complexity * 100)}% complexity
                </Badge>
              )}
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-600">{item.description}</p>
        )}
      </div>
      
      <div 
        ref={scrollRef}
        className="h-96 overflow-auto relative"
        style={{ scrollBehavior: syncScrolling ? 'smooth' : 'auto' }}
      >
        <div className="p-4 relative">
          {item.content}
          
          {/* Difference highlights */}
          {showDifferences && differences.map((diff, index) => (
            <div
              key={index}
              className={`absolute border-2 rounded pointer-events-none transition-opacity duration-300 ${
                diff.type === 'added' 
                  ? 'border-green-400 bg-green-100' 
                  : diff.type === 'removed'
                  ? 'border-red-400 bg-red-100'
                  : 'border-yellow-400 bg-yellow-100'
              }`}
              style={{
                top: diff.position.top,
                left: diff.position.left,
                width: diff.position.width,
                height: diff.position.height,
                opacity: highlightIntensity[0]
              }}
              title={diff.description}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const MetadataComparison = () => {
    if (!showMetadata || !leftItem.metadata || !rightItem.metadata) return null;

    return (
      <div className="bg-gray-50 p-4 border-t">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Configuration Comparison
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-gray-600">Metric</div>
          <div className="text-center font-medium">{leftItem.title}</div>
          <div className="text-center font-medium">{rightItem.title}</div>
          
          {Object.keys(leftItem.metadata).map(key => (
            <React.Fragment key={key}>
              <div className="text-gray-600 capitalize">{key}</div>
              <div className="text-center">
                {typeof leftItem.metadata![key] === 'number' 
                  ? Math.round(leftItem.metadata![key] * 100) / 100
                  : leftItem.metadata![key]
                }
              </div>
              <div className="text-center">
                {typeof rightItem.metadata![key] === 'number'
                  ? Math.round(rightItem.metadata![key] * 100) / 100
                  : rightItem.metadata![key]
                }
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''} transition-all duration-300`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            Configuration Comparison
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            
            {onSwap && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSwap}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={showDifferences}
                onCheckedChange={setShowDifferences}
              />
              <span className="text-gray-600">Highlight differences</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={syncScrolling}
                onCheckedChange={setSyncScrolling}
              />
              <span className="text-gray-600">Sync scrolling</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={showMetadata}
                onCheckedChange={setShowMetadata}
              />
              <span className="text-gray-600">Show metadata</span>
            </div>
          </div>
          
          {showDifferences && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Highlight intensity:</span>
              <Slider
                value={highlightIntensity}
                onValueChange={setHighlightIntensity}
                min={0.1}
                max={1}
                step={0.1}
                className="w-24"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {viewMode === 'side-by-side' ? (
          <div className="flex min-h-0">
            <ComparisonPanel item={leftItem} side="left" scrollRef={leftScrollRef} />
            <ComparisonPanel item={rightItem} side="right" scrollRef={rightScrollRef} />
          </div>
        ) : viewMode === 'overlay' ? (
          <div className="relative">
            <div className="opacity-50">
              <ComparisonPanel item={leftItem} side="left" scrollRef={leftScrollRef} />
            </div>
            <div className="absolute inset-0 opacity-50">
              <ComparisonPanel item={rightItem} side="right" scrollRef={rightScrollRef} />
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="text-center text-gray-600 py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium mb-2">Difference Analysis</h3>
              <p className="text-sm">
                {differences.length} differences found between configurations
              </p>
              <div className="mt-4 space-y-2">
                {differences.map((diff, index) => (
                  <div key={index} className="text-left bg-gray-50 p-3 rounded">
                    <Badge 
                      className={
                        diff.type === 'added' 
                          ? 'bg-green-100 text-green-700' 
                          : diff.type === 'removed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {diff.type}
                    </Badge>
                    <span className="ml-2 text-sm">{diff.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <MetadataComparison />
      </CardContent>
    </Card>
  );
}

// Hook for easy comparison setup
export function useComparison(
  initialLeft: ComparisonItem,
  initialRight: ComparisonItem
) {
  const [leftItem, setLeftItem] = useState(initialLeft);
  const [rightItem, setRightItem] = useState(initialRight);

  const swap = () => {
    setLeftItem(rightItem);
    setRightItem(leftItem);
  };

  const updateLeft = (item: ComparisonItem) => setLeftItem(item);
  const updateRight = (item: ComparisonItem) => setRightItem(item);

  return {
    leftItem,
    rightItem,
    swap,
    updateLeft,
    updateRight
  };
}

export default ComparisonView;