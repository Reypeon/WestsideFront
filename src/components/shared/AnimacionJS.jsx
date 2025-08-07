import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Interpolación lineal
const lerp = (start, end, t) => start + (end - start) * t;

const AnimacionJS = ({
  as: Tag = "div",
  className,
  scrollRange = [0, 1000], // rango de scroll global para normalizar t entre 0 y 1
  xRange,      // [from, to], opcional
  yRange,      // [from, to], opcional
  scaleRange,  // [from, to], opcional
  opacityRange, // [from, to], opcional
  children,
  style = {},
}) => {
  // Usamos IntersectionObserver para saber si el elemento está en pantalla
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1, // detecta con 1px visible
  });

  const [scrollY, setScrollY] = useState(
    typeof window !== "undefined"
      ? document.documentElement.scrollTop || document.body.scrollTop
      : 0
  );

  useEffect(() => {
    if (!inView) return; // No escucha scroll si no está visible

    const onScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setScrollY(scrollTop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [inView]);

  // Normaliza el scroll global entre 0 y 1
  const t =
    scrollY <= scrollRange[0]
      ? 0
      : scrollY >= scrollRange[1]
      ? 1
      : (scrollY - scrollRange[0]) / (scrollRange[1] - scrollRange[0]);

  // Interpola si los valores están definidos, si no usa valores por defecto
  const x = xRange ? lerp(xRange[0], xRange[1], t) : 0;
  const y = yRange ? lerp(yRange[0], yRange[1], t) : 0;
  const scale = scaleRange ? lerp(scaleRange[0], scaleRange[1], t) : 1;
  const opacity = opacityRange ? lerp(opacityRange[0], opacityRange[1], t) : 1;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        transform: `translateX(${x}px) translateY(${y}px) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
};

export default AnimacionJS;
