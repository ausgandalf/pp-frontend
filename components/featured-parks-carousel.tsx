'use client'

import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type FeaturedParksCarouselProps = {
  children: React.ReactNode
}

export function FeaturedParksCarousel({ children }: FeaturedParksCarouselProps) {
  const autoplay = React.useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    [],
  )

  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {React.Children.map(children, (child, index) => (
            <CarouselItem
              key={
                React.isValidElement(child) && child.key != null
                  ? String(child.key)
                  : index
              }
              className="min-h-[1px] basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/3"
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          className="border-border bg-background shadow-sm -left-4 sm:-left-12"
        />
        <CarouselNext
          variant="outline"
          className="border-border bg-background shadow-sm -right-4 sm:-right-12"
        />
      </Carousel>
    </div>
  )
}
