"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ChevronDown, 
  ChevronRight,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Target,
  Users,
  Play,
  ExternalLink,
  Star
} from "lucide-react";

export interface ConceptSection {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  examples?: string[];
  visualElements?: VisualElement[];
  interactiveDemo?: InteractiveDemo;
}

export interface VisualElement {
  type: 'diagram' | 'animation' | 'comparison' | 'flowchart';
  description: string;
  component?: React.ReactNode;
}

export interface InteractiveDemo {
  title: string;
  description: string;
  actionText: string;
  onActivate: () => void;
}

export interface ConceptExplanationData {
  id: string;
  title: string;
  overview: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  sections: ConceptSection[];
  keyTakeaways: string[];
  commonConfusions: string[];
  realWorldApplications: string[];
  furtherReading: { title: string; url: string }[];
}

interface ConceptExplanationProps {
  concept: ConceptExplanationData;
  defaultExpanded?: boolean;
  showDifficultyFilter?: boolean;
  className?: string;
}

export function ConceptExplanation({
  concept,
  defaultExpanded = false,
  showDifficultyFilter = true,
  className = ""
}: ConceptExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState("explanation");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-blue-100 text-blue-800 border-blue-200",
    advanced: "bg-purple-100 text-purple-800 border-purple-200"
  };

  const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const filteredSections = concept.sections
    .filter(section => difficultyFilter === 'all' || section.difficulty === difficultyFilter)
    .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

  const renderSection = (section: ConceptSection) => (
    <div key={section.id} className="border rounded-lg">
      <button
        className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
        onClick={() => toggleSection(section.id)}
      >
        <div className="flex items-center gap-2">
          {expandedSections.has(section.id) ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-800">{section.title}</span>
          <Badge className={`text-xs ${difficultyColors[section.difficulty]}`}>
            {section.difficulty}
          </Badge>
        </div>
      </button>
      
      {expandedSections.has(section.id) && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="space-y-3 pt-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {section.content}
            </p>
            
            {section.examples && section.examples.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-800 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  Examples:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {section.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5 text-xs">•</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-xs border">
                        {example}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.visualElements && section.visualElements.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-800 mb-2">Visual Elements:</h4>
                <div className="space-y-2">
                  {section.visualElements.map((visual, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border">
                      <div className="text-xs text-gray-600 mb-1">
                        <Badge variant="outline" className="text-xs mb-1">{visual.type}</Badge>
                      </div>
                      <p className="text-xs text-gray-700">{visual.description}</p>
                      {visual.component && (
                        <div className="mt-2">
                          {visual.component}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.interactiveDemo && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-blue-900 mb-1">
                      {section.interactiveDemo.title}
                    </h4>
                    <p className="text-xs text-blue-800">
                      {section.interactiveDemo.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="ml-3"
                    onClick={section.interactiveDemo.onActivate}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    {section.interactiveDemo.actionText}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                {concept.title}
              </CardTitle>
              <Badge className={`${difficultyColors[concept.difficulty]}`}>
                {concept.difficulty}
              </Badge>
              <Badge variant="outline">{concept.category}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {concept.overview}
              </p>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="explanation" className="text-xs">Explanation</TabsTrigger>
                  <TabsTrigger value="takeaways" className="text-xs">Key Points</TabsTrigger>
                  <TabsTrigger value="confusions" className="text-xs">Common Errors</TabsTrigger>
                  <TabsTrigger value="applications" className="text-xs">Applications</TabsTrigger>
                </TabsList>

                <TabsContent value="explanation" className="space-y-4 mt-4">
                  {showDifficultyFilter && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Filter by difficulty:</span>
                      <div className="flex gap-1">
                        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
                          <Button
                            key={level}
                            variant={difficultyFilter === level ? "default" : "outline"}
                            size="sm"
                            className="text-xs h-6 px-2"
                            onClick={() => setDifficultyFilter(level)}
                          >
                            {level === 'all' ? 'All' : level}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {filteredSections.map(renderSection)}
                  </div>
                </TabsContent>

                <TabsContent value="takeaways" className="mt-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      Key Takeaways
                    </h3>
                    <ul className="space-y-2">
                      {concept.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-500 mt-1">✓</span>
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="confusions" className="mt-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      Common Confusions
                    </h3>
                    <ul className="space-y-2">
                      {concept.commonConfusions.map((confusion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-orange-500 mt-1">⚠</span>
                          {confusion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-purple-600" />
                        Real-World Applications
                      </h3>
                      <ul className="space-y-2">
                        {concept.realWorldApplications.map((application, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-purple-500 mt-1">→</span>
                            {application}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {concept.furtherReading.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2 mb-3">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                          Further Reading
                        </h3>
                        <div className="space-y-2">
                          {concept.furtherReading.map((resource, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs h-8"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              {resource.title}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}