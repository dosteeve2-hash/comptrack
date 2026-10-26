"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export default function Reveal({ children }: { children: ReactNode }) {
  const element = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = element.current;
    if (!target || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={element} data-reveal={visible ? "true" : undefined}>
      {children}
    </div>
  );
}
