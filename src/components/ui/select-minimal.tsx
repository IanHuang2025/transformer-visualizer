"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

export function MinimalSelect() {
  return (
    <SelectPrimitive.Root>
      <SelectPrimitive.Trigger style={{ 
        padding: '8px', 
        border: '1px solid black',
        width: '300px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <SelectPrimitive.Value placeholder="Select..." />
        <SelectPrimitive.Icon>▼</SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content 
          position="popper"
          style={{ 
            backgroundColor: 'white', 
            border: '1px solid black',
            borderRadius: '4px',
            padding: '4px',
            zIndex: 50
          }}
        >
          <SelectPrimitive.Viewport>
            <SelectPrimitive.Item 
              value="1" 
              style={{ 
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <SelectPrimitive.ItemText>
                <div>
                  <div>Option 1 Title</div>
                  <div style={{ fontSize: '12px' }}>Option 1 Description</div>
                </div>
              </SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
            
            <SelectPrimitive.Item 
              value="2" 
              style={{ 
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <SelectPrimitive.ItemText>
                <div>
                  <div>Option 2 Title</div>
                  <div style={{ fontSize: '12px' }}>Option 2 Description</div>
                </div>
              </SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
            
            <SelectPrimitive.Item 
              value="3" 
              style={{ 
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <SelectPrimitive.ItemText>Option 3 Simple</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}