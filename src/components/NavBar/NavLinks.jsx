import s from "./NavLinks.module.css";
import NavLateral from "./NavLateral/NavLateral";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import IconoWebp from "../Icons/iconWebP";
import { useCart } from "../CartContext";
import CartIcon from '../Icons/carrito';

// Redux
import { selectorCarrito } from '../../redux/cartReducer';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef, useMemo } from 'react';

function NavLinks() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleCart } = useCart();
  const arrCarrito = useSelector(selectorCarrito);

  // 🎯 Estado para cambiar color del icono
  const [color, setColor] = useState('var(--blanco)');
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
      <span className={s.spanNav}>MAYORISTA DESDE $200.000 🚚</span>
      <span className={s.spanNav}>MAYORISTA DESDE $200.000 🚚</span>
      <div className={s.navLinks}>
        <NavLateral />

        <div className={s.contentBtnNav}>
          <button
            onClick={() => handleNavigateAndScroll('/')}
            className={`${s.btnNav} ${s.ocultarMobile}`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavigateAndScroll('/productos')}
            className={s.btnNav}
          >
            Productos
          </button>
        </div>

        <span
          className={s.logoNav}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <IconoWebp name="Logo" />
        </span>

        <section className={s.boxrigthNAV}>
          <div className={s.buttonboxcart}>
            <CartIcon
              className={s.cartButton}
              color={color} // aplica el color dinámico
              onClick={()=>{
                toggleCart()
              }}
            />
          </div>
        </section>
      </div>
    </nav>
  );
}

export default NavLinks;
