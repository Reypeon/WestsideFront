import s from "./NavLateral.module.css";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectorNav, closeNav } from "../../../redux/navReducer";

function NavLateral() {
    const dispatch = useDispatch();
    const navRef = useRef(null);
    const isOpenNAV = useSelector(selectorNav);

    // Cerrar al hacer clic fuera
    const handleClickOutside = (e) => {
    if (!navRef.current) return;
    // clic dentro del nav → no cerrar
    if (navRef.current.contains(e.target)) return;
    // clic en el botón toggle → no cerrar que esta en navlinks
    if (e.target.closest('[data-nav-toggle]')) return;
    // cualquier otro clic → cerrar
    dispatch(closeNav());
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isOpenNAV) {
        const scrollY = window.scrollY;
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        root.style.overflow = "hidden";

        // Agregar estado al historial para interceptar "atrás"
        window.history.pushState(null, "", window.location.pathname);

        const handlePopState = () => {
        // Evita retroceder y cierra el nav
        window.history.pushState(null, "", window.location.pathname);
        dispatch(closeNav());
        return;
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
        window.removeEventListener("popstate", handlePopState);
        };
    } else {
        const scrollY = parseInt(body.style.top || "0", 10) * -1;
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        root.style.overflow = "";
        window.scrollTo(0, scrollY);
    }
    }, [isOpenNAV]);



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

        <div ref={navRef} className={s.navLat}
            style={{
                transform: isOpenNAV ? "translateY(0)" : "",
                transition: "transform 0.3s ease-in-out",
                // pointerEvents: isOpenNAV ? "auto" : "none"
            }}
        >
            {/* <button onClick={() => dispatch(closeNav())}>Cerrar</button> */}

        </div>

    );


    // <div ref={navRef} className={s.navContainerLat}>

    {/*
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
                        </div> 
                    </li>
                </ul>


            </div> */}
}

export default NavLateral;


