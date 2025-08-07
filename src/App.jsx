import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';
import Loader from './components/shared/loader.jsx';
import ScrollRestoration from "./ScrollRestoration.jsx";
import Wapp from "./components/Icons/wapp.jsx";
import s from './main.module.css';

const Home = lazy(() => import("./components/Home/Home"));
const About = lazy(() => import("./About/About"));
const NavLinks = lazy(() => import("./components/NavBar/NavLinks"));
const FiltroCards = lazy(() => import("./components/FiltroCards/FilttroCards"));
const DetailCard = lazy(() => import("./components/FiltroCards/cards/card/detail/Detail"));
const Admin = lazy(() => import("./admin/admin"));
const CheckoutForm = lazy(() => import("./components/check/CheckoutForm"));
const QuieneSomos = lazy(() => import("./components/QuieneSomos/QuieneSomos"));
const Carrito = lazy(() => import("./components/Carrito/Carrito"));

function App() {
  const apibase = import.meta.env.VITE_API_URL_BaseD;
  const videoRef = useRef(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');


  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <div className={s.headerApp} translate="no">
      <video
        ref={videoRef}
        className={s.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={`${apibase}/videos/0c526359-63cc-4d18-9f01-0a2e983d1c65.mp4`} type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>

      <Suspense fallback={<Loader />}>
        <NavLinks />
        <ScrollRestoration/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/productos' element={<FiltroCards />} />
          <Route path='/productos/cardDetail/:cardDetailId' element={<DetailCard />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/checkout' element={<CheckoutForm />} />
          <Route path='/QuieneSomos' element={<QuieneSomos />} />
        </Routes>
        <Carrito />
        <About />
      </Suspense>


      <div className={s.widgetWrapper}>
        <a
          href="https://wa.me/+5492804863694?text=Hola!%20Estoy%20interesad@%20en%20sus%20productos"
          target="_blank"
          rel="noopener noreferrer"
          className={s.whatsappButton}
        >
          <Wapp className={s.whatsappButton} />
        </a>
      </div>
    </div>
  );
}

export default App;
