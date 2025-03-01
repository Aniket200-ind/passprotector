//! src/components/features/FeatureCarousel.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FeatureCard,
  type FeatureItem,
} from "@/components/features/FeatureCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturesCarouselProps {
  features: FeatureItem[];
}

export function FeaturesCarousel({ features }: FeaturesCarouselProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
  
    if (isPlaying) {
      interval = setInterval(() => {
        if (api) {
          if (current === count - 1) {
            api.scrollTo(0); // Reset to first slide when reaching the last
          } else {
            api.scrollNext();
          }
        }
      }, 5000);
    }
  
    return () => clearInterval(interval);
  }, [api, isPlaying, current, count]);
  

  const toggleAutoplay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <div className="relative">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/1">
              <FeatureCard feature={feature} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-background/80 hover:bg-background" />
        <CarouselNext className="right-2 bg-background/80 hover:bg-background" />
      </Carousel>

      <div className="flex justify-center items-center mt-6 gap-4">
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-cyberBlue w-4 shadow-[0_0_8px_#00FFFF]"
                  : "bg-gray-600"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAutoplay}
          className="h-8 w-8 rounded-full bg-background/20"
          aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-cyberBlue" />
          ) : (
            <Play className="h-4 w-4 text-cyberBlue" />
          )}
        </Button>
      </div>
    </div>
  );
}
