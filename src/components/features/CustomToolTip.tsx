//! src/components/features/CustomToolTip.tsx

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info as InfoIcon } from "lucide-react";
import { useState } from "react";

export default function SuggestionTooltip({ message }: { message: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      {/* Hide the entire tooltip on small screens, show from lg breakpoint up */}
      <div className="hidden lg:block">
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild onClick={() => setIsOpen(!isOpen)}>
            <button 
              className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full 
                      bg-muted-foreground/20 hover:bg-synthwavePink/20 transition-colors" 
              aria-label="Show more information"
            >
              <InfoIcon className="h-3 w-3 text-muted-foreground hover:text-synthwavePink transition-colors" />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="bg-charcoal/90 border border-cyberBlue/30 text-white backdrop-blur-md 
                    p-3 rounded-md max-w-[250px] shadow-lg shadow-synthwavePink/10"
          >
            <p className="text-xs leading-relaxed">{message}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* For mobile devices, we could optionally show a simplified version */}
      <div className="lg:hidden">
        {/* Nothing here hides the tooltip completely on mobile */}
      </div>
    </TooltipProvider>
  );
}