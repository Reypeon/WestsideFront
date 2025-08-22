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

  const VITE_API_URL_BaseD = import.meta.env.VITE_API_URL_BaseD
  console.log(VITE_API_URL_BaseD);
  
  const categories = [
  { name: 'Auriculares', iconName: "iconAuris", speed: "1", idcategory: "1" },
  { name: 'Cargadores', iconName: 'iconCable', speed: "0.5", idcategory: "21" },
  { name: 'Cables y Adapradores', iconName: 'iconCargador', speed: "0.5", idcategory: "22" },
    { name: 'Auriculares', iconName: "iconAuris", speed: "1", idcategory: "3" },
  { name: 'Cargadores', iconName: 'iconCable', speed: "0.5", idcategory: "21" },
  { name: 'Cables y Adapradores', iconName: 'iconCargador', speed: "0.5", idcategory: "22" },
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
        <div className={s.boxMural}>
            <img
            src={VITE_API_URL_BaseD + "/media/mural.jpg"}
            alt="Fondo"
            className={s.mural}
          />
          <span className={s.Titulo}>
            <IconoWebm name="logopng" style={{ width: "300px", height: "auto" }} />
          </span>

        </div>

        <div className={s.imgFondo}>
          <img
            src={VITE_API_URL_BaseD + "/media/FondoMobile.jpg"}
            alt="Fondo"
            className={s.imgBackground}
          />

        </div>
      </section>








      <AnimacionJS className={s.boxCategorias}
        scrollRange={['0%', "38%"]}
        yRange={["0%", "-100%"]}
      >
         <section className={s.sectionCategoris}>
          {/* <div className={s.boxtrivales}>
            <IconoWebm name="trival2"
              className={s.trival2} />
            <IconoWebm name="trival"
              className={s.trival} />
           </div> */}

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

          </section> 
      </AnimacionJS>


        {/* // <Link to="/productos?categoryIds=1" className={s.btnTienda}>
        //   VER PRODUCTOS
        // </Link>  */}

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
          </AnimacionJS> 
  
        {/* <div className={s.sectionEnvios}>
          <div className={s.boxPoliticas}>
            <div className={s.carBoxPOLITICAS}>
 
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
              </div> 
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
              </div> 

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
          
        </AnimacionJS> */}
      

    </div>
  );
};

export default Home;
