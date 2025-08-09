"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TestSelect() {
  return (
    <div className="p-8">
      <h2>Test Select with Simple Items</h2>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      <h2 className="mt-8">Test Select with Complex Items (like our use case)</h2>
      <Select>
        <SelectTrigger className="w-[400px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">
            <div>
              <div>Title 1</div>
              <div className="text-xs">Description 1</div>
            </div>
          </SelectItem>
          <SelectItem value="2">
            <div>
              <div>Title 2</div>
              <div className="text-xs">Description 2</div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}