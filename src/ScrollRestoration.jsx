import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const { pathname } = useLocation();

  // Rutas donde siempre se fuerza el scroll al top
  const rutasForzadasAlTop = [''];

  useEffect(() => {
    const storageKey = `scroll-position-${pathname}`;
    const visitedKey = `visited-${pathname}`;
    const forzarScrollTop = rutasForzadasAlTop.some((ruta) =>
      pathname.startsWith(ruta)
    );

    // Intenta recuperar la posición guardada
    let savedPosition = 0;
    try {
      savedPosition = JSON.parse(sessionStorage.getItem(storageKey)) || 0;
    } catch (e) {
      savedPosition = 0;
    }

    if (forzarScrollTop) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      const alreadyVisited = sessionStorage.getItem(visitedKey);
      if (alreadyVisited && savedPosition) {
        window.scrollTo({ top: savedPosition, behavior: 'auto' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        sessionStorage.setItem(visitedKey, 'true');
      }
    }

    // Guarda scroll antes de salir o cambiar de ruta
    const saveScrollPosition = () => {
      sessionStorage.setItem(storageKey, JSON.stringify(window.scrollY));
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    window.addEventListener('popstate', saveScrollPosition); // Para back/forward

    return () => {
      saveScrollPosition();
      window.removeEventListener('beforeunload', saveScrollPosition);
      window.removeEventListener('popstate', saveScrollPosition);
    };
  }, [pathname]);

  return null;
};

export default ScrollRestoration;
