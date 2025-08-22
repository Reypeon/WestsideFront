import { useCallback } from "react";
import s from "./card.module.css";
import CartIcon from '../../../Icons/carrito.jsx';
import Tacho from '../../../Icons/tacho.jsx'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectorCarrito, addToCart, updateCartItemQuantity } from "../../../../redux/cartReducer.js";
import AnimacionCard from "./AnimacionCard.jsx";

function Card({
  id,
  model,
  modelUser,
  description,
  price,
  stock,
  quantity,
  images,
  isAdmin = false,
  homeAnimacion = true,
  onDelete,
  onDeleteCate,
  nameFilter = ''
}) {


  const carritoState = useSelector(selectorCarrito);
  const dispatch = useDispatch();
  const apibase = import.meta.env.VITE_API_URL_BaseD;

  const isInCart = carritoState.some(item => item.id === id);

  const handleAddToCart = useCallback(() => {
    const productoExistente = carritoState.find((item) => item.id === id);
    if (productoExistente) {
      dispatch(updateCartItemQuantity({ id, quantity: productoExistente.quantity + 1 }));
    } else {
      dispatch(addToCart({ id, model, description, price, stock, quantity, images }));
    }
  }, [carritoState, dispatch, id, model, description, price, stock, quantity, images]);

  return (
    <AnimacionCard
      key={id}
      as="div"
      enabled={homeAnimacion ? true : false}
      className={s.cardSection}
    >
      {isAdmin && onDelete && onDeleteCate && (
        <div className={s.BoxBtnDelete} >
          <span className={s.idcard}>ID:{id}</span>
          <button
            type="button"
            onClick={onDelete}
            style={{ marginLeft: '1rem', color: 'crimson', minHeight: '1rem', cursor: 'pointer' }}
            className={s.btnDelet}>
            <Tacho/>
          </button>
          <button
            type="button"
            onClick={onDeleteCate}
            style={{ marginLeft: '1rem', color: 'crimson', minHeight: '1rem', cursor: 'pointer' }}
            className={s.btnDelet2}>
            <Tacho/> 
          </button>
        </div>
      )}
      
      <span className={s.boxCardCarritosvg}>
        <CartIcon
          className={s.cardCarritosvg}
          color={isInCart ? "#CEFF02" : "#000000"}
          onClick={handleAddToCart}
          role="button"
          tabIndex={0}
          aria-label="Agregar al carrito"
          style={{ cursor: "pointer" }}
        />
      </span>


      <Link className={s.imgliink} to={`/productos/cardDetail/${id}`} state={{ id }} >
        {images && images.length > 0 ? (
          <img
            className={s.cardImg}
            src={images[0].urlWEBP}
            alt={images[0].alt || 'Imagen del producto'}
          />
        ) : (
          <p>No contiene imágenes</p>
        )}
      </Link>

      <div className={s.cardObj} >
        <span className={s.categoriName}>{nameFilter}</span>
        <h1 className={s.cardModel}>{model} </h1>
        <div className={s.fila}>
          <span className={s.cardPriceAntes}>
            ${Math.round(price * (1 + (Math.random() * (0.40 - 0.05) + 0.05)))
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </span>
          <span className={s.cardPrice}>
            ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </span>
        </div>

      </div>
    </AnimacionCard>
  );
}

export default Card;
