"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-debug";
import { MinimalSelect } from "@/components/ui/select-minimal";

export default function DebugSelectPage() {
  const [value, setValue] = useState("");
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Debug Select Component</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Simple Test</h2>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[400px]">
            <SelectValue placeholder="Choose an option..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">
              <div className="border border-green-500 p-2">
                <div className="font-medium">Option 1</div>
                <div className="text-xs">Description for option 1</div>
              </div>
            </SelectItem>
            <SelectItem value="opt2">
              <div className="border border-green-500 p-2">
                <div className="font-medium">Option 2</div>
                <div className="text-xs">Description for option 2</div>
              </div>
            </SelectItem>
            <SelectItem value="opt3">
              <div className="border border-green-500 p-2">
                <div className="font-medium">Option 3</div>
                <div className="text-xs">Description for option 3</div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p>Selected value: {value || "none"}</p>
        <p className="text-sm text-gray-600 mt-2">
          Open browser console to see debug logs. Each item should have:
        </p>
        <ul className="text-sm text-gray-600 ml-4 mt-1">
          <li>• Red border from SelectContent wrapper</li>
          <li>• Blue border from SelectItem</li>
          <li>• Green border from inner content</li>
        </ul>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Minimal Test (No Tailwind)</h2>
        <MinimalSelect />
      </div>
    </div>
  );
}