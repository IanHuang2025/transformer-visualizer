"use client";

import React, { useState, useEffect, useReducer } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  FlaskConical, 
  Play, 
  Save, 
  Download, 
  Upload,
  CheckCircle, 
  XCircle,
  Clock,
  Lightbulb,
  Target,
  BarChart3,
  GitCompare,
  Zap,
  Settings,
  Archive,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';

interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  description: string;
  parameters: {
    [key: string]: any;
  };
  status: 'draft' | 'running' | 'completed' | 'failed';
  results?: {
    metrics: {
      [key: string]: number;
    };
    conclusions: string[];
    insights: string[];
    visualizations?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface ExperimentAction {
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'RUN' | 'SAVE_RESULTS';
  payload: any;
}

interface ABTestConfig {
  variantA: {
    name: string;
    parameters: { [key: string]: any };
  };
  variantB: {
    name: string;
    parameters: { [key: string]: any };
  };
  metrics: string[];
  sampleSize: number;
  confidence: number;
}

interface ExperimentModeProps {
  currentConfig: { [key: string]: any };
  onConfigChange?: (config: { [key: string]: any }) => void;
  onExperimentComplete?: (experiment: Experiment) => void;
  availableMetrics?: string[];
}

// Experiment reducer
function experimentReducer(state: Experiment[], action: ExperimentAction): Experiment[] {
  switch (action.type) {
    case 'CREATE':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map(exp => 
        exp.id === action.payload.id ? { ...exp, ...action.payload } : exp
      );
    case 'DELETE':
      return state.filter(exp => exp.id !== action.payload.id);
    case 'RUN':
      return state.map(exp => 
        exp.id === action.payload.id 
          ? { ...exp, status: 'running', updatedAt: new Date() }
          : exp
      );
    case 'SAVE_RESULTS':
      return state.map(exp =>
        exp.id === action.payload.id
          ? { 
              ...exp, 
              status: 'completed', 
              results: action.payload.results,
              updatedAt: new Date() 
            }
          : exp
      );
    default:
      return state;
  }
}

export function ExperimentMode({
  currentConfig,
  onConfigChange,
  onExperimentComplete,
  availableMetrics = ['accuracy', 'performance', 'complexity', 'interpretability']
}: ExperimentModeProps) {
  const [experiments, dispatch] = useReducer(experimentReducer, []);
  const [activeTab, setActiveTab] = useState('create');
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // New experiment form state
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    hypothesis: '',
    description: '',
    parameters: {},
    tags: [] as string[]
  });

  // A/B test configuration
  const [abTestConfig, setAbTestConfig] = useState<ABTestConfig>({
    variantA: { name: 'Control', parameters: { ...currentConfig } },
    variantB: { name: 'Treatment', parameters: { ...currentConfig } },
    metrics: ['accuracy', 'performance'],
    sampleSize: 1000,
    confidence: 0.95
  });

  const createExperiment = () => {
    const experiment: Experiment = {
      id: `exp-${Date.now()}`,
      name: newExperiment.name || `Experiment ${experiments.length + 1}`,
      hypothesis: newExperiment.hypothesis,
      description: newExperiment.description,
      parameters: { ...currentConfig, ...newExperiment.parameters },
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newExperiment.tags
    };

    dispatch({ type: 'CREATE', payload: experiment });
    
    // Reset form
    setNewExperiment({
      name: '',
      hypothesis: '',
      description: '',
      parameters: {},
      tags: []
    });
  };

  const runExperiment = async (experiment: Experiment) => {
    dispatch({ type: 'RUN', payload: { id: experiment.id } });
    setIsRunning(true);

    // Simulate experiment execution
    setTimeout(() => {
      const mockResults = {
        metrics: {
          accuracy: 0.85 + Math.random() * 0.1,
          performance: 0.75 + Math.random() * 0.2,
          complexity: Math.random(),
          interpretability: 0.7 + Math.random() * 0.2
        },
        conclusions: [
          'Configuration shows improved performance',
          'Complexity remains manageable',
          'Good interpretability maintained'
        ],
        insights: [
          'Higher attention heads improve accuracy',
          'Sequence length impacts performance significantly',
          'Causal masking affects interpretability'
        ],
        visualizations: ['heatmap', 'flow-diagram', 'metrics-chart']
      };

      dispatch({ 
        type: 'SAVE_RESULTS', 
        payload: { id: experiment.id, results: mockResults } 
      });
      
      setIsRunning(false);
      onExperimentComplete?.(experiment);
    }, 3000);
  };

  const runABTest = async () => {
    setIsRunning(true);

    // Create A/B test experiment
    const abExperiment: Experiment = {
      id: `ab-${Date.now()}`,
      name: `A/B Test: ${abTestConfig.variantA.name} vs ${abTestConfig.variantB.name}`,
      hypothesis: `Variant B will outperform Variant A on selected metrics`,
      description: `Comparing two configurations across ${abTestConfig.metrics.join(', ')}`,
      parameters: {
        variantA: abTestConfig.variantA.parameters,
        variantB: abTestConfig.variantB.parameters,
        metrics: abTestConfig.metrics,
        sampleSize: abTestConfig.sampleSize
      },
      status: 'running',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['ab-test', 'comparison']
    };

    dispatch({ type: 'CREATE', payload: abExperiment });

    // Simulate A/B test
    setTimeout(() => {
      const variantAResults = abTestConfig.metrics.reduce((acc, metric) => ({
        ...acc,
        [`${metric}_a`]: Math.random() * 0.5 + 0.4
      }), {});

      const variantBResults = abTestConfig.metrics.reduce((acc, metric) => ({
        ...acc,
        [`${metric}_b`]: Math.random() * 0.5 + 0.5
      }), {});

      const winner = Math.random() > 0.5 ? 'B' : 'A';
      const significance = Math.random() > 0.3;

      const results = {
        metrics: { ...variantAResults, ...variantBResults },
        conclusions: [
          `Variant ${winner} shows ${significance ? 'statistically significant' : 'marginal'} improvement`,
          `Sample size: ${abTestConfig.sampleSize}`,
          `Confidence level: ${(abTestConfig.confidence * 100).toFixed(1)}%`
        ],
        insights: [
          significance ? 'Results are statistically significant' : 'Results require larger sample size',
          'Consider running longer-term tests',
          'Monitor for seasonal effects'
        ]
      };

      dispatch({
        type: 'SAVE_RESULTS',
        payload: { id: abExperiment.id, results }
      });

      setIsRunning(false);
    }, 4000);
  };

  const exportExperiments = () => {
    const dataStr = JSON.stringify(experiments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'experiments.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importExperiments = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        imported.forEach((exp: Experiment) => {
          dispatch({ type: 'CREATE', payload: { ...exp, id: `imported-${Date.now()}-${Math.random()}` } });
        });
      } catch (error) {
        console.error('Failed to import experiments:', error);
      }
    };
    reader.readAsText(file);
  };

  const getStatusIcon = (status: Experiment['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <Edit className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Experiment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-600" />
            Experiment Mode
            <Badge variant="secondary">{experiments.length} experiments</Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportExperiments}
              disabled={experiments.length === 0}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            
            <div className="relative">
              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-1" />
                  Import
                </label>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importExperiments}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Design and run controlled experiments to test hypotheses about transformer behavior
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create">Create Experiment</TabsTrigger>
            <TabsTrigger value="ab-test">A/B Testing</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Experiment Name
                  </label>
                  <Input
                    value={newExperiment.name}
                    onChange={(e) => setNewExperiment(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Impact of Attention Heads on Performance"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tags
                  </label>
                  <Input
                    placeholder="e.g., attention, performance, heads (comma-separated)"
                    onChange={(e) => setNewExperiment(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Hypothesis
                </label>
                <Input
                  value={newExperiment.hypothesis}
                  onChange={(e) => setNewExperiment(prev => ({ ...prev, hypothesis: e.target.value }))}
                  placeholder="What do you expect to happen?"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </label>
                <Textarea
                  value={newExperiment.description}
                  onChange={(e) => setNewExperiment(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the experiment methodology..."
                  rows={4}
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Current Configuration
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {Object.entries(currentConfig).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-mono">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={createExperiment} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Experiment
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ab-test" className="space-y-6">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <GitCompare className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">A/B Test Configuration</span>
                </div>
                <p className="text-sm text-blue-700">
                  Compare two different configurations to determine which performs better
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Variant A */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800 flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    Variant A (Control)
                  </h3>
                  
                  <Input
                    value={abTestConfig.variantA.name}
                    onChange={(e) => setAbTestConfig(prev => ({
                      ...prev,
                      variantA: { ...prev.variantA, name: e.target.value }
                    }))}
                    placeholder="Control group name"
                  />
                  
                  <div className="bg-red-50 p-3 rounded border">
                    <div className="text-sm font-medium text-red-800 mb-2">Parameters:</div>
                    {Object.entries(abTestConfig.variantA.parameters).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span>{key}:</span>
                        <span className="font-mono">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Variant B */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    Variant B (Treatment)
                  </h3>
                  
                  <Input
                    value={abTestConfig.variantB.name}
                    onChange={(e) => setAbTestConfig(prev => ({
                      ...prev,
                      variantB: { ...prev.variantB, name: e.target.value }
                    }))}
                    placeholder="Treatment group name"
                  />
                  
                  <div className="bg-blue-50 p-3 rounded border">
                    <div className="text-sm font-medium text-blue-800 mb-2">Parameters:</div>
                    {Object.entries(abTestConfig.variantB.parameters).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span>{key}:</span>
                        <span className="font-mono">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sample Size
                  </label>
                  <Input
                    type="number"
                    value={abTestConfig.sampleSize}
                    onChange={(e) => setAbTestConfig(prev => ({
                      ...prev,
                      sampleSize: parseInt(e.target.value)
                    }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Confidence Level
                  </label>
                  <select
                    value={abTestConfig.confidence}
                    onChange={(e) => setAbTestConfig(prev => ({
                      ...prev,
                      confidence: parseFloat(e.target.value)
                    }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={0.90}>90%</option>
                    <option value={0.95}>95%</option>
                    <option value={0.99}>99%</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Metrics to Compare
                  </label>
                  <div className="space-y-1">
                    {availableMetrics.map(metric => (
                      <label key={metric} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={abTestConfig.metrics.includes(metric)}
                          onChange={(e) => {
                            const metrics = e.target.checked
                              ? [...abTestConfig.metrics, metric]
                              : abTestConfig.metrics.filter(m => m !== metric);
                            setAbTestConfig(prev => ({ ...prev, metrics }));
                          }}
                        />
                        {metric}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={runABTest}
                disabled={isRunning || abTestConfig.metrics.length === 0}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Running A/B Test...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run A/B Test
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="experiments" className="space-y-6">
            {experiments.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Experiments Yet</h3>
                <p className="text-gray-500 mb-4">Create your first experiment to get started</p>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Experiment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {experiments.map((experiment) => (
                  <Card key={experiment.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedExperiment(experiment)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(experiment.status)}
                            <h3 className="font-medium text-gray-800">{experiment.name}</h3>
                            <Badge className={getStatusColor(experiment.status)}>
                              {experiment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{experiment.hypothesis}</p>
                          <div className="flex flex-wrap gap-1">
                            {experiment.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {experiment.status === 'draft' && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                runExperiment(experiment);
                              }}
                              disabled={isRunning}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Run
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch({ type: 'DELETE', payload: { id: experiment.id } });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Created: {experiment.createdAt.toLocaleDateString()} | 
                        Updated: {experiment.updatedAt.toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {selectedExperiment && selectedExperiment.results ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">
                    {selectedExperiment.name} - Results
                  </h3>
                  <p className="text-sm text-green-700">
                    Experiment completed successfully
                  </p>
                </div>
                
                {/* Metrics */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Metrics
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(selectedExperiment.results.metrics).map(([metric, value]) => (
                      <div key={metric} className="bg-white border border-gray-200 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{metric}</div>
                        <div className="text-lg font-bold text-blue-600">
                          {typeof value === 'number' ? value.toFixed(3) : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Conclusions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Conclusions
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {selectedExperiment.results.conclusions.map((conclusion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {conclusion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Insights */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Insights
                  </h4>
                  <div className="grid gap-3">
                    {selectedExperiment.results.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="text-sm text-yellow-800">{insight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Results to Display</h3>
                <p className="text-gray-500">
                  {selectedExperiment 
                    ? 'This experiment has not been completed yet'
                    : 'Select a completed experiment to view results'
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ExperimentMode;