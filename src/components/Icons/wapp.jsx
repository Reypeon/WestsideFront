import React, { useState } from "react";
const IconoConHover = ({ width = 57, height = 57, color = "#000000" }) => {
  const [hover, setHover] = useState(false);

  const containerStyle = {
    display: "flex",
    minWidth: "105%",
    minHeight: "105%",
    flexDirection: "row",
    alignItems: "end",
    justifyContent: "center",
    position: "relative", // para que el texto absolute funcione
    cursor: "pointer",
    userSelect: "none",
  };

  const svgStyle = {
    display: "flex",
    width: "12vh",
    height: "12vh",
    transition: "transform 0.3s ease",
    transform: hover ? "translateY(-10px)" : "translateY(0)",
  };

  const textStyle = {
    right: '120%',
    fontSize: 'smaller',
    fontWeight: 700,
    borderBottom: '1px solid var(--colorv1)',
    borderRadius: '15px',
    lineHeight: 1.5,
    display: "flex",
    position: "absolute",
    background: "#000000",
    color: "var(--blanco)",  // o un color fijo como "#fff"
    fontFamily: "var(--font1)",
    width: "auto",
    padding: '0 1rem',
    alignItems:"center",
    height:"5vh",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    opacity: hover ? 1 : 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
    top: "50%",
    transform: hover ? "translateY(-50%)" : "translateY(-50%)", // para centrar verticalmente
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Escríbenos al WhatsApp"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") setHover(!hover);
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        style={svgStyle}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C10.1409 22.75 8.39016 22.2775 6.86335 21.4455L2.12395 22.2397C1.88692 22.2794 1.6452 22.2031 1.47391 22.0345C1.30261 21.8659 1.2225 21.6255 1.25845 21.3878L2.05878 16.0977C1.53735 14.8339 1.25001 13.4496 1.25001 12C1.25001 6.06294 6.06295 1.25 12 1.25ZM7.94309 6.7002C7.20774 6.7002 6.599 7.32056 6.71374 8.08595C6.929 9.52188 7.56749 12.1676 9.46536 14.0799C11.4494 16.0789 14.2876 16.9343 15.8259 17.2715C16.6211 17.4459 17.3 16.8158 17.3 16.0387V14.2151C17.3 14.0909 17.2235 13.9796 17.1076 13.935L15.1475 13.1825C15.0949 13.1623 15.0377 13.1573 14.9824 13.1681L13.0048 13.5542C11.7304 12.894 10.958 12.1532 10.4942 11.0387L10.867 9.02365C10.8769 8.97021 10.8721 8.91508 10.8531 8.86416L10.1182 6.89529C10.0744 6.77797 9.96233 6.7002 9.83711 6.7002H7.94309Z"
          fill={color}
        />
      </svg>
      <span style={textStyle}>consúltenos por WhatsApp</span>
    </div>
  );
};

export default IconoConHover;
