"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);
// Finish button navigation even when a background tab throttles frames.
gsap.ticker.lagSmoothing(0);

export function useSectionSlides(pageRef: RefObject<HTMLElement | null>) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const panelsRef = useRef<HTMLElement[]>([]);
  const navigationTweenRef = useRef<gsap.core.Tween | null>(null);

  const goToSlide = useCallback(
    (index: number, animate = false) => {
      const root = pageRef.current;
      const panels = panelsRef.current;
      if (!root || !panels.length) return;

      const destination = Math.max(0, Math.min(index, panels.length - 1));
      const target = panels[destination];
      navigationTweenRef.current?.kill();
      navigationTweenRef.current = null;

      const finishNavigation = () => {
        navigationTweenRef.current = null;
        root.dataset.transition = "idle";
        setCurrentSlide(destination);
        window.history.replaceState(null, "", `#${target.id}`);
        target.focus({ preventScroll: true });
      };

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!animate || reducedMotion) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        finishNavigation();
        return;
      }

      root.dataset.transition = "running";
      navigationTweenRef.current = gsap.to(window, {
        scrollTo: { y: target, autoKill: false },
        duration: 1.05,
        ease: "power3.inOut",
        overwrite: "auto",
        onComplete: finishNavigation,
      });
    },
    [pageRef],
  );

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-slide]"));
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scrollFrame = 0;
    panelsRef.current = panels;
    root.dataset.scrollMode = "native";
    root.dataset.transition = "idle";

    // Track the visible section without moving the page or animating its content.
    const updatePosition = () => {
      scrollFrame = 0;
      const readingLine = window.innerHeight * 0.4;
      let index = 0;

      panels.forEach((panel, panelIndex) => {
        if (panel.getBoundingClientRect().top <= readingLine) index = panelIndex;
      });

      setCurrentSlide(index);
    };

    const handleScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updatePosition);
    };

    const cancelNavigation = () => {
      if (!navigationTweenRef.current) return;
      navigationTweenRef.current.kill();
      navigationTweenRef.current = null;
      root.dataset.transition = "idle";
    };

    const handleResize = () => {
      cancelNavigation();
      handleScroll();
    };

    const handleKey = (event: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Tab"].includes(
          event.key,
        )
      ) {
        cancelNavigation();
      }
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) navigationTweenRef.current?.progress(1);
    };

    const handleLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (!anchor) return;

      const index = panels.findIndex((panel) => `#${panel.id}` === anchor.getAttribute("href"));
      if (index < 0) return;
      event.preventDefault();
      goToSlide(index);
    };

    handleScroll();
    root.addEventListener("click", handleLink);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", cancelNavigation, { passive: true });
    window.addEventListener("touchstart", cancelNavigation, { passive: true });
    window.addEventListener("keydown", handleKey);
    motionPreference.addEventListener("change", handleMotionPreference);

    return () => {
      root.removeEventListener("click", handleLink);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", cancelNavigation);
      window.removeEventListener("touchstart", cancelNavigation);
      window.removeEventListener("keydown", handleKey);
      motionPreference.removeEventListener("change", handleMotionPreference);
      window.cancelAnimationFrame(scrollFrame);
      navigationTweenRef.current?.kill();
      navigationTweenRef.current = null;
      panelsRef.current = [];
    };
  }, [pageRef, goToSlide]);

  return { currentSlide, goToSlide };
}
