import s from "./NavLinks.module.css";
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';

import IconoWebp from "../Icons/iconWebP";
import CartIcon from '../Icons/carrito';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectorCarrito } from '../../redux/cartReducer';
import { useCart } from "../CartContext";

import { toggleNav, selectorNav } from "../../redux/navReducer";



function NavLinks() {

  const location = useLocation();
  const navigate = useNavigate();
  //Carrito
  const { toggleCart, isOpen } = useCart();
  const arrCarrito = useSelector(selectorCarrito);
  //NAVlateral
  const isOpenNAV = useSelector(selectorNav); 
  const dispatch = useDispatch();

  const isProductosOrDetail =
  location.pathname === '/productos' ||
  matchPath('/productos/cardDetail/:cardDetailId', location.pathname);
  // 🎯 Estado para cambiar color del icono
  const [color, setColor] = useState('#E7E4E4');
  const prevTotalQuantityRef = useRef(0);

  // ✔️ Calcular la cantidad total de productos
  const totalQuantity = useMemo(() => {
    return arrCarrito.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [arrCarrito]);

  // 🎨 Efecto para cambiar el color del ícono del carrito temporalmente
  useEffect(() => {
    if (totalQuantity > prevTotalQuantityRef.current) {
      setColor('var(--colorlimon)');
    } else if (totalQuantity < prevTotalQuantityRef.current) {
      setColor('red');
    }

    prevTotalQuantityRef.current = totalQuantity;

    const timer = setTimeout(() => {
      setColor('var(--blanco)');
    }, 1000);

    return () => clearTimeout(timer);

  }, [totalQuantity]);

  const handleNavigateAndScroll = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };


  return (
    <nav className={s.containerLinks}>
      <div className={s.navLinks}>

        {/* <div
          className={`${s.btnNav} ${isOpenNAV ? s.activeBtn : ''}`}
          style={{ zIndex: isOpenNAV ? 52 : 'auto' }}
          onClick={() => dispatch(toggleNav())}>
          Alternar Nav
        </div> */}
        <div className={`${s.btnNav} ${isOpenNAV ? s.activeBtn : ''}`} >
          <button className={`${s.btn_toggle} ${isOpenNAV ? s.open : ''}`}
              data-nav-toggle       // 🔹 este atributo es clave

            onClick={() => dispatch(toggleNav())}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <button
          onClick={() => handleNavigateAndScroll('/')}
          className={`${s.btnNav} ${location.pathname === '/' ? s.activeBtn : ''}`}>
          <IconoWebp name="iconInicio" />
        </button>

        <button
          onClick={() => handleNavigateAndScroll('/productos')}
          className={`${s.btnNav} ${isProductosOrDetail ? s.activeBtn : ''}`}>
          <IconoWebp name="iconShop" />
        </button>

        <button
          onClick={() => handleNavigateAndScroll('/search')}
          className={`${s.btnNav} ${isProductosOrDetail ? s.actiaveBtn : ''}`}>
          <IconoWebp name="iconSearch" />
        </button>

        <div className={`${s.btnNav} ${isOpen ? s.activeBtn : ''}`} >
          <CartIcon
            color={color}
            onClick={() => {
              toggleCart()
            }}
          />
        </div>

      </div>
    </nav>
  );
}

export default NavLinks;
