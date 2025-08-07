import { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import sCard from './carrito.module.css';
// ICONS
import X from '../Icons/x.jsx';
import Tacho from '../Icons/tacho.jsx'
//
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, selectorCarrito, updateCartItemQuantity } from "../../redux/cartReducer.js";
import { useCart } from '../CartContext.jsx';

function Carrito() {
  const { isOpen, closeCart, boxCarritoGlobal } = useCart();

  const dispatch = useDispatch();
  const arrCarrito = useSelector(selectorCarrito);
  const cartRef = useRef(null);
  const apibase = import.meta.env.VITE_API_URL_BaseD;

  const totalmoni = useMemo(() =>
    arrCarrito.reduce((acc, { price, quantity }) =>
      acc + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity), 0
    ).toLocaleString('es-AR'),
    [arrCarrito]
  );

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateCartItemQuantity({ id, quantity }));
  };

  // ✔️ Solo UNA función handleClickOutside que usa closeCart del contexto
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        closeCart();
      }
    };
    document.addEventListener('click', handleClickOutside, true);

  }, [closeCart]);


  return (

    <div
      ref={cartRef}
      // className={sCard.cartsidebar}
      //activamos modo global con boxCarritoGlobal 
       className={`${sCard.cartsidebar} ${boxCarritoGlobal ? sCard.globalCarrito : ''}`}
      style={!boxCarritoGlobal && isOpen ? { transform: 'translateX(0)' } : {}}
    >
      <div className={sCard.carritoTitle}>
        <br />
        <span>{`${boxCarritoGlobal ? "PRODUCTOS DE TU PEDIDO" : "CARRITO DE PEDIDO"}`}</span>
        <span className={sCard.xCarrito} onClick={closeCart}><X color='var(--blanco)' /></span>
      </div>

      {!arrCarrito?.length ? (
        <p className={sCard.carritovacio}>El carrito está vacío. La tienda te espera</p>
      ) : (
        <>
          <div className={sCard.productsContainer}>
            {arrCarrito.map((producto) => {
              const imageUrl = producto.images?.[0]?.url ? `${apibase}/media/${producto.images[0].url}` : "";
              return (
                <article key={producto.id} className={sCard.boxcartCarrito}>
                  {imageUrl ? (
                    <Link
                      className={sCard.linkImgCarrito}
                      onClick={closeCart}
                      to={`/productos/cardDetail/${producto.id}`}
                      state={{ producto }}
                    >
                      <img
                        className={sCard.imgCarrito}
                        src={imageUrl}
                        alt={producto.model || "Imagen del producto"}
                      />
                    </Link>
                  ) : (
                    <div className={sCard.imgCarrito}>Imagen no disponible</div>
                  )}

                  <div className={sCard.boxDetailCAR}>
                    <div className={sCard.modelbox}>
                      <h1 className={sCard.modelCarrito}>{producto.model}</h1>
                      <div className={sCard.xCard} onClick={() => handleRemoveFromCart(producto.id)}>
                        <Tacho width={"35"} />
                      </div>
                    </div>

                    {/* TEXTO DE VENTA ESCRIBIR */}
                    <span className={sCard.spanCarrito}></span>

                    <div className={sCard.cont}>
                      <div className={sCard.quantityBox}>
                        <div className={sCard.quantityContainer}>
                          <button
                            className={sCard.decrementButton}
                            onClick={() =>
                              handleQuantityChange(producto.id, producto.quantity > 1 ? producto.quantity - 1 : 1)
                            }
                          >
                            -
                          </button>
                          <span className={sCard.quantity}>{producto.quantity || 1}</span>
                          <button
                            className={sCard.incrementButton}
                            onClick={() => handleQuantityChange(producto.id, producto.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className={sCard.priceCarrito}>
                        ${(producto.price * producto.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <div className={sCard.containerCompra}>
        <span className={sCard.envioFree}>
          {Number(totalmoni.replace(/\./g, '')) >= 50000
            ? <>¡Genial! Tenés un pedido mayorista</>
            : <>Estás a ${(50000 - Number(totalmoni.replace(/\./g, ''))).toLocaleString('es-AR')} de obtener tu pedido mayorista.</>}
        </span>
        <div className={sCard.boxSubtotal}>
          <h3 className={sCard.h4subtotal}>
            TOTAL:
            <span className={Number(totalmoni.replace(/\./g, '')) >= 99000 ? sCard.tachado : ''}>
              {/* &nbsp;(sin envío) */}
            </span>
          </h3>
          <div className={sCard.subtotal}>{"$" + totalmoni}</div>
        </div>

        <Link to="./checkout" className={sCard.checkout}>
          <div
            style={boxCarritoGlobal ? { display: 'none' } : {}}
            onClick={closeCart}>
            INICIAR PEDIDO
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Carrito;
