import Loeader from "../shared/loader.jsx";
import sFilter from "./FiltroCards.module.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
// Icons importados
import IconoWebp from '../Icons/iconWebP.jsx';

import Flecha from "../Icons/flecha.jsx"

const Cards = lazy(() => import("./cards/Cards.jsx"));

// Defino la lista fuera del componente para que no se redefine en cada render
const categoriesFilCards = [
  { name: 'Auriculares', iconName: "iconAuris", speed: "1", idcategory: "3" },
  { name: 'Cargadores', iconName: 'iconCable', speed: "0.5", idcategory: "21" },
  { name: 'Cables y Adapradores', iconName: 'iconCargador', speed: "0.5", idcategory: "22" },
  { name: 'Belleza', iconName: 'iconBelleza', speed: "0.5", idcategory: "8" },
  { name: 'Computacion', iconName: 'iconTeclado', speed: "1", idcategory: "9" },
  { name: 'Gamer', iconName: 'iconJoystick', speed: "1", idcategory: "17" },
  { name: 'Relojes', iconName: 'iconSmartWatch', speed: "1", idcategory: "4" },
  { name: 'Camaras', iconName: 'iconCamaras', speed: "1", idcategory: "6" },
  { name: 'Accesorios Celulares', iconName: "iconAccesoriosCelu", speed: "1", idcategory: "5" },
  { name: 'Accesorios TV', iconName: "icontv", speed: "1", idcategory: "23" },
  { name: 'Herramientas y Ferreteria', iconName: 'iconHerramientas', speed: "1", idcategory: "24" },
  { name: 'Iluminacion', iconName: 'iconIluminacion', speed: "0.8", idcategory: "1" },
  { name: 'Hogar', iconName: 'iconHogar', speed: "1", idcategory: "25" },
  { name: 'Auto', iconName: '', speed: "1", idcategory: "18" },
  { name: 'Biclceta y Moto', iconName: '', speed: "1", idcategory: "19" },
  { name: 'Dia del Niño', iconName: '', speed: "1", idcategory: "20" },
  { name: 'Parlantes', iconName: 'iconParlantes', speed: "1", idcategory: "7" },
  // { name: 'Sillas', iconName: '', speed: "1", idcategory: "" },
  // { name: 'Drones', iconName: '', speed: "1", idcategory: "" },
];

function FiltroCards() {

  const [filter, setFilter] = useState("3"); // guardo solo id de categoría
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAcordeonVisible, setIsAcordeonVisible] = useState(true);
  const ignoreNextScroll = useRef(false);

  // const topMarkerRef = useRef(null);

  // Manejo cambio filtro y actualizo URL
  const handlerClick = useCallback((idcategory) => {
    setFilter(idcategory);
    navigate(`/productos?categoryIds=${idcategory}`, { replace: true });
  }, [navigate]);

  // Inicializo filtro desde URL
  useEffect(() => {
    const categoryIds = searchParams.get("categoryIds");
    if (categoryIds) {
      setFilter(categoryIds);
    }
  }, [searchParams]);

  // Manejo el scroll para mostrar/ocultar acordeón

  // 👇 Scroll control con IntersectionObserver
// useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsAcordeonVisible(true);
//         } else {
//           setIsAcordeonVisible(false);
//         }
//       },
//       {
//         root: null,
//         threshold: 0,
//       }
//     );

//     if (topMarkerRef.current) {
//       observer.observe(topMarkerRef.current);
//     }

//     return () => {
//       if (topMarkerRef.current) {
//         observer.unobserve(topMarkerRef.current);
//       }
//     };
//   }, []);
 
useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Si se hizo clic en el botón y aún no queremos ocultarlo
    if (ignoreNextScroll.current) {
      ignoreNextScroll.current = false;
      return;
    }

    // Mostrar acordeón si el usuario está cerca del top
    if (scrollY <= 100) {
      setIsAcordeonVisible(true);
    } else {
      setIsAcordeonVisible(false);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

const handleToggleAcordeon = () => {
  ignoreNextScroll.current = true; // Ignorar el scroll que puede generar el clic
  setIsAcordeonVisible(true);
};
  return (
       <div className={sFilter.filtroContainer}>
      {/* 👇 Elemento invisible para observar scroll */}
      <div style={{ position: "absolute", top: 0, height: 1 }}></div>

      <div
        className={sFilter.clickable}
        style={{
          transform: !isAcordeonVisible ? 'translateY(0)' : 'translateY(-500%)',
        }}
        onClick={handleToggleAcordeon}
      >
        FILTROS
        <Flecha
          width="30"
          height="35"
          color="var(--blanco)"
          style={{ transform: "rotate(-90deg)", cursor: "pointer", scale: '-0.5' }}
        />
      </div>

      <section
        className={sFilter.contenedorAcordeones}
        style={{
          transform: isAcordeonVisible ? 'translateY(0)' : 'translateY(-170%)',
        }}
      >
        {categoriesFilCards.map(({ idcategory, iconName, name, speed }) => (
          <div
            key={idcategory}
            className={`${sFilter.acordeon} ${filter === idcategory ? sFilter.acordeonActivo : ''}`}
            onClick={() => handlerClick(idcategory)}
            aria-pressed={filter === idcategory}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handlerClick(idcategory);
            }}
          >
              <div className={sFilter.icon}>
                <IconoWebp name={iconName} speed={speed} />
              </div>
              <div className={sFilter.name}>{name}</div>
            </div>
          ))}
        </section>

      <Suspense fallback={<Loeader/>}>
        <Cards filter={filter}/>
      </Suspense>
    </div>
  );
}

export default FiltroCards;
