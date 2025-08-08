"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { PanelContainer } from "./PanelContainer";
import { MapPin } from "lucide-react";

interface PositionalEncodingsPanelProps {
  usePositional: boolean;
  onPositionalChange: (usePositional: boolean) => void;
  onInteraction: () => void;
}

export function PositionalEncodingsPanel({
  usePositional,
  onPositionalChange,
  onInteraction,
}: PositionalEncodingsPanelProps) {
  const handleToggle = (checked: boolean) => {
    onPositionalChange(checked);
    onInteraction();
  };

  return (
    <PanelContainer
      title="Positional Encodings"
      icon={<MapPin className="w-5 h-5" />}
      description="Add position information to token embeddings"
    >
      <div className="space-y-4">
        {/* Toggle Control */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">
              Enable Positional Encodings
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Adds sin/cos position information to embeddings
            </div>
          </div>
          <Switch
            checked={usePositional}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* Status Indicator */}
        <div className={`p-3 rounded-lg border ${
          usePositional 
            ? "bg-green-50 border-green-200" 
            : "bg-orange-50 border-orange-200"
        }`}>
          <div className={`text-sm font-medium ${
            usePositional ? "text-green-900" : "text-orange-900"
          }`}>
            Status: {usePositional ? "Enabled" : "Disabled"}
          </div>
          <div className={`text-xs mt-1 ${
            usePositional ? "text-green-800" : "text-orange-800"
          }`}>
            {usePositional 
              ? "Tokens know their position in the sequence"
              : "Tokens have no position awareness"
            }
          </div>
        </div>

        {/* Educational Content */}
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm">
              <div className="font-medium text-blue-900 mb-1">What are Positional Encodings?</div>
              <div className="text-blue-800 text-xs">
                Since attention has no inherent sense of order, positional encodings tell the model 
                where each token appears in the sequence. This is crucial for understanding syntax and grammar.
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-sm">
              <div className="font-medium text-purple-900 mb-1">How It Works</div>
              <div className="text-purple-800 text-xs space-y-1">
                <div>• Uses sine and cosine functions at different frequencies</div>
                <div>• Each position gets a unique encoding pattern</div>
                <div>• Added directly to token embeddings before attention</div>
                <div>• Allows model to distinguish "cat sat" vs "sat cat"</div>
              </div>
            </div>
          </div>

          {/* Visual Representation */}
          {usePositional && (
            <div className="border rounded-lg p-3">
              <div className="text-xs font-medium text-gray-700 mb-2">Position Pattern Preview</div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((pos) => (
                  <div key={pos} className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded text-white text-xs flex items-center justify-center font-bold mb-1">
                      {pos}
                    </div>
                    <div className="text-xs text-gray-500">pos</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Each position gets a unique sine/cosine encoding pattern
              </div>
            </div>
          )}
        </div>
      </div>
    </PanelContainer>
  );
}