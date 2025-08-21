import React, { useEffect, useState, Suspense, lazy, useRef } from 'react';
import Loeader from '../shared/loader.jsx';
import s from "./home.module.css";
import { Link } from "react-router-dom";
import useSWR from 'swr';
import { useInView } from 'react-intersection-observer';
// Iconos:
import Flecha from "../Icons/flecha.jsx"
import IconoWebp from '../Icons/iconWebP.jsx';

import AnimacionJS from "../shared/AnimacionJS.jsx"
import IconoWebm from '../Icons/iconWebP.jsx';
// import Card from '../FiltroCards/cards/card/Card.jsx';
// IMPORTS CON LAZY
const Model3d = lazy(() => import('../3dcache/model3d.jsx'));
const Card = lazy(() => import('../FiltroCards/cards/card/Card.jsx'));
const fetcher = (url) => fetch(url).then(res => res.json());

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/productos?categoryIds=28`,
    fetcher
  );  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const correctPassword = "admin124.124"; // 🔐 Podés cambiarla por una variable de entorno

  const categories = [
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  // if (!authenticated) {
  //   return (
  //     <div className={s.passwordScreen}>
  //       <form onSubmit={handlePasswordSubmit} className={s.passwordForm}>
  //         <h2>🕵️</h2>
  //         <input
  //           className={s.input}
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           placeholder="Contraseña"
  //         />
  //         <button className={s.button}
  //           type="submit">Entrar</button>
  //       </form>
  //     </div>
  //   );
  // }


  // Animacion del titulo


  const { ref: animRef, inView: animInView } = useInView({
    triggerOnce: true,
    rootMargin: '100px',
  });



  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

  const scroll = (ref, direction) => {
    const amount = direction === "left" ? -300 : 300;
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  }

  return (
    <div className={s.maincontent}>
      <section className={s.BoxPresentacion}>
      <span className={s.Titulo}><IconoWebm name="westsideLogo" /></span>

      </section>





      <section className={s.back3dScroll}>
          {/* <AnimacionJS
            className={s.sectionCategoris}
            scrollRange={[100, 400]}
            yRange={[100, 0]}
            opacityRange={[0, 1]}
          >
            <h4 className={s.h4Categori}>Categorias</h4>
            <ul className={s.scrollFto} ref={scrollRef1}>
              {categories.map((category, index) => (
                <li
                  key={category.idcategory}
                  className={s.acordeon}>
                  <Link to={`/productos?categoryIds=${category.idcategory}`}>
                    <div className={s.icon}>
                      <IconoWebp name={category.iconName} />
                    </div>
                    <div className={s.name}>{category.name}</div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className={s.boxBtnScrolluno}>
              <button className={s.scrollButtonDos} onClick={() => scroll(scrollRef1, "right")}>
                <Flecha
                  color="var(--blanco)"
                  style={{ cursor: "pointer" }}
                />
              </button>
              <button className={s.scrollButton} onClick={() => scroll(scrollRef1, "left")}>
                <Flecha
                  color="var(--blanco)"
                  style={{ transform: "rotate(180deg)", cursor: "pointer" }}
                />
              </button>
            </div>
          </AnimacionJS>
        <Link to="/productos?categoryIds=1" className={s.btnTienda}>
          VER PRODUCTOS
        </Link> 

        <AnimacionJS
            as="section"
            className={s.sectionDestacados}
            scrollRange={[500, 700]}
            yRange={[100, 0]}
            opacityRange={[0, 1]}
            style={{ transformOrigin: "center" }}
          >
          <h5 className={s.titleD}> Productos Destacados</h5>
          <div className={s.scrollD}>
            <div className={s.destacados} ref={scrollRef2} >
              {error && <p>Error loading products. Please try again.</p>}
              {data && !error ? (
                data.map(({ id, model, description, price, stock, categories, images, quantity }) => (
                  <Suspense key={id} fallback={<Loeader />}>
                    <Card
                      enabled= {false}
                      id={id}
                      model={model}
                      description={description}
                      price={price}
                      stock={stock}
                      categoryIds={categories}
                      quantity={quantity}
                      images={images}
                      homeAnimacion={false}
                    />
                  </Suspense>
                ))
              ) : (
               !error && <p>No products found.</p>
              )}
            </div>
          </div>
          <div className={s.boxBtnScroll}>
            <button className={s.scrollButton} onClick={() => scroll(scrollRef2, "left")}>
              <Flecha
                color="var(--blanco)"
                style={{ transform: "rotate(180deg)", cursor: "pointer" }}
              />
            </button>
            <button className={s.scrollButtonDos} onClick={() => scroll(scrollRef2, "right")}>
              <Flecha
                color="var(--blanco)"
                style={{ cursor: "pointer" }}
              />
            </button>
          </div>
          </AnimacionJS> */}
  
        <div className={s.sectionEnvios}>
          <div className={s.boxPoliticas}>
            <div className={s.carBoxPOLITICAS}>
              {/* <h2 className={s.title}>🚚 Política de Entregas</h2>
              <p className={s.intro}>
                En nuestro mayorista de artículos electrónicos trabajamos con una logística
                planificada para ofrecerte<strong>los mejores precios y un servicio eficiente.</strong>
                Por eso implementamos el siguiente sistema de entregas:
              </p>
              <div className={s.BorderLeft}>
                <h3 className={s.PoliticassubT}>📦 Entregas estándar</h3>
                <p>✔️ Durante la <strong>primera semana de cada mes</strong>.</p>
                <p>✔️ <strong>Sin costo adicional</strong>.</p>
              </div>
              <div className={s.BorderLeft}>
                <h3 className={s.PoliticassubT}>⚡ Entregas anticipadas (con recargo)</h3>
                <p>✔️ Disponibles <strong>bajo solicitud</strong>.</p>
                <p>✔️ Costo según <strong>zona y tiempo</strong>.</p>
                <p className={s.importante}>
                  🛎️ <strong>Importante:</strong> los pedidos urgentes se coordinan manualmente.
                </p>
              </div> */}
            </div>


            <div className={s.carBoxPOLITICAS}>
              {/* <h3 className={s.title}>🛒 ¿Cómo hacer un pedido?</h3>
              <p className={s.intro}>Seguí estos pasos para realizar tu pedido de forma fácil y rápida:</p>

              <div className={s.BorderLeft}>
                <ol className={s.pasosPedido}>
                  <li>
                    <strong>1. Ingresá a la tienda:</strong> Explorá nuestro catálogo de productos electrónicos mayoristas.
                  </li>
                  <li>
                    <strong>2. Seleccioná tus productos:</strong> Agregá los artículos que necesitás al <strong>Carrito de Pedidos</strong>.
                  </li>
                  <li>
                    <strong>3. Finalizá tu pedido:</strong> Completá el <strong>formulario de pedido</strong> con tus datos y seleccioná tu método de entrega.
                  </li>
                  <li>
                    <strong>4. Coordinación:</strong> Nos pondremos en contacto para confirmar disponibilidad y fecha de entrega.
                  </li>
                </ol>
              </div> */}
            </div>

            <div className={s.carBoxPOLITICAS}>
              {/* <h3 className={s.title}>💳 Formas de Pago</h3>
              <div className={s.BorderLeft}>
                <p>Ofrecemos distintas opciones para que elijas la más cómoda:</p>
                <br />
                <p>✔️ Podés <strong>pagar en el momento de la entrega</strong>, directamente al repartidor, en <strong>efectivo</strong> o mediante <strong>transferencia bancaria</strong>.</p>
                <br />

                <p>✔️ También podés <strong>pagar por adelantado</strong> al hacer tu pedido, utilizando tus <strong>tarjetas bancarias</strong> a través de nuestras plataformas habilitadas.</p>
                <br />
                <p className={s.importante}>
                  📌 <strong>Importante:</strong> Asegurate de coordinar correctamente la forma de pago al finalizar tu pedido para evitar demoras en la entrega.
                </p>
              </div> */}

            </div>
          </div>
          </div>
                  <AnimacionJS
          className={s.model3d}
          scrollRange={[400, 1150]}
          yRange={[0, 200]}
          style={{ transformOrigin: "center" }}
        >
          <Suspense fallback={<Loeader />}>

            <Model3d variant='lg' />
          </Suspense>
          
        </AnimacionJS>
      

      </section>
    </div>
  );
};

export default Home;
