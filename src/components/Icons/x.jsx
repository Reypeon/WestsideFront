export default function X({ width = 24, height = 24, color = "#000000", ...props }) {
  return (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <line x1="4.5" y1="4.5" x2="19.5" y2="19.5" stroke={color} strokeWidth="2" />
    <line x1="19.5" y1="4.5" x2="4.5" y2="19.5" stroke={color} strokeWidth="2" />
  </svg>
  );
}
