import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./NavLateral.module.css";

function NavLateral() {
    const [evento, setEvento] = useState(false);
    const navRef = useRef(null);

    const handlerClick = () => {
        setEvento(!evento);
    };

    // Cerrar al hacer clic fuera
    const handleClickOutside = (e) => {
        if (navRef.current && !navRef.current.contains(e.target)) {
            setEvento(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigateAndScroll = (path) => {
        if (location.pathname === path) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } else {
            navigate(path);
        }
    };


    return (
        <div ref={navRef} className={s.navContainerLat}>
            <div
                className={`${s.btn_toggle} ${evento ? s.open : ''}`}
                onClick={handlerClick}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className={`${s.navLat} ${!evento ? s.cerrar : ''}`}

            >
                <ul className={s.contentUl}>
                    <span
                        className={s.logoLateral}
                        onClick={() => {
                            navigate('/');
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Milux
                    </span>

                    <li>
                        <button className={s.iconLateral} onClick={() => { handleNavigateAndScroll('/'); setEvento(false) }}>
                            INICIO
                        </button>
                    </li>
                    <li>
                        <button className={s.iconLateral} onClick={() => { handleNavigateAndScroll('/productos'); setEvento(false) }
                        }>
                            PRODUCTOS
                        </button>
                    </li>
                    <li>
                        <button className={s.iconLateral} onClick={() => { handleNavigateAndScroll('/quienesomos'); setEvento(false) }}>
                            ¿QUIENES SOMOS?
                        </button>
                    </li>
                    <li>
                        <h2 className={s.h2Redesnav}>NUESTRAS REDES SOCIALES...</h2>
                        {/* <div className="boxRedesNAV">
                            <FaFacebook className={"redesNav"}></FaFacebook>
                            <IoLogoInstagram className={"redesNav"}></IoLogoInstagram>
                            <IoLogoInstagram className={"redesNav"}></IoLogoInstagram>
                        </div> */}
                    </li>
                </ul>


            </div>
        </div>
    );
}

export default NavLateral;


