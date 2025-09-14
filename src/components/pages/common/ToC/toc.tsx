/**
 * This component was inspired by bepyan.me/en and its documentation.
 */

import { useEffect, useRef, useState } from "react";

import type { DynamicTocProps } from "@interfaces/toc.interface";

import { throttle } from "es-toolkit";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";

import ProgressCircle from "./progressCircle";

export default function TOC({ title, headings }: DynamicTocProps) {
  const isHidden = useIsHidden();
  const { rootRef, expanded, setExpanded } = useExpanded();
  const { progress } = useArticleScrollProgress();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    let headingsPositions: { slug: string; top: number }[] = [];

    const updatePositions = () => {
      headingsPositions = headings
        .map(({ slug }) => {
          const el = document.getElementById(slug);
          return el ? { slug, top: el.offsetTop } : null;
        })
        .filter((x): x is { slug: string; top: number } => x !== null);
    };

    const onScroll = throttle(() => {
      const scrollY = window.scrollY;
      let current: string | null = null;
      headingsPositions.forEach((h) => {
        if (scrollY >= h.top - 10) {
          current = h.slug;
        }
      });
      setActiveSlug(current);
    }, 100);

    updatePositions();
    onScroll();

    window.addEventListener("scroll", onScroll, { capture: true });
    window.addEventListener("resize", updatePositions, { capture: true });

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", updatePositions, { capture: true });
    };
  }, [headings]);

  return (
    <div
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 flex items-center justify-between"
      aria-label="Table of contents"
    >
      <AnimatePresence initial={false} mode="wait">
        {!isHidden && (
          <motion.div
            variants={{
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  delay: 0.1,
                  y: {
                    type: "spring",
                    bounce: 0.4,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              },
              hidden: {
                y: -68,
                opacity: 0,
                transition: {
                  delay: 0.4,
                  y: {
                    type: "spring",
                    bounce: 0.4,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              aria-expanded={expanded}
              tabIndex={0}
              ref={rootRef}
              layout
              className="relative select-none max-w-2xs sm:max-w-4xl backdrop-blur-xl border border-cz-text-relax-dark text-cz-text-content-dark "
              style={{
                borderRadius: expanded ? 16 : 300,
                padding: expanded ? "16px 16px" : "8px 12px",
                width: expanded ? "400px" : "fit-content",
                cursor: expanded ? "default" : "pointer",
              }}
              transition={{
                type: "spring",
                bounce: expanded ? 0.3 : 0.25,
              }}
              whileTap={{
                scale: expanded ? 1 : 0.9,
              }}
              whileHover={{
                scale: expanded ? 1 : 1.1,
              }}
              onClick={() => setExpanded(!expanded)}
            >
              <motion.div layout="position" className="flex">
                <ProgressCircle progress={progress} />
                <span className="font-pixel ml-2 inline-block truncate text-sm font-bold">
                  {title}
                </span>
              </motion.div>
              {expanded && (
                <motion.div
                  layout="size"
                  initial={{
                    opacity: 0,
                    filter: "blur(2px)",
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                      delay: 0.15,
                    },
                  }}
                  transition={{
                    type: "spring",
                    bounce: expanded ? 0.3 : 0.25,
                  }}
                  key={expanded ? "list" : "title"}
                >
                  <div className="mt-2 text-xs overflow-y-auto max-h-90">
                    {headings.map(({ text, slug, depth }) => (
                      <div
                        key={slug}
                        className="relative flex items-center"
                        style={{ paddingLeft: `${(depth - 2) * 12}px` }}
                      >
                        <AnimatePresence mode="popLayout">
                          {slug === activeSlug && (
                            <motion.div
                              layoutId="indicator"
                              className="absolute left-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: "spring", bounce: 0.25 }}
                            >
                              <div className="size-1 shrink-0 rounded-full bg-cz-primary" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <a
                          href={`#${slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`py-1 transition-all duration-200 ease-in-out font-rubik ${
                            slug === activeSlug
                              ? "text-cz-text-headers-dark"
                              : "text-cz-text-relax-dark"
                          }`}
                        >
                          {text}
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useIsHidden() {
  const [isHidden, setIsHidden] = useState(true);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Aparece después de hacer scroll 100px
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsHidden(entry.isIntersecting);
      });
    });

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return isHidden;
}

function useExpanded() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expanded && !rootRef.current?.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && expanded) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    } else {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [expanded]);

  return {
    rootRef,
    expanded,
    setExpanded,
  };
}

function useArticleScrollProgress() {
  const articleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    articleRef.current = document.querySelector<HTMLDivElement>("#mdx-content");
  }, []);

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { progress };
}
