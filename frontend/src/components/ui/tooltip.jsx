import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(({ style, sideOffset = 4, ...props }, ref) => {
  const tooltipStyles = {
    zIndex: 50,
    overflow: 'hidden',
    borderRadius: '6px',
    border: '1px solid hsl(220, 13%, 91%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
    padding: '6px 12px',
    fontSize: '14px',
    color: 'hsl(222, 47%, 11%)',
    boxShadow: '0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.1)',
    animation: 'fadeIn 0.2s ease-out',
    ...style
  };

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      style={tooltipStyles}
      {...props}
    />
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };