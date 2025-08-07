import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import Card from "../FiltroCards/cards/card/Card"; // Asegurate de importar tu componente
import styles from "./ProductSearch.module.css"; // Estilos
import axios from "axios";
const normalize = (str) =>
  str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const ProductSearch = ({ allProducts }) => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Debounced search
  useEffect(() => {
    const handler = debounce(() => {
      const normalizedTerm = normalize(searchTerm);

      const results = allProducts.filter((prod) => {
        const normalizedId = String(prod.id);
        return (
          normalizedId.includes(normalizedTerm) ||
          normalize(prod.model).includes(normalizedTerm) ||
          normalize(prod.description).includes(normalizedTerm) ||
          normalize(prod.category?.name || "").includes(normalizedTerm)
        );
      });

      setFilteredProducts(results);
    }, 300); //300 milissrgundo 0.3s de esera

    handler();
    return () => {
      handler.cancel();
    };
}, [searchTerm, allProducts]); // ✅ sólo dependencias necesarias

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar este producto?");
    if (!confirmar) return;

    try {
      await axios.delete(`${apiUrl}/api/dellProduct/${id}`);
      alert("Producto eliminado con éxito");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar el producto.");
    }
  };
  //eliminar ;a  categoria del producto la asociacion
  const handleDeleteCategory = async (categoryId, productIds) => {
    let categoriaDel = categoryId[0].id;
    const confirmar = window.confirm(`¿Estás seguro de que querés eliminar el producto de esta categoria?${categoriaDel}`);
    if (!confirmar) return;
    try {
      const res = await axios.delete(`${apiUrl}/api/category/removeProducts`, {
        data: {
          categoryId:categoriaDel,
          productIds
        }
      });
      window.alert(`Asociación eliminada categori:  ${categoryId} del ProductoId: ${productIds}` + JSON.stringify(res.data));
    } catch (error) {
      console.error('Error al eliminar asociación: ', error);
      window.alert('Error al eliminar');
    }
  };
  return (
    <div className={styles.container}>
            <h1 className={styles.h1search}>Buscar productos por nombre o ID</h1>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.cardSearch}>
        {filteredProducts.length ? (
          filteredProducts.map(({ id, model, description, price, stock, categories, images, quantity }) => (
                   <Card
                   key={id}
                    id={id}
                    model={model}
                    description={description}
                    price={price}
                    stock={stock}
                    categoryIds={categories}
                    quantity={quantity}
                    images={images}
                    isAdmin={true}
                    onDelete={() => handleDelete(id)}
                    onDeleteCate={() => handleDeleteCategory(categories, [id])}
                  />
          ))
        ) : (
          <p>No se encontraron productos</p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
