"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { PanelContainer } from "./PanelContainer";
import { Eye, EyeOff } from "lucide-react";

interface CausalMaskPanelProps {
  causalMask: boolean;
  onCausalMaskChange: (causal: boolean) => void;
  onInteraction: () => void;
}

export function CausalMaskPanel({
  causalMask,
  onCausalMaskChange,
  onInteraction,
}: CausalMaskPanelProps) {
  const handleToggle = (checked: boolean) => {
    onCausalMaskChange(checked);
    onInteraction();
  };

  return (
    <PanelContainer
      title="Causal Masking"
      icon={causalMask ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      description="Control whether tokens can see future positions"
    >
      <div className="space-y-4">
        {/* Toggle Control */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">
              Enable Causal Mask
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Prevents tokens from seeing future positions (decoder-style)
            </div>
          </div>
          <Switch
            checked={causalMask}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* Status and Mode Display */}
        <div className={`p-3 rounded-lg border ${
          causalMask 
            ? "bg-orange-50 border-orange-200" 
            : "bg-green-50 border-green-200"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`text-sm font-medium ${
              causalMask ? "text-orange-900" : "text-green-900"
            }`}>
              Mode: {causalMask ? "Decoder (Causal)" : "Encoder (Bidirectional)"}
            </div>
            {causalMask ? <EyeOff className="w-4 h-4 text-orange-600" /> : <Eye className="w-4 h-4 text-green-600" />}
          </div>
          <div className={`text-xs ${
            causalMask ? "text-orange-800" : "text-green-800"
          }`}>
            {causalMask 
              ? "Tokens can only attend to previous positions (like GPT)"
              : "Tokens can attend to all positions (like BERT)"
            }
          </div>
        </div>

        {/* Educational Content */}
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm">
              <div className="font-medium text-blue-900 mb-1">Understanding Causal Masking</div>
              <div className="text-blue-800 text-xs space-y-1">
                <div>• <strong>Causal (ON):</strong> Used in language generation (GPT). Each token can only "see" tokens that come before it.</div>
                <div>• <strong>Bidirectional (OFF):</strong> Used in understanding tasks (BERT). Each token can see all other tokens.</div>
              </div>
            </div>
          </div>

          {/* Visual Attention Pattern */}
          <div className="border rounded-lg p-3">
            <div className="text-xs font-medium text-gray-700 mb-2">
              Attention Pattern: {causalMask ? "Causal (Lower Triangle)" : "Bidirectional (Full Matrix)"}
            </div>
            
            <div className="grid grid-cols-5 gap-1 mb-2">
              {Array.from({ length: 25 }, (_, i) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                const canAttend = causalMask ? col <= row : true;
                
                return (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                      canAttend 
                        ? "bg-blue-500 text-white" 
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {canAttend ? "✓" : "✗"}
                  </div>
                );
              })}
            </div>
            
            <div className="text-xs text-gray-500">
              {causalMask 
                ? "✓ = Can attend, ✗ = Masked (can't see future)" 
                : "✓ = Can attend to all positions"
              }
            </div>
          </div>

          {/* Use Cases */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${
              causalMask ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="text-xs font-medium text-gray-800 mb-1">Causal (Decoder)</div>
              <div className="text-xs text-gray-600 space-y-0.5">
                <div>• Text generation</div>
                <div>• Language modeling</div>
                <div>• GPT-style models</div>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg border ${
              !causalMask ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="text-xs font-medium text-gray-800 mb-1">Bidirectional (Encoder)</div>
              <div className="text-xs text-gray-600 space-y-0.5">
                <div>• Text understanding</div>
                <div>• Classification</div>
                <div>• BERT-style models</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
}