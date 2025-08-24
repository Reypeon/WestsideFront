const FlechaUltraMinimal = ({
  width = 64,
  height = 64,
  color = "#000000",
  style = {},
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...style }}
      className={className}
    >
      {/* Cuerpo recto (estilo original) */}
      <line x1="28" y1="20" x2="72" y2="50" stroke={color} strokeWidth="8" strokeLinecap="square" />
      <line x1="72" y1="50" x2="28" y2="80" stroke={color} strokeWidth="8" strokeLinecap="square" />

      {/* Punta afilada (toque chicano) */}
      <polygon points="68,44 92,50 68,56" fill={color} />

      {/* Tribals laterales - superiores */}
      <polygon points="34,24 44,28 36,34" fill={color} />
      <polygon points="48,32 58,36 50,42" fill={color} />

      {/* Tribals laterales - inferiores */}
      <polygon points="36,66 44,72 34,76" fill={color} />
      <polygon points="50,58 58,64 48,68" fill={color} />
    </svg>
  );
};

export default FlechaUltraMinimal;
