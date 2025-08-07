import { useState, useEffect, useRef } from 'react';

const apibase = import.meta.env.VITE_API_URL_BaseD;
const modelUrl = `${apibase}/glb/ab42f8c9-62d9-486d-bb60-9d9b65576ca7.glb`;

const variantSettings = (variant, isMobile) => {
  const positions = {
    xs: isMobile ? [0, -0.2, 1.1] : [0, -0.2, 1.2],
    sm: isMobile ? [0, -0.3, 1.3] : [0, -0.3, 1.4],
    md: isMobile ? [0, 0, 1.4] : [0, 0, 1.5],
    lg: isMobile ? [0, 0, 0.5] : [0, 0, 0.5],
  };

  const heights = {
    xs: isMobile ? '12vh' : '15vh',
    sm: isMobile ? '20vh' : '22vh',
    md: isMobile ? '35vh' : '45vh',
    lg: isMobile ? '50vh' : '60vh',
  };

  const toCameraOrbit = ([x, y, z]) => {
    const radius = Math.sqrt(x * x + y * y + z * z);
    if (radius === 0) return '0deg 90deg 2m';
    const theta = Math.atan2(x, z);
    const phi = Math.acos(y / radius);
    const thetaDeg = (theta * 180) / Math.PI;
    const phiDeg = (phi * 180) / Math.PI;
    return {
      thetaDeg,
      phiDeg,
      radius,
      orbitString: `${thetaDeg.toFixed(1)}deg ${phiDeg.toFixed(1)}deg ${radius.toFixed(2)}m`,
    };
  };

  const orbitData = toCameraOrbit(positions[variant] || positions.md);

  return {
    height: heights[variant] || heights.md,
    orbitData,
  };
};

const Model3d = ({
  variant = 'md',
  enableControl = true,
  overrideCameraOrbit = null,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const viewerRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { height, orbitData } = variantSettings(variant, isMobile);
  const finalOrbit = overrideCameraOrbit || orbitData.orbitString;

  // Rotación automática personalizada
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    let angle = orbitData.thetaDeg;
    const phi = orbitData.phiDeg;
    const radius = orbitData.radius;
    const speed = 0.8;
    let frameId;

    const rotate = () => {
      angle = (angle + speed) % 360;
      viewer.cameraOrbit = `${angle.toFixed(1)}deg ${phi.toFixed(1)}deg ${radius.toFixed(2)}m`;
      frameId = requestAnimationFrame(rotate);
    };

    viewer.addEventListener('load', rotate);
    return () => cancelAnimationFrame(frameId);
  }, [orbitData]);

  return (
    <model-viewer
      ref={viewerRef}
      src={modelUrl}
      alt="Modelo JBL 3D"
      camera-controls={enableControl}
      interaction-prompt="none"
      loading="lazy"
      camera-orbit={finalOrbit}
      reveal="auto"
      style={{
        display: 'flex',
        width: '100%',
        height,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        border: 'none',
        margin: '0',
        pointerEvents: 'none',
      }}
      exposure="0.03"
      shadow-intensity="0.5"
    />
  );
};

export default Model3d;
