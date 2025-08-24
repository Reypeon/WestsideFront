import s from "./Detail.module.css";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "./ImageCarousel.jsx";
import Card from "../Card.jsx"
import useSWR from 'swr';
import { useMemo } from 'react';
// TIENDA REDUX
import { useSelector, useDispatch } from 'react-redux';
import { selectorCarrito, updateCartItemQuantity, addToCart } from "../../../../../redux/cartReducer.js";

/* ICONOS SVG */
import May from "../../../../Icons/may.jsx"
import Cart from "../../../../Icons/carrito.jsx"
import X from "../../../../Icons/x.jsx"
import Flecha from "../../../../Icons/flecha.jsx"


const fetcher = (url) => fetch(url).then(res => res.json());

function DetailCard() {
  const dispatch = useDispatch();
  const carritoState = useSelector(selectorCarrito);
  const location = useLocation();
  const { cardDetailId } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [character, setCharacter] = useState({});
  const [quantity, setQuantity] = useState(1);
  const productostate = location.state?.producto;
  const images = character?.images;
console.log(productostate);

  const getProductQuantityFromCart = (productId) => {
    const productInCart = carritoState.find((item) => item.id === productId);
    return productInCart ? productInCart.quantity : 1;
  };

  useEffect(() => {
    if (character.id) {
      const syncedQuantity = getProductQuantityFromCart(character.id);
      setQuantity(syncedQuantity);
    }
  }, [carritoState, character.id]);

  useEffect(() => {
    if (productostate) {
      setCharacter(productostate);
      setQuantity(getProductQuantityFromCart(productostate.id));
    } else {
      axios(`${apiUrl}/api/products/detail/${cardDetailId}`)
      
        .then(({ data }) => {
          if (data) {
            setCharacter(data);
            setQuantity(getProductQuantityFromCart(data.id));
          } else {
            window.alert("Este producto no tiene detalles para ver");
          }
        })
        .catch((error) => {
          window.alert("Error al cargar detalles del producto:", error);
        });
    }

    return () => setCharacter({});
  }, [cardDetailId, productostate]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      dispatch(updateCartItemQuantity({ id: character.id, quantity: newQuantity }));
    }
  };

  const handleAddToCart = () => {
    if (quantity <= 0) return window.alert("La cantidad debe ser mayor a 0.");

    const existingProduct = carritoState.find(item => item.id === character.id);
    if (existingProduct) {
      handleQuantityChange(quantity + 1);
    } else {
      dispatch(addToCart({ ...character, quantity }));
    }
  };

  // PAGOS DETALLE
  const [isExpanded, setIsExpanded] = useState(false);
  const [stateFcha, setStateFcha] = useState({ status: true, characterProp: {} });

  const toggleDetails = () => setIsExpanded(prev => !prev);

  const toggleDetail = (prop) => {
    if (prop === false) {
      setStateFcha({ status: false, characterProp: character });
    } else {
      setStateFcha({ status: true, characterProp: character.price });
    }
  };

  const textH4 = "Superando los $195.000 tenés tu pedido mayorista.";
  const scrollRef2 = useRef(null);

  const scroll = (ref, direction) => {
    const amount = direction === "left" ? -300 : 300;
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // PRODUCTOS RELACIONADOS
  const catActualDetail = productostate?.categoryIds?.[0]?.id || character?.categories?.[0]?.id;

  const { data, error, isLoading } = useSWR(
    catActualDetail ? `${apiUrl}/api/productos?categoryIds=${catActualDetail}` : null,
    fetcher
  );
  const relacionados = useMemo(() => {
    if (!data || data.length === 0) return [];
    const mezclados = [...data].sort(() => 0.5 - Math.random());
    return mezclados.slice(0, 8);
  }, [data]);

// MOSTRAR EL SCROLL EN TOP CUANDO ABREN LA SECCION DE POLITICAS
useEffect(() => {
  if (isExpanded) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  
}, [isExpanded]);
console.log(images);

  return (
    <div className={s.detallesContainer}>
      <div className={s.detallesCard}>
        <section className={s.imgContainer}>
          <ImageCarousel images={images} />
        </section>

        <section className={s.sectionCard}>
          <h1 className={s.modelDetail}>{character.model}</h1>
          <span className={s.priceDetail}>
            {new Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(character.price)}
          </span>

          <div className={s.BoxspanEnvio}>
            <span className={s.icono} aria-hidden="true">
               <May/>
            </span>
            <h4 className={s.spanEnvio}>
             
              {textH4.split("").map((char, i) => (
                <span
                  key={i}
                  className={s.char}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h4>
          </div>


          <div className={s.carritoDiv}>
            <div className={s.quantityContainer}>
              <button
                className={s.decrementButton}
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                -
              </button>
              <span className={s.quantity}>{quantity}</span>
              <button
                className={s.incrementButton}
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
              <div className={s.iconCart} onClick={handleAddToCart} aria-hidden="true">
                <Cart />
              </div>
          </div>

          <ul className={s.detailsPagos}>
          <div className={s.fichaT} onClick={() => { toggleDetails(); toggleDetail(false, character); }}>
            <h4 className={s.fichaTh3}>VER FICHA TECNICA</h4>
          </div>
            <li className={s.pagosDetail}>
              ¿Necesitás Ayuda?
            </li>
            <li className={s.extraContent}>
              <p className={s.extra}>Atención directa por <strong>WhatsApp, llamada o email.</strong> </p>
              <p className={s.extra}>Podés solicitar la visita de un<strong>  asesor a tu local </strong>(Trelew y alrededores).</p>
              <p className={s.extra}>Emitimos Factura C.</p>

              <button
                className={s.buttonPagos}
                onClick={() => {
                  toggleDetails();
                  toggleDetail(true);
                }}
              >
               GUIA DE PEDIDOS
              </button>
            </li>

            <li className={s.boxRedes}>
         {/* <span className={s.iconTxt}>Nuestras Redes Sociales</span> */}
                {/* <FaFacebook className={s.detailIcon} aria-hidden="true"></FaFacebook> */}
                {/* <IoLogoInstagram className={s.detailIcon} aria-hidden="true"></IoLogoInstagram>  */}
            </li>  
            
          </ul>      
        </section>
      </div>
      {isExpanded && (
        <span className={s.xBoxPoliticas} onClick={toggleDetails}>
          <X width={'2rem'} height={'2rem'} color={'#ffffff'} />
        </span>
      )}
      <div className={`${s.BoxPoliticas} ${!isExpanded ? s.BoxPoliticasNull : ""}`}>
        <p className={s.scrollHint}>
          Deslizá <span className={s.flechaAnimada}><Flecha height={'1.2rem'} width={'2rem'} color={"var(--colorv1)"} /></span> para explorar las 3 secciones
        </p>
        <section className={s.Politicas}>
          <div className={s.CardsPOLITICAS}>
            <h2 className={s.title}>🚚 Política de Entregas</h2>
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
              </div>
            </div>


            <div className={s.CardsPOLITICAS}>
              <h3 className={s.title}>🛒 ¿Cómo hacer un pedido?</h3>
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

            <div className={s.CardsPOLITICAS}>
              <h3 className={s.title}>💳 Formas de Pago</h3>
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

          </section>

      </div>



      <div className={s.masProductos}>
            <h1 className={s.titleProductosR}>Productos Relacionados</h1>
            <div className={s.destacados} ref={scrollRef2}>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading products. Please try again.</p>}
            {relacionados != undefined && Array.isArray(relacionados) && !isLoading && !error ? (
              relacionados.map(({ id, model, description, price, stock, categories, images, quantity }) => (
                <Card
                  key={id}
                  id={id}
                  model={model}
                  description={description}
                  price={price}
                  stock={stock}
                  categoryIds={categories}
                  quantity={quantity}
                  images={images}
                /> 
              ))
            ) : (
              !isLoading && !error && <p>Estamos trabajando 🪏.</p>
            )}
          </div>
              <div className={s.boxBtnScroll}>
                <button className={s.scrollButton} onClick={() => scroll(scrollRef2, "left")}>
                  <Flecha
                    color="var(--negro)"
                    style={{ transform: "rotate(180deg)", cursor: "pointer"}}
                  />
                </button>
                <button className={s.scrollButtonDos} onClick={() => scroll(scrollRef2, "right")}>
                  <Flecha
                    color="var(--negro)"
                    style={{ cursor: "pointer"}}
                  />
                </button>
              </div>
      </div>

    </div>
  );
}

export default DetailCard;
