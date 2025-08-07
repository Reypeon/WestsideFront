import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CrearProductos.module.css";
import Select from "react-select";
const CrearProductos = ({ categories, GetAllJsoNScraping }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectJSON, setSelecJSON] = useState("");
  const [products, setProducts] = useState([]);

  const [status, setStatus] = useState({
    CrearProducts: { loading: false, mensaje: '' },
    eliminar: { loading: false, mensaje: '' },
  });
  const toggleStatus = (seccion, { loading = false, mensaje = '' } = {}) => {
    setStatus(prev => ({
      ...prev,
      [seccion]: { loading, mensaje }
    }));
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!selectJSON) {
      setProducts([]);
      return;
    }
    const categoryObj = Array.isArray(GetAllJsoNScraping)
      ? GetAllJsoNScraping.find((cat) => cat.categoria === selectJSON)
      : null;
    if (categoryObj) {
      setProducts(categoryObj.productos || []);
    } else {
      setProducts([]);
    }
  }, [selectJSON, GetAllJsoNScraping]);


  const handleSubmitMasivo = async () => {
    if (!selectedCategoryId || products.length === 0) {
      alert("Elegí categoría y que haya productos");
      return;
    }
    try {
      toggleStatus('CrearProducts', { loading: true, mensaje: 'Creando Productos...' });
      // Mapear productos scrapeados para armar el JSON que espera el backend
      const productosParaCrear = products.map(prod => ({
        model: prod.nombre,
        modelUser: prod.nombre,
        description: prod.description || '',
        price: Number(prod.precio.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]+/g, '')) || 0,
        stock: 10, // o stock fijo o sacalo del JSON scrapeado si lo tenés
        categoryIds: [Number(selectedCategoryId)],
        images: [
          {
            imagenLocalJpeg: prod.imagenLocalJpeg,
            imagenLocalWebp: prod.imagenLocalWebp,
            imagenZoomLocal: prod.imagenZoomLocal,
            imagenZoomLocalWebp: prod.imagenZoomLocalWebp,
            alt: prod.nombre || prod.description || ''
          }
        ]
      }));

      for (const prod of productosParaCrear) {
        await axios.post(`${apiUrl}/api/createProduct`, prod);
      }
      toggleStatus('CrearProducts', { loading: false , mensaje: 'Productos Creados Correctamente✅' });
      setTimeout(() => {
        toggleStatus('CrearProducts', { loading: false, mensaje: '' });
      }, 6000);

      alert(`Se crearon ${productosParaCrear.length} productos.`);
    } catch (error) {
      toggleStatus('CrearProducts', { loading: false, mensaje: 'Error al Crear Prodcutos❌' });
      setTimeout(() => {
        toggleStatus('CrearProducts', { loading: false, mensaje: '' });
      }, 6000); alert("Error al crear productos." + error);
    }
  };

  //PARA EL SELECT DE REACT-SELECT
  const options = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  const opciones = GetAllJsoNScraping?.map((catObj) => ({
    value: catObj.categoria || '',
    label: catObj.categoria || 'Sin categoría',
  })) || [];
  //STYLOS PARA LOS SELECT
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      fontSize: '2vh',
      minWidth: '90vh',
      maxWidth: '20rem',
      borderColor: state.isFocused ? 'var(--colorv1)' : '#ccc',
      boxShadow: state.isFocused ? '0 0 0 1.5px var(--colorv1)' : 'none',
      borderRadius: '6px',
      padding: '2px 4px',
      margin: '0.3rem 0',
      cursor: 'text', // también se puede poner acá si querés que el control entero sea clickeable
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'var(--colorv1)' : '#fff',
      color: state.isSelected ? '#333' : '#000', // cambio de color del texto
      cursor: 'pointer', // cursor tipo "mano"
      '&:hover': {
        backgroundColor: 'var(--colorv1)',
        color: '#000',
      },
    }),
  };
  const Spinner = () => (
    <>
      <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
      <div
        style={{
          width: '20px',
          height: '20px',
          border: '3px solid #ccc',
          borderTop: '3px solid var(--colorv1)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    </>
  );

  return (
    <div className={styles.formGroup}>
      <h2 className={styles.title}>Crear Productos Masivos</h2>
      <Select
        options={options}
        styles={customStyles}
        value={options.find(option => option.value === selectedCategoryId) || null}
        onChange={option => setSelectedCategoryId(option?.value || '')}
        placeholder="-- Selecciona en qué categoría guardar los productos --"
      />


      <Select
        styles={customStyles}
        options={opciones}
        value={opciones.find(opt => opt.value === selectJSON) || null}
        onChange={(selectedOption) => setSelecJSON(selectedOption?.value || '')}
        placeholder="-- Selecciona una categoría JSON Scrapeada --"
      />

      <h3 className={styles.subTitle}>Productos de Scraping JSON: {selectJSON || "Ninguna seleccionada"}</h3>

      {products && products.length > 0 ? (
        <>
          <ul className={styles.boxProdcutUl}>
            {products.map((prod, i) => (
              <li className={styles.liproductos} key={i}>
                NOMBRE: {prod.nombre || JSON.stringify(prod)}
                <br />
                PRECIO: {prod.precio} ---
                ID: {prod.id}
              </li>
            ))}
          </ul>
<button
  className={styles.submitButton}
  onClick={handleSubmitMasivo}
  disabled={!selectedCategoryId || products.length === 0}
>
  {status.CrearProducts?.loading || status.CrearProducts?.mensaje ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {status.CrearProducts.loading && <Spinner />}
      <span>{status.CrearProducts.mensaje}</span>
    </div>
  ) : (
    <>Crear {products.length} productos scrapeados</>
  )}
</button>

        </>
      ) : (
        <p className={styles.boxProdcutp}>No hay productos para esta categoría</p>
      )}
    </div>
  );
};

export default CrearProductos;
