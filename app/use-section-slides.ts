"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
// Finish navigation on elapsed time, even when a background tab throttles frames.
gsap.ticker.lagSmoothing(0);

export const slides = [
  { id: "home", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "service", label: "Service" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function useSectionSlides(pageRef: RefObject<HTMLElement | null>) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentRef = useRef(0);
  const stableSlideRef = useRef(0);
  const panelsRef = useRef<HTMLElement[]>([]);
  const trackingRef = useRef<ScrollTrigger | null>(null);
  const snappingRef = useRef<ScrollTrigger | null>(null);
  const navigationTweenRef = useRef<gsap.core.Tween | null>(null);
  const destinationRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  const goToSlide = useCallback((index: number) => {
    const root = pageRef.current;
    const panels = panelsRef.current;
    if (!root || !panels.length) return;

    const destination = Math.max(0, Math.min(index, panels.length - 1));
    const target = panels[destination];
    destinationRef.current = destination;
    snappingRef.current?.disable(false);
    navigationTweenRef.current?.kill();
    root.dataset.transition = "running";

    navigationTweenRef.current = gsap.to(window, {
      scrollTo: { y: target, autoKill: false },
      duration: reducedRef.current ? 0 : 1.05,
      ease: "power3.inOut",
      overwrite: "auto",
      onComplete: () => {
        root.dataset.transition = "idle";
        destinationRef.current = null;
        navigationTweenRef.current = null;
        currentRef.current = destination;
        stableSlideRef.current = destination;
        setCurrentSlide(destination);
        window.history.replaceState(null, "", `#${target.id}`);
        target.focus({ preventScroll: true });
        snappingRef.current?.enable(true, false);
        snappingRef.current?.update();
        trackingRef.current?.update();
      },
    });
  }, [pageRef]);

  useGSAP((_context, contextSafe) => {
    const root = pageRef.current;
    const safe = contextSafe;
    if (!root || !safe) return;
    const panels = gsap.utils.toArray<HTMLElement>("[data-slide]", root);
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let resizeFrame = 0;
    let initialFrame = 0;
    panelsRef.current = panels;
    reducedRef.current = motionPreference.matches;

    trackingRef.current = ScrollTrigger.create({
      id: "portfolio-slide-position",
      trigger: root,
      start: "top top",
      end: "max",
      invalidateOnRefresh: true,
      onUpdate: self => {
        const index = Math.round(self.progress * (panels.length - 1));
        if (Math.abs(panels[index].getBoundingClientRect().top) <= 2) stableSlideRef.current = index;
        if (index !== currentRef.current) {
          currentRef.current = index;
          setCurrentSlide(index);
        }
      },
    });

    const createSnap = () => {
      if (reducedRef.current || snappingRef.current) return;
      snappingRef.current = ScrollTrigger.create({
        id: "portfolio-slide-snap",
        trigger: root,
        start: "top top",
        end: "max",
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (panels.length - 1),
          directional: true,
          inertia: false,
          delay: 0.2,
          duration: { min: 0.45, max: 0.8 },
          ease: "power3.inOut",
        },
      });
    };
    createSnap();

    const initialIndex = panels.findIndex(panel => `#${panel.id}` === window.location.hash);
    if (initialIndex > 0) {
      currentRef.current = initialIndex;
      stableSlideRef.current = initialIndex;
      setCurrentSlide(initialIndex);
      initialFrame = window.requestAnimationFrame(safe(() => {
        gsap.set(window, { scrollTo: { y: panels[initialIndex], autoKill: false } });
        trackingRef.current?.update();
      }));
    }

    if (!reducedRef.current) {
      panels.forEach(panel => {
        const content = panel.querySelectorAll("[data-enter], [data-reveal]");
        gsap.from(content, {
          y: 30,
          opacity: 0,
          duration: 0.85,
          stagger: 0.065,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 65%",
            toggleActions: "play none play reverse",
          },
        });
      });
    }

    // Actual input cancels a transition; scroll rounding must not cancel it.
    const cancelNavigation = () => {
      if (!navigationTweenRef.current) return;
      navigationTweenRef.current.kill();
      navigationTweenRef.current = null;
      destinationRef.current = null;
      root.dataset.transition = "interrupted";
      snappingRef.current?.enable(true, false);
        snappingRef.current?.update();
    };

    const alignAfterResize = safe(() => {
      resizeFrame = 0;
      const targetIndex = destinationRef.current ?? stableSlideRef.current;
      const target = panels[targetIndex];
      if (!target) return;
      gsap.killTweensOf(window);
      snappingRef.current?.disable(false);
      gsap.set(window, { scrollTo: { y: target, autoKill: false } });
      if (destinationRef.current !== null) {
        window.history.replaceState(null, "", `#${target.id}`);
        currentRef.current = destinationRef.current;
        stableSlideRef.current = destinationRef.current;
        setCurrentSlide(destinationRef.current);
        destinationRef.current = null;
        navigationTweenRef.current = null;
        root.dataset.transition = "idle";
      }
      ScrollTrigger.refresh();
      snappingRef.current?.enable(true, false);
        snappingRef.current?.update();
      trackingRef.current?.update();
      currentRef.current = targetIndex;
      stableSlideRef.current = targetIndex;
      setCurrentSlide(targetIndex);
    });

    const handleResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(alignAfterResize);
    };

    const handleMotionPreference = safe((event: MediaQueryListEvent) => {
      reducedRef.current = event.matches;
      if (event.matches) {
        navigationTweenRef.current?.progress(1);
        snappingRef.current?.kill();
        snappingRef.current = null;
        root.querySelectorAll<HTMLElement>("[data-enter], [data-reveal]").forEach(element => {
          gsap.set(element, { clearProps: "opacity,transform" });
        });
      } else {
        createSnap();
      }
    });

    const handleLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!anchor) return;
      const index = panels.findIndex(panel => `#${panel.id}` === anchor.getAttribute("href"));
      if (index < 0) return;
      event.preventDefault();
      goToSlide(index);
    };

    const handleKey = safe((event: KeyboardEvent) => {
      if (root.querySelector("dialog[open]") || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable=true]")) return;
      if (event.code === "Space" && target?.closest("button, a")) return;
      const forward = ["ArrowDown", "PageDown"].includes(event.key) || (event.code === "Space" && !event.shiftKey);
      const backward = ["ArrowUp", "PageUp"].includes(event.key) || (event.code === "Space" && event.shiftKey);
      if (!forward && !backward && event.key !== "Home" && event.key !== "End") return;

      const panel = panels[currentRef.current];
      const remaining = panel.scrollHeight - panel.clientHeight - panel.scrollTop;
      // On short screens, read the rest of this section before advancing.
      if ((forward && remaining > 2) || (backward && panel.scrollTop > 2)) {
        event.preventDefault();
        gsap.to(panel, {
          scrollTo: { y: panel.scrollTop + (forward ? 1 : -1) * panel.clientHeight * 0.75 },
          duration: reducedRef.current ? 0 : 0.35,
          overwrite: "auto",
        });
        return;
      }

      event.preventDefault();
      goToSlide(event.key === "Home" ? 0 : event.key === "End" ? panels.length - 1 : currentRef.current + (forward ? 1 : -1));
    });

    root.addEventListener("click", handleLink);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", cancelNavigation, { passive: true });
    window.addEventListener("touchstart", cancelNavigation, { passive: true });
    motionPreference.addEventListener("change", handleMotionPreference);
    return () => {
      root.removeEventListener("click", handleLink);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", cancelNavigation);
      window.removeEventListener("touchstart", cancelNavigation);
      motionPreference.removeEventListener("change", handleMotionPreference);
      window.cancelAnimationFrame(resizeFrame);
      window.cancelAnimationFrame(initialFrame);
      navigationTweenRef.current?.kill();
      panelsRef.current = [];
      trackingRef.current = null;
      snappingRef.current = null;
      navigationTweenRef.current = null;
      destinationRef.current = null;
    };
  }, { scope: pageRef, dependencies: [goToSlide] });

  return { currentSlide, goToSlide };
}
