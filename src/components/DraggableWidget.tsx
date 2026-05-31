import React, { useRef } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

interface DraggableWidgetProps {
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  className?: string;
  id?: string;
}

export function DraggableWidget({ children, defaultPosition, className = '', id }: DraggableWidgetProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable 
      nodeRef={nodeRef} 
      defaultPosition={defaultPosition}
      handle=".drag-handle"
      bounds="parent"
    >
      <div 
        ref={nodeRef} 
        id={id}
        className={`absolute pointer-events-auto ${className}`}
        style={{ zIndex: 50 }}
      >
        {children}
      </div>
    </Draggable>
  );
}
