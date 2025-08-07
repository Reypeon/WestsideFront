import { useState } from "react";

const IconoTachoConico = ({
  width = 30,
  height = 30,
  color = "#000",
  hoverColor = "#ff3b3b",
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const stroke = hover ? hoverColor : color;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}
      {...props}
    >
      {/* Tapa */}
      <path d="M4 6h16" />
      <path d="M9 6V4.8a.8.8 0 0 1 .8-.8h4.4a.8.8 0 0 1 .8.8V6" />

      {/* Cuerpo cónico */}
      <path d="M6 6l2 13h8l2-13" />

      {/* Líneas interiores */}
      <path d="M10 10v6M14 10v6" />
    </svg>
  );
};

export default IconoTachoConico;
