import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ScanURL.module.css'

export default function ProductsJSonRepetidos() {
  const [repetidos, setRepetidos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  //Para llamar al hanlder que filtra los productos repetidos de los json scrapings
  const cargarRepetidos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/filtrarRepetidos`);
      const data = await res.json();
      if (res.ok) {
        setRepetidos(data.repetidos || []);
        setMensaje(data.mensaje || 'Repetidos procesados correctamente');
      } else {
        setMensaje('Error al procesar los repetidos');
      }
    } catch (err) {
      setMensaje('Error de conexión al backend');
    } finally {
      setLoading(false);
    }
  };

    const fetchRepetidosDesdeArchivo = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/getProductosRepetidos`);
        setRepetidos(data || []);
      } catch (error) {
        window.alert("Error al cargar productos repetidos:", error);
      }
    };


  return (
    <div className={styles.repetidosContainer}>
      <h2 className={styles.titleScra}>Productos Repetidos</h2>
      <div className={styles.boxBtnScan}>
      <button className={styles.btn} onClick={cargarRepetidos} disabled={loading}>
        {loading ? "Procesando..." : "Procesar y Mostrar Repetidos"}
      </button>

      {mensaje && <p style={{ marginTop: '1rem' }}>{mensaje}</p>}
      <button className={styles.btn} onClick={fetchRepetidosDesdeArchivo} style={{ marginBottom: '1rem' }}>
        Mostrar productos repetidos
      </button>
</div>
      {repetidos && (
        <>
          {Array.isArray(repetidos) ? (
            repetidos.length === 0 ? (
              <p style={{ marginTop: '2rem' }}>No hay productos repetidos aún.</p>
            ) : (
              <div className={styles.grid}>
                <div>Cantidad: {repetidos.length}</div>
                {repetidos.map((producto, index) => (
                  <div key={index} className={styles.card}>
                    <img
                      src={producto.imagenLocal}
                      alt={producto.nombre}
                      className={styles.imagen}
                    />
                    <h3>{producto.nombre}</h3>
                    <p><strong>Precio:</strong> {producto.precio}</p>
                    <p><strong>Categorías:</strong> {Array.isArray(producto.categoria) ? producto.categoria.join(', ') : producto.categoria}</p>
                    <a
                      href={producto.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver producto
                    </a>
                    <p className={styles.descripcion}>{producto.description}</p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p style={{ marginTop: '2rem', color: 'gray' }}>Cargando o sin datos.</p>
          )}
        </>
      )}
      
    </div>
  );
}
