"use client";

import { useEffect, useRef, useState } from "react";

export default function FactureScene() {
  const scene = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = scene.current;
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
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={scene}
      className="invoice-flow"
      data-visible={visible}
      role="img"
      aria-label="Illustration de principe : une facture en FCFA se compose puis rejoint une ligne du journal."
    >
      <div className="invoice-sheet">
        <p className="invoice-sheet__title">Facture · exemple</p>
        <p className="invoice-sheet__amount">Montant saisi</p>
        <span className="invoice-sheet__currency">En FCFA</span>
        <div className="invoice-sheet__lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <span className="invoice-flow__path" aria-hidden="true" />
      <div className="journal-sheet">
        <p className="journal-sheet__title">Journal</p>
        <div className="journal-sheet__row">
          <span>Écriture</span>
          <strong>FCFA</strong>
        </div>
        <div className="journal-sheet__row">
          <span>Enregistrement</span>
          <strong>OK</strong>
        </div>
      </div>
    </div>
  );
}
