import Loeader from "../shared/loader.jsx";
import sFilter from "./FiltroCards.module.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
// Icons importados
import IconoWebp from '../Icons/iconWebP.jsx';

import Flecha from "../Icons/flecha.jsx"
import { transform } from "lodash";

const Cards = lazy(() => import("./cards/Cards.jsx"));

// Defino la lista fuera del componente para que no se redefine en cada render
const categoriesFilCards = [
  { name: 'NHL', iconName: "tupacFitler", speed: "1", idcategory: "1" },
  { name: 'NLB', iconName: 'iconNFL', speed: "0.5", idcategory: "2" },
  { name: 'CAPS', iconName: "iconAuris", speed: "1", idcategory: "3" },
  { name: 'NFL', iconName: 'iconCargador', speed: "0.5", idcategory: "4" },
];


function FiltroCards() {

  const [filter, setFilter] = useState("1"); // guardo solo id de categoría
  const [nameFilter, setNameFilter] = useState("");
  const [order, setOrder] = useState("relevancia");
  const [orderTemp, setOrderTemp] = useState(order);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAcordeonVisible, setIsAcordeonVisible] = useState(false);
  const [showOrderOptions, setShowOrderOptions] = useState(false); // nuevo estado para mostrar radios

  // Aplicar cambios (filtro + orden) → actualiza la URL


  // Manejo cambio filtro y actualizo URL
  const handlerClick = useCallback((idcategory) => {
    setFilter(idcategory);
    navigate(`/productos?categoryIds=${idcategory}`, { replace: true });
  }, [navigate]);

  // Inicializo filtro desde URL
  useEffect(() => {
    const categoryIds = searchParams.get("categoryIds");
    const orderQuery = searchParams.get("order");

    if (categoryIds) setFilter(categoryIds);
    if (orderQuery) setOrder(orderQuery);

    const categoria = categoriesFilCards.find(
      (cat) => cat.idcategory === (categoryIds || filter)
    );
    setNameFilter(categoria ? categoria.name : "");
  }, [searchParams, filter]);

useEffect(() => {
  if (isAcordeonVisible) {
    setOrderTemp(order);
  }
}, [isAcordeonVisible, order]);


  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isAcordeonVisible) {
      const scrollY = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      root.style.overflow = "hidden";
    } else {
      const scrollY = parseInt(body.style.top || "0", 10) * -1;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      root.style.overflow = "";
      window.scrollTo(0, scrollY);
    }
  }, [isAcordeonVisible]);


  return (
    <div className={sFilter.filtroContainer}>
      <span className={sFilter.logoFilter}><IconoWebp name={'westsideLogo'} /></span>
      <div className={sFilter.filtroHeader}>
        <h1 className={sFilter.nameFilter} onClick={() => setIsAcordeonVisible(prev => !prev)}>
          {nameFilter}
          <Flecha
            style={{
              transform: `rotate(${isAcordeonVisible ? 270 : 90}deg) scale(0.45)`,
              margin: 0,
              transition: "transform 0.4s ease"
            }}
          />
        </h1>
        <div
          className={`${sFilter.clickable} ${isAcordeonVisible ? sFilter.active : sFilter.inactive}`}
          onClick={() => setIsAcordeonVisible(prev => !prev)}
        >
          {isAcordeonVisible ? (
            <IconoWebp name="iconXgrafiti" style={{ transform: "scale(0.5)" }} className={`${sFilter.icon} ${sFilter.activeIcon}`} />
          ) : (
            <IconoWebp name="iconAjustesFilter" style={{ transform: "scale(0.45)" }}  className={`${sFilter.icon} ${sFilter.inactiveIcon}`} />
          )}
        </div>
        {isAcordeonVisible && (
          <div className={sFilter.boxFiltrosAjustes}>
            <h2 className={sFilter.h2filtrar}>FILTRAR</h2>

            {/* Categorías */}
            <section className={sFilter.contenedorAcordeones}>
              {categoriesFilCards.map(({ idcategory, iconName, name, speed }) => (
                <div
                  key={idcategory}
                  className={sFilter.acordeon}
                  onClick={() => handlerClick(idcategory)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={`${sFilter.icon} ${filter === idcategory ? sFilter.iconActivo : ''}`}>
                    <IconoWebp name={iconName} speed={speed}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                  <div className={`${sFilter.name} ${filter === idcategory ? sFilter.nameActivo : ''}`}>{name}</div>
                </div>
              ))}
            </section>

            {/* Botón para mostrar radios de ordenar */}
            <button className={sFilter.boxMostrarOrden}
              onClick={() => setShowOrderOptions(prev => !prev)}>
              <span className={sFilter.btnMostrarItems}>Clasificar</span>
              <Flecha
                style={{
                  transform: `rotate(${showOrderOptions ? 270 : 90}deg) scale(0.45)`,
                  margin: 0,
                  transition: "transform 0.4s ease"
                }}
              />
            </button>

            {/* Radios solo se muestran si showOrderOptions es true */}
            {showOrderOptions && (
              <div className={sFilter.radioGroup}>
                <label className={sFilter.radioOption}>
                  <input
                    type="radio"
                    name="order"
                    value="relevancia"
                    checked={orderTemp === "relevancia"}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                  Más relevantes
                </label>

                <label className={sFilter.radioOption}>
                  <input
                    type="radio"
                    name="order"
                    value="precio-asc"
                    checked={orderTemp === "precio-asc"}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                  Precio: Menor a mayor
                </label>

                <label className={sFilter.radioOption}>
                  <input
                    type="radio"
                    name="order"
                    value="precio-desc"
                    checked={orderTemp === "precio-desc"}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                  Precio: Mayor a menor
                </label>
              </div>
            )}
            <div className={sFilter.BoxbtnAplicar}>

              <button
                onClick={() => {
                  setOrder("relevancia");
                  setOrderTemp("relevancia");
                }}
                className={sFilter.btnReset}
              >
                Reset
              </button>
              <button
                onClick={() => setOrder(orderTemp)}
                className={sFilter.btnAplicar}
              >
                Aplicar cambios
              </button>
            </div>

          </div>
        )}
      </div>

      <Suspense fallback={<Loeader />}>
        <Cards filter={filter} nameFilter={nameFilter} order={order} />
      </Suspense>
    </div>
  );
}

export default FiltroCards;
