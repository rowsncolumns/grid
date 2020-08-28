import React, { useCallback, useEffect, useRef } from "react";
import { GridRef, ScrollCoords } from "../Grid";
// @ts-ignore
import { Scroller } from "scroller";
import { canUseDOM } from "../helpers";

export interface TouchProps {
  /**
   * Grid reference to access grid methods
   */
  gridRef: React.MutableRefObject<GridRef | null>;
}

export interface TouchResults {
  isTouchDevice: boolean;
  scrollTo: (scrollState: ScrollCoords) => void;
  scrollToTop: () => void;
}

/**
 * Enable touch interactions
 * Supports
 * 1. Scrolling
 * 2. Cell selection
 */
const useTouch = ({ gridRef }: TouchProps): TouchResults => {
  const scrollerRef = useRef<typeof Scroller | null>(null);
  const isTouchDevice = useRef<boolean>(false);
  useEffect(() => {
    isTouchDevice.current = canUseDOM && "ontouchstart" in window;
    /* Update dimension */
    if (isTouchDevice.current) {
      const options = {
        scrollingX: true,
        scrollingY: true,
        decelerationRate: 0.95,
        penetrationAcceleration: 0.08,
      };

      /* Add listeners */
      gridRef.current?.container?.addEventListener(
        "touchstart",
        handleTouchStart
      );
      gridRef.current?.container?.addEventListener("touchend", handleTouchEnd);
      gridRef.current?.container?.addEventListener(
        "touchmove",
        handleTouchMove
      );

      /* Add scroller */
      scrollerRef.current = new Scroller(handleTouchScroll, options);

      const dims = gridRef.current?.getDimensions();
      /* Update dimensions */
      updateScrollDimensions(dims);
    }
  }, []);

  /* Scroll to x, y coordinate */
  const scrollTo = useCallback(({ scrollLeft, scrollTop }) => {
    if (scrollerRef.current)
      scrollerRef.current.scrollTo(scrollLeft, scrollTop);
  }, []);
  /* Scrolls to top if mobile */
  const scrollToTop = useCallback(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTo(0, 0);
  }, []);

  const updateScrollDimensions = useCallback(
    ({
      containerWidth,
      containerHeight,
      estimatedTotalWidth,
      estimatedTotalHeight,
    }) => {
      scrollerRef.current.setDimensions(
        containerWidth,
        containerHeight,
        estimatedTotalWidth,
        estimatedTotalHeight
      );
    },
    []
  );

  const handleTouchScroll = useCallback((scrollLeft, scrollTop) => {
    gridRef.current?.scrollTo({ scrollTop, scrollLeft });
  }, []);
  const handleTouchStart = useCallback((e: globalThis.TouchEvent) => {
    scrollerRef.current.doTouchStart(e.touches, e.timeStamp);
  }, []);
  const handleTouchMove = useCallback((e: globalThis.TouchEvent) => {
    e.preventDefault();
    scrollerRef.current.doTouchMove(e.touches, e.timeStamp);
  }, []);
  const handleTouchEnd = useCallback((e) => {
    scrollerRef.current.doTouchEnd(e.timeStamp);
  }, []);

  return {
    isTouchDevice: isTouchDevice.current,
    scrollTo,
    scrollToTop,
  };
};

export default useTouch;
