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
      style={{ ...style, transition: "transform 0.3s ease" }}
      className={className}
    >
      <line x1="30" y1="20" x2="70" y2="50" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="50" x2="30" y2="80" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};

export default FlechaUltraMinimal;
