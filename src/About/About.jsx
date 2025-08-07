import styles from './About.module.css';
import { Link } from 'react-router-dom';
// import axios from 'axios';
// import React, { useEffect, useState } from "react";
import IconoWebp from "../components/Icons/iconWebP"
const About = () => {
// const apiUrl = import.meta.env.VITE_API_URL;

// //BUSCAR MEDIOS DE PAGOS
//   const [metodos, setMetodos] = useState([]);
//   useEffect(() => {
//     const fetchMetodos = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/api/metodos-pagos`);
//         localStorage.setItem("metodos", JSON.stringify(res.data));
//         setMetodos(res.data);
//       } catch (err) {
//         console.error("Error al obtener métodos de pago", err);
//       }
//     };
//     fetchMetodos();
//   }, []);
  
//   const creditCards = metodos.filter((m) => m.payment_type_id === "credit_card");
//   const debitCards = metodos.filter((m) => m.payment_type_id === "debit_card");
//   const cashMethods = [
//     ...metodos.filter((m) => m.payment_type_id === "ticket" || m.payment_type_id === "atm"),
//    //AGREGO MANUAL OTRA SECCION
//     {
//       id: "transferencia_manual",
//       name: "Transferencia Bancaria",
//       secure_thumbnail: "/ruta-a-tu-logo-de-transferencia.png", // o null si no tenés logo
//       thumbnail: "/ruta-a-tu-logo-de-transferencia.png",         // opcional
//       payment_type_id: "transfer", // inventado para diferenciar
//     },
// ,
//     // Filtramos Pago Fácil
//   ];
//     const renderMetodo = (m) => (
//     <div key={m.id} className={styles.metodo}>
//       <img  src={m.secure_thumbnail || m.thumbnail} alt={m.name} />
//       <span >{m.name}</span>
//     </div>
//   );
// FIN DE MEDIOS DE PAGOS

  return (
    <div className={styles.aboutContainer}>
      <section className={styles.contentUlabout}>
        <ul className={styles.ulAbout}>
          <li className={styles.li}><Link to="/">Inicio</Link></li>
          <li className={styles.li}><Link to="/productos">Tienda</Link></li>
          <li className={styles.li}><Link to="/">Contacto</Link></li>
          <li className={styles.li}><Link to="/">¿Quiénes Somos?</Link></li>
        </ul>

        <div className={styles.boxLogoAbout}>
          <span className={styles.logoAbout}><IconoWebp name={'LogoDos'}/></span>
        </div>

        <div className={styles.ulAbout}>
          <p>Poner tarjeta de presentacion</p>
        </div>

      </section>
      
      {/* <section className={styles.contenedorHeader}>

        <div className={styles.tarjetasContC}>
          <h2 className={styles.h2Tarjetas}>Tarjetas de Crédito</h2>
          <div className={styles.grid}>
            {creditCards.map(renderMetodo)}
          </div>
        </div>

        <div className={styles.boxDebitoYcash}>

          <div className={styles.tarjetasContD}>
            <h2 className={styles.h2Tarjetas}>Tarjetas de Débito</h2>
            <div className={styles.grid}>
              {debitCards.map(renderMetodo)}
            </div>
          </div>

          <div className={styles.tarjetasContE}>
            <h2 className={styles.h2Tarjetas}>Pagos en Efectivo</h2>
            <div className={styles.grid}>
              {cashMethods.map(renderMetodo)}
               <div >Transferencias bancarias</div>
            </div>
          </div>

        </div>

      </section> */}
    </div>
  );
};

export default About;




























