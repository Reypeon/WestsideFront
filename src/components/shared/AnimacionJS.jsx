import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Interpolación lineal
const lerp = (start, end, t) => start + (end - start) * t;

// 🔹 Convierte rangos de movimiento (px o %)
const getValue = (range, t) => {
  if (!range) return "0px";

  const [start, end] = range;

  // Si ambos son strings con %
  if (
    typeof start === "string" &&
    typeof end === "string" &&
    start.includes("%") &&
    end.includes("%")
  ) {
    const startNum = parseFloat(start);
    const endNum = parseFloat(end);
    const value = lerp(startNum, endNum, t);
    return `${value}%`;
  }

  // Si son números → px
  if (typeof start === "number" && typeof end === "number") {
    return `${lerp(start, end, t)}px`;
  }

  return "0px"; // fallback
};

// 🔹 Convierte scrollRange a px (acepta % o px)
const getScrollRange = (range) => {
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  return range.map((val) => {
    if (typeof val === "string" && val.includes("%")) {
      const num = parseFloat(val);
      return (num / 100) * docHeight; // convierte % en px
    }
    return val; // ya está en px
  });
};

const AnimacionJS = ({
  as: Tag = "div",
  className,
  scrollRange = [0, 1000], // puede ser px o %
  xRange,      // [from, to], px o %
  yRange,      // [from, to], px o %
  scaleRange,  // [from, to]
  opacityRange, // [from, to]
  children,
  style = {},
}) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [scrollY, setScrollY] = useState(
    typeof window !== "undefined"
      ? document.documentElement.scrollTop || document.body.scrollTop
      : 0
  );

  useEffect(() => {
    if (!inView) return;

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

  // 🔹 Convierte scrollRange (px o %) a valores absolutos en px
  const [startScroll, endScroll] = getScrollRange(scrollRange);

  // Normaliza scroll entre 0 y 1
  const t =
    scrollY <= startScroll
      ? 0
      : scrollY >= endScroll
      ? 1
      : (scrollY - startScroll) / (endScroll - startScroll);

  // Valores interpolados
  const x = getValue(xRange, t);
  const y = getValue(yRange, t);
  const scale = scaleRange ? lerp(scaleRange[0], scaleRange[1], t) : 1;
  const opacity = opacityRange ? lerp(opacityRange[0], opacityRange[1], t) : 1;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        transform: `translateX(${x}) translateY(${y}) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
};

export default AnimacionJS;
