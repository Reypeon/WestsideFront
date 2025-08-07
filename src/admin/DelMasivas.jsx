
import { useState, useEffect } from 'react';
import axios from 'axios';
import s from "./DelMasivas.module.css";

const DelMasivas = ({ categoryIds }) => {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [priceFormula, setPriceFormula] = useState('');
  const [message, setMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

console.log(selectedIds.length);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = categoryIds
          ? `${apiUrl}/api/productos?categoryIds=${categoryIds}`
          : `${apiUrl}/api/all-products`;

        const res = await axios.get(endpoint);
        setProducts(res.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, [categoryIds]);
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allIds = products.map((p) => p.id);
      setSelectedIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert("No seleccionaste ningún producto.");
    if (!window.confirm(`¿Eliminar ${selectedIds.length} productos?`)) return;
    try {
      await axios.delete(`${apiUrl}/api/dellProduct`, {
        data: { ids: selectedIds },
      });
      alert("Productos eliminados correctamente.");
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Error al eliminar productos:", error);
      alert("Error al eliminar productos.");
    }
  };

  const handleRemoveProductsFromCategory = async () => {
    if (!selectedIds.length) return window.alert('No seleccionaste productos');
    if (!categoryIds ) return window.alert('Falta el ID de la categoría');
    if (!window.confirm(`¿Eliminar ${selectedIds.length} productos de su categoría id= ${categoryIds}?`)) return;

    try {
      await axios.delete(`${apiUrl}/api/category/removeProducts`, {
        data: {
          categoryId: categoryIds,
          productIds: selectedIds
        }
      });
      window.alert('Productos removidos de la categoría');
    } catch (error) {
      console.error('Error al remover de categoría:', error);
      window.alert('Error al remover');
    }
  };

  const aplicarFormulaSeleccionados = async () => {
    if (!priceFormula || selectedIds.length === 0) {
      return alert("Fórmula o selección inválida");
    }
    try {
      const res = await axios.put(`${apiUrl}/api/updatePricesByIds`, {
        selectedIds,
        formula: priceFormula,
      });
      alert(`✅ ${res.data.message} (${res.data.count} productos actualizados)`);
    } catch (err) {
      console.error("Error al aplicar fórmula:", err);
      alert("❌ Error al actualizar precios.");
    }
  };

  return (
    <div className={s.boxForm}>
      <h2 className={s.title}>📦 Administrar Productos</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleSelectAll}>
          {selectAll ? <span style={{ color: 'red' }}>Deseleccionar todos</span> : <span style={{ color: 'green' }}>Seleccionar todos</span>}
        </button>

        <button
          onClick={handleDeleteSelected}
          style={{ marginLeft: '1rem', color: 'crimson' }}
        >
          🗑️ Eliminar seleccionados del sistema
        </button>

        <button
          onClick={handleRemoveProductsFromCategory}
          style={{ marginLeft: '1rem', backgroundColor: 'orange', color: 'white' }}
        >
          ❌ Eliminar de la categoría
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
          <input
            type="text"
            placeholder="Ej: *1.15  +500  -100"
            value={priceFormula}
            onChange={(e) => setPriceFormula(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1rem', width: '150px' }}
          />
          
          <button
            type="button"
            onClick={aplicarFormulaSeleccionados}
            style={{ padding: '0.5rem 1rem', backgroundColor: 'lightgreen', fontWeight: 'bold' }}
          >
            Actualizar fórmula a los productos seleccionados 
          </button>
        </div>
      </div>
<span>
  Productos seleccionados: {selectedIds.length} / {products.length}
</span>
      <ul style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '1rem' }}>
        {products && products.map((product) => (
          <li key={product.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(product.id)}
                onChange={() => handleCheckboxChange(product.id)}
              />
              {` ID ${product.id} - ${product.model}`}
            </label>
          </li>
        ))}
      </ul>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default DelMasivas;
