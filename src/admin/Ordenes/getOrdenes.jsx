// components/Ordenes.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Ordenes.module.css"; 

const apiUrl = import.meta.env.VITE_API_URL;

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/ordenesGet`);
        setOrdenes(res.data);
      } catch (err) {
        setError("No se pudieron obtener las órdenes");
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p>{error}</p>;


const handleDeleteOrder = async (id) => {
  if (!window.confirm("¿Seguro que querés eliminar esta orden?")) return;
  try {
    await axios.delete(`${apiUrl}/api/deleteOrden/${id}`);
    alert("Orden eliminada correctamente");
    // Opcional: actualizar estado para remover la orden de la lista
    setOrdenes(prev => prev.filter(o => o.id !== id));
  } catch (error) {
    console.error("Error eliminando la orden:", error);
    alert("Error al eliminar la orden");
  }
};

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Lista de Órdenes</h2>
      {ordenes.map((orden) => (
        <div key={orden.id} className={styles.ordenCard}>
          <span>ordenID: {orden.id}</span>
<button
  onClick={() => handleDeleteOrder(orden.id)}
  style={{
    backgroundColor: "crimson",
    color: "white",
    padding: "0.4rem 1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Eliminar Orden
</button>
          <div className={styles.infoPrincipal}>
            <p><strong>Nombre:</strong> {orden.fullName}</p>
            <p><strong>Email:</strong> {orden.email}</p>
            <p><strong>Teléfono:</strong> {orden.phone}</p>
            <p><strong>Dirección:</strong> {orden.address}</p>
            <p><strong>Tienda:</strong> {orden.storeName}</p>
            <p><strong>Método de Pago:</strong> {orden.paymentMethod}</p>
            <p><strong>Tipo de Entrega:</strong> {orden.deliveryType}</p>
            <p><strong>Estado:</strong> {orden.status}</p>
            <p><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleDateString()}</p>
          </div>
          <div className={styles.itemsContainer}>
            <h4>Productos:</h4>
            <ul>
              {orden.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <p>Producto ID: {item.productId}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio: ${item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ordenes;
