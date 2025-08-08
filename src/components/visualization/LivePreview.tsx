"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  TrendingUp,
  Activity,
  Target,
  Layers,
  Clock
} from 'lucide-react';

interface PreviewConfig {
  heads: number;
  sequenceLength: number;
  modelDimension: number;
  useCausalMask: boolean;
  selectedToken: number;
  [key: string]: any;
}

interface ImpactMetrics {
  computationalCost: number;
  memoryUsage: number;
  accuracy: number;
  latency: number;
  quality: number;
}

interface LivePreviewProps {
  config: PreviewConfig;
  onConfigChange?: (config: PreviewConfig) => void;
  className?: string;
  autoUpdate?: boolean;
  showThumbnails?: boolean;
  showMetrics?: boolean;
}

interface ThumbnailView {
  id: string;
  title: string;
  preview: React.ReactNode;
  status: 'active' | 'processing' | 'completed' | 'error';
}

export function LivePreview({
  config,
  onConfigChange,
  className = "",
  autoUpdate = true,
  showThumbnails = true,
  showMetrics = true
}: LivePreviewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [updateRate, setUpdateRate] = useState([1000]); // milliseconds
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    computationalCost: 0,
    memoryUsage: 0,
    accuracy: 0,
    latency: 0,
    quality: 0
  });
  const [thumbnails, setThumbnails] = useState<ThumbnailView[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [history, setHistory] = useState<PreviewConfig[]>([]);
  
  const updateIntervalRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate metrics based on config
  const calculatedMetrics = useMemo(() => {
    const baseComplexity = Math.pow(config.sequenceLength, 2) * config.heads;
    const normalizedComplexity = Math.min(baseComplexity / 1000, 1);
    
    return {
      computationalCost: normalizedComplexity * 0.8 + Math.random() * 0.2,
      memoryUsage: (config.heads * config.modelDimension * config.sequenceLength) / 10000,
      accuracy: Math.max(0.7, 1 - normalizedComplexity * 0.2 + Math.random() * 0.1),
      latency: normalizedComplexity * 100 + Math.random() * 20,
      quality: Math.max(0.6, 0.9 - normalizedComplexity * 0.1 + Math.random() * 0.1)
    };
  }, [config]);

  // Auto-update mechanism
  useEffect(() => {
    if (!autoUpdate) return;

    updateIntervalRef.current = setInterval(() => {
      setIsProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        setMetrics(calculatedMetrics);
        updateThumbnails();
        setIsProcessing(false);
      }, 200 + Math.random() * 300);
    }, updateRate[0]);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [autoUpdate, updateRate, calculatedMetrics]);

  // Update thumbnails
  const updateThumbnails = () => {
    const newThumbnails: ThumbnailView[] = [
      {
        id: 'attention-matrix',
        title: 'Attention Matrix',
        preview: <AttentionMatrixThumbnail config={config} />,
        status: 'active'
      },
      {
        id: 'token-flow',
        title: 'Token Flow',
        preview: <TokenFlowThumbnail config={config} />,
        status: isProcessing ? 'processing' : 'completed'
      },
      {
        id: 'head-comparison',
        title: 'Head Comparison',
        preview: <HeadComparisonThumbnail config={config} />,
        status: 'completed'
      },
      {
        id: 'positional-encoding',
        title: 'Positional Encoding',
        preview: <PositionalEncodingThumbnail config={config} />,
        status: 'active'
      }
    ];
    
    setThumbnails(newThumbnails);
  };

  // Initialize thumbnails
  useEffect(() => {
    updateThumbnails();
  }, [config]);

  const getMetricColor = (value: number, invert: boolean = false) => {
    const normalizedValue = invert ? 1 - value : value;
    if (normalizedValue > 0.8) return 'text-green-600 bg-green-50';
    if (normalizedValue > 0.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-400 bg-green-50';
      case 'processing': return 'border-blue-400 bg-blue-50';
      case 'completed': return 'border-gray-300 bg-gray-50';
      case 'error': return 'border-red-400 bg-red-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const manualUpdate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setMetrics(calculatedMetrics);
      updateThumbnails();
      setIsProcessing(false);
      
      // Add to history
      setHistory(prev => [config, ...prev.slice(0, 9)]); // Keep last 10
    }, 300);
  };

  return (
    <Card className={`${className} transition-all duration-300`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            Live Preview
            {isProcessing && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoUpdate}
                onCheckedChange={() => {}}
              />
              <span className="text-sm text-gray-600">Auto-update</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={manualUpdate}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Activity className="w-4 h-4 mr-1 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Update
                </>
              )}
            </Button>
          </div>
        </div>
        
        {autoUpdate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Update rate:</span>
            <div className="flex items-center gap-2">
              <Slider
                value={updateRate}
                onValueChange={setUpdateRate}
                min={500}
                max={5000}
                step={500}
                className="w-32"
              />
              <span className="text-gray-600 min-w-0">
                {updateRate[0]}ms
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Impact Metrics */}
        {showMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Compute Cost</div>
              <Badge className={getMetricColor(metrics.computationalCost, true)}>
                {Math.round(metrics.computationalCost * 100)}%
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Memory</div>
              <Badge className={getMetricColor(metrics.memoryUsage, true)}>
                {Math.round(metrics.memoryUsage)}MB
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Accuracy</div>
              <Badge className={getMetricColor(metrics.accuracy)}>
                {Math.round(metrics.accuracy * 100)}%
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Latency</div>
              <Badge className={getMetricColor(metrics.latency, true)}>
                {Math.round(metrics.latency)}ms
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Quality</div>
              <Badge className={getMetricColor(metrics.quality)}>
                {Math.round(metrics.quality * 100)}%
              </Badge>
            </div>
          </div>
        )}

        {/* Thumbnails Grid */}
        {showThumbnails && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Component Previews
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {thumbnails.map((thumbnail) => (
                <div
                  key={thumbnail.id}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${getStatusColor(thumbnail.status)}
                    ${selectedThumbnail === thumbnail.id ? 'ring-2 ring-blue-400' : ''}
                    hover:shadow-md
                  `}
                  onClick={() => setSelectedThumbnail(
                    selectedThumbnail === thumbnail.id ? null : thumbnail.id
                  )}
                >
                  <div className="text-xs font-medium mb-2 flex items-center justify-between">
                    {thumbnail.title}
                    <div className={`
                      w-2 h-2 rounded-full
                      ${thumbnail.status === 'active' ? 'bg-green-400 animate-pulse' : 
                        thumbnail.status === 'processing' ? 'bg-blue-400 animate-spin' :
                        thumbnail.status === 'error' ? 'bg-red-400' : 'bg-gray-400'}
                    `} />
                  </div>
                  <div className="h-16 bg-white rounded border overflow-hidden">
                    {thumbnail.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Preview Area */}
        <div className="bg-gray-50 rounded-lg p-4 min-h-48">
          {selectedThumbnail ? (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">
                {thumbnails.find(t => t.id === selectedThumbnail)?.title} - Detailed View
              </h3>
              <div className="bg-white rounded-lg p-4 border">
                {thumbnails.find(t => t.id === selectedThumbnail)?.preview}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium text-gray-600 mb-2">Real-time Configuration Preview</h3>
              <p className="text-sm text-gray-500">
                Select a component thumbnail above to see detailed visualizations
              </p>
              <div className="mt-4 text-xs text-gray-400">
                Current config: {config.heads} heads, {config.sequenceLength} tokens, {config.useCausalMask ? 'causal' : 'full'} attention
              </div>
            </div>
          )}
        </div>

        {/* Configuration History */}
        {history.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Configurations
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {history.map((historyConfig, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onConfigChange?.(historyConfig)}
                  className="flex-shrink-0 text-xs"
                >
                  {historyConfig.heads}H-{historyConfig.sequenceLength}T
                  {historyConfig.useCausalMask ? '-C' : '-F'}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Thumbnail Components
function AttentionMatrixThumbnail({ config }: { config: PreviewConfig }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-4 gap-px">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-200 rounded-sm"
            style={{
              opacity: Math.random() * 0.8 + 0.2,
              backgroundColor: config.useCausalMask && i > (i % 4) * 4 + (i % 4) 
                ? '#f3f4f6' 
                : `hsl(${200 + Math.random() * 60}, 70%, 60%)`
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TokenFlowThumbnail({ config }: { config: PreviewConfig }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(config.sequenceLength, 6) }, (_, i) => (
          <React.Fragment key={i}>
            <div 
              className={`w-3 h-3 rounded-full ${
                i === config.selectedToken ? 'bg-red-400' : 'bg-blue-300'
              }`} 
            />
            {i < Math.min(config.sequenceLength, 6) - 1 && (
              <div className="w-2 h-px bg-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function HeadComparisonThumbnail({ config }: { config: PreviewConfig }) {
  const colors = ['bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300'];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-1">
        {Array.from({ length: Math.min(config.heads, 4) }, (_, i) => (
          <div key={i} className={`w-2 h-8 ${colors[i]} rounded-sm`} />
        ))}
      </div>
    </div>
  );
}

function PositionalEncodingThumbnail({ config }: { config: PreviewConfig }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="40" height="20" className="overflow-visible">
        <path
          d="M2,10 Q12,2 22,10 Q32,18 40,10"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-purple-400"
        />
        <path
          d="M2,10 Q12,18 22,10 Q32,2 40,10"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-indigo-400"
        />
      </svg>
    </div>
  );
}

export default LivePreview;