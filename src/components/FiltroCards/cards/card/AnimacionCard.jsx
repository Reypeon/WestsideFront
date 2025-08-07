

import React, { useEffect, useRef, useState } from "react";

/**
 * AnimacionCard
 * 
 * Aplica una animación de entrada basada en scroll cuando el componente
 * entra al viewport y se alcanza cierto valor de scroll.
 *
 * Props:
 * - as: HTML tag o componente (por defecto, "div")
 * - className: Clases CSS
 * - scrollTrigger: ScrollY mínimo para activar animación (por defecto, 0)
 * - enabled: booleano para activar o desactivar la animación (por defecto, true)
 * - children: Contenido del componente
 * - style: Estilos adicionales
 */
const AnimacionCard = ({
  as: Tag = "div",
  className,
  scrollTrigger = 0,
  enabled = true,
  children,
  style = {},
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(!enabled); // si está deshabilitado, mostrar directamente
  const ticking = useRef(false);

  const checkVisibility = () => {
    if (!ref.current || !enabled) return;

    const scrollY = window.scrollY;
    const rect = ref.current.getBoundingClientRect();

    const isVisible =
      scrollY >= scrollTrigger &&
      rect.top >= 0 &&
      rect.top <= window.innerHeight;

    setVisible(isVisible);
    ticking.current = false;
  };

  useEffect(() => {
    if (!enabled) return; // No hacer nada si está desactivado

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(checkVisibility);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    checkVisibility();

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTrigger, enabled]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        transform: visible
          ? `translateY(0px) scale(1)`     // Estado visible: posición normal
          : `translateY(0px) scale(0.8)`,// Estado oculto: más abajo y más pequeño
        opacity: visible ? 1 : 0.5,        // Transparencia según visibilidad
        transition: "all 0.6s ease-out",   // Transición suave
        willChange: "transform, opacity", // Optimización para animación
        ...style, 
      }}
    >
      {children}
    </Tag>
  );
};

export default AnimacionCard;
