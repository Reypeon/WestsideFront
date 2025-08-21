import React, { useState, useEffect } from "react";
import { lazy, Suspense } from 'react';
import Select from 'react-select';
import Loader from "../components/shared/loader";
import axios from "axios";
import styles from "./admin.module.css";
import X from '../components/Icons/x'
const Cards = lazy(() => import('../components/FiltroCards/cards/Cards'));

import DelMasivas from "./DelMasivas";
import CrearProductos from "./CrearProductos/CrearProductos";
import ActulizarProductos from './ActulizarProductos/ActulizarProductos';
// import ScanURL from "./ScanURL/ScanURL.jsx"; seccio plan pro no pago esta seccion
import Ordenes from "./Ordenes/getOrdenes.jsx";


const Admin = () => {
  const [categories, setCategories] = useState([]);
  const [productosMasivo, setProductosMasivo] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);

  const [seccionVisible, setSeccionVisible] = useState(null); // null | "crear" | "scraping" | etc.
  const toggleSeccion = (tipo) => {
    setSeccionVisible(prev => (prev === tipo ? null : tipo));
  };
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrlLocal = import.meta.env.VITE_API_URL_LOCAL;

  useEffect(() => {
    const getData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`${apiUrl}/api/getCategorias`),
          axios.get(`${apiUrl}/api/GetAllJsoNScraping`)
        ]);
        console.log(res1);
        
        setCategories(res1.data);
        setProductosMasivo(res2.data);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
      }
    };

    getData();
  }, []);

  //PARA SELECT REACT
  const options = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));
 const customStyles = {
  control: (provided, state) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    fontSize: '2vh',
    minWidth: '25vh',
    borderColor: state.isFocused ? 'var(--colorv1)' : '#ccc',
    boxShadow: state.isFocused ? '0 0 0 1.5px var(--colorv1)' : 'none',
    borderRadius: '6px',
    padding: '2px 4px',
    margin: '0.3rem 0',
    cursor: 'text',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    cursor: 'pointer',
  }),
  menuPortal: base => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'var(--colorv1)' : '#fff',
    color: state.isSelected ? '#333' : '#000',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--colorv1)',
      color: '#000',
    },
  }),
};
console.log(categories);

  return (
    <div className={styles.adminContainer}>
      <section className={styles.cardsAdmin}>
        <div className={styles.boxNavAdmin}>
          <span
            onClick={() => setIsAdmin(prev => !prev)}
            className={styles.btnNavAdmin}
            style={{ cursor: 'pointer', color: isAdmin ? 'green' : 'red' }}>
            {isAdmin ? '🔓 Modo Admin Activado' : '🔒 Modo Admin Desactivado'}
          </span>
          <Select
            id="categoria"
            placeholder="Selecciona categoria"
            value={options.find(opt => opt.value === selectedCategoryId) || null}
            onChange={selectedOption => setSelectedCategoryId(selectedOption?.value || '')}
            options={options}
            styles={customStyles}
              menuPortalTarget={document.body}
                menuPosition="fixed"
          /> 
          <button className={styles.btnNavAdmin} onClick={() => toggleSeccion("CrearProductos")}>Crear producto</button>
          {/* <button className={styles.btnNavAdmin} onClick={() => toggleSeccion("ScanURL")}>Scrapear productos</button> */}
          <button className={styles.btnNavAdmin} onClick={() => toggleSeccion("DelMasivas")}>Elimiar productos</button>
          <button className={styles.btnNavAdmin} onClick={() => toggleSeccion("ActulizarProductos")}>Actualizar productos</button>
          <button className={styles.btnNavAdmin} onClick={() => toggleSeccion("Ordenes")}>Ordenes</button>

          {seccionVisible === "CrearProductos" && (
            <section className={styles.seccionMultiUso}>
              <span className={styles.btnXSeccion} onClick={toggleSeccion}> <X /> </span>
              <CrearProductos
                categories={categories}
                productosMasivo={productosMasivo}
              />
            </section>
          )}

          {/* {seccionVisible === "ScanURL" && (
            <section className={styles.seccionMultiUso}>
              <span className={styles.btnXSeccion} onClick={toggleSeccion}> <X /> </span>
              <ScanURL />
            </section>
          )} */}

          {seccionVisible === "DelMasivas" && (
            <section className={styles.seccionMultiUso}>
              <span className={styles.btnXSeccion} onClick={toggleSeccion}> <X /> </span>
              <DelMasivas categoryIds={selectedCategoryId}/>
            </section>
          )}

          {seccionVisible === "ActulizarProductos" && (
            <section className={styles.seccionMultiUso}>
              <span className={styles.btnXSeccion} onClick={toggleSeccion}> <X /> </span>
              <ActulizarProductos categoryIds={selectedCategoryId}/>
            </section>
          )}

          {seccionVisible === "Ordenes" && (
            <section className={styles.seccionMultiUso}>
              <span className={styles.btnXSeccion} onClick={toggleSeccion}> <X /> </span>
              <Ordenes categoryIds={selectedCategoryId}/>
            </section>
          )}
        </div>
        <Suspense fallback={<Loader />}>
          <Cards filter={selectedCategoryId} isAdmin={isAdmin} />
        </Suspense>
      </section>
    </div>
  );
};

export default Admin;
