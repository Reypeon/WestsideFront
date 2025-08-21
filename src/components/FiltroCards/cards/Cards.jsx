import s from "./Cards.module.css";
import Loeader from "../../shared/loader";
import ProductSearch from '../../ProductSearch/ProductSearch'
import { Suspense, lazy, useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import { ReactSortable } from "react-sortablejs";
import axios from "axios";

const Card = lazy(() => import("./card/Card"));

const fetcher = (...args) => fetch(...args).then(res => res.json());

function ProductsCards({ filter, isAdmin = false, nameFilter, order}) {
  const apiUrl = import.meta.env.VITE_API_URL;
  // Cargar productos (por categoría si hay filtro)
  const { data, error, isLoading } = useSWR(
    filter !== null && filter !== undefined && filter !== ""
      ? `${apiUrl}/api/productos?categoryIds=${filter}`
      : `${apiUrl}/api/all-products`,
    fetcher
  );
console.log(order);

  // Ordenar productos según ProductCategory.orden para la categoría filtrada
  const productosOrdenados = useMemo(() => {
    if (!data) return [];
    if (!Array.isArray(data)) return data.productos || [];

    if (!filter) return data;

    // Parsear filter a entero para comparar bien
    const catId = parseInt(filter);

    return data.sort((a, b) => {
      const ordenA = a.categories.find(c => c.id === catId)?.ProductCategory?.orden ?? 9999;
      const ordenB = b.categories.find(c => c.id === catId)?.ProductCategory?.orden ?? 9999;
      return ordenA - ordenB;
    });
  }, [data, filter]);
  // Estado para el orden editable en admin
  const [adminOrder, setAdminOrder] = useState([]);
  // Cuando cambian los productos o el filtro, y si es admin, setear adminOrder con productos ordenados
  useEffect(() => {
    if (isAdmin) {
      setAdminOrder(productosOrdenados);
    }
  }, [productosOrdenados, isAdmin]);



  // Paginación
const [page, setPage] = useState(() => {
  const saved = localStorage.getItem("productsPage");
  return saved ? parseInt(saved) : 0;
});  
const pageSize = (isAdmin ? 900 : 16);

useEffect(() => {
  localStorage.setItem("productsPage", page);
}, [page]);

  const totalPages = useMemo(() => {
    const listLength = isAdmin ? adminOrder.length : productosOrdenados.length;
    return Math.ceil(listLength / pageSize);
  }, [adminOrder, productosOrdenados, isAdmin]);

  const currentData = useMemo(() => {
    const listToPaginate = isAdmin ? adminOrder : productosOrdenados;
    const start = page * pageSize;
    return listToPaginate.slice(start, start + pageSize);
  }, [adminOrder, productosOrdenados, page]);

  // Control paginación
  const handlePrev = useCallback(() => setPage(p => Math.max(p - 1, 0)), []);
  const handleNext = useCallback(() => setPage(p => Math.min(p + 1, totalPages - 1)), [totalPages]);

  const [guardando, setGuardando] = useState(false);
  // Guardar nuevo orden en backend
  const guardarOrden = async () => {
    if (!filter) {
      alert("Seleccioná la categoría a ordenar.");
      return;
    }
    setGuardando(true);
    try {
      const ordenIds = adminOrder.map(p => p.id);
      await axios.post(`${apiUrl}/api/ordenar`, {
        ordenIds,
        categoryId: parseInt(filter),
      });
      alert("Orden guardado correctamente");
    } catch (e) {
      alert("Error al guardar el orden");
      console.error(e);
    }
    setGuardando(false);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar este producto del sistema?");
    if (!confirmar) return;
    try {
      await axios.delete(`${apiUrl}/api/dellProduct/${id}`);
      // Opcionalmente, actualizá el estado local:
      setAdminOrder(prev => prev.filter(p => p.id !== id));
      alert("Producto eliminado con éxito");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar el producto.");
    }
  };
  //eliminar ;a  categoria del producto la asociacion
  const handleDeleteCategory = async (categoryId, productIds) => {
    const confirmar = window.confirm(`¿Estás seguro de que querés eliminar el producto de esta categoria?${filter}`);
    if (!confirmar) return;

    try {
      const res = await axios.delete(`${apiUrl}/api/category/removeProducts`, {
        data: {
          categoryId,
          productIds
        }
      });
      window.alert(`Asociación eliminada categori:  ${categoryId} del ProductoId: ${productIds}` + JSON.stringify(res.data));
    } catch (error) {
      console.error('Error al eliminar asociación: ', error);
      window.alert('Error al eliminar');
    }
  };

  // Renderizado
  if (error) {
    return <div className={s.loading}>❌ Error al cargar productos.</div>;
  }

  if (isLoading || !data) {
    return <div className={s.loading}><Loeader mensaje="⏳ Cargando productos..." /></div>;
  }

  if ((isAdmin ? adminOrder.length : productosOrdenados.length) === 0) {
    return <div className={s.loading}>🛒 No hay productos disponibles en esta categoría.</div>;
  }

  return (
    <>
      {isAdmin ? (
        <>
        
          <ProductSearch allProducts={currentData} />
          <div className={s.adminId} style={{ marginTop: 10 }}>
            Productos Totales: {adminOrder.length}
          </div>
          <ReactSortable
            list={adminOrder}
            setList={setAdminOrder}
            animation={150}
            className={s.cardsContainer} style={{ rowGap: '3.5rem' }}
            handle=".handle"
          >
            {currentData.map(({ id, model, description, price, stock, categories, images, quantity }) => (
              <Suspense key={id} fallback={<Loeader mensaje="..." heigth="100%" />}>
                <div className="handle" style={{ cursor: "grab", overflow: 'hidden' }}>
                  <Card
                    id={id}
                    model={model}
                    description={description}
                    price={price}
                    stock={stock}
                    categoryIds={categories}
                    quantity={quantity}
                    images={images}
                    isAdmin={isAdmin}
                    onDelete={() => handleDelete(id)}
                    onDeleteCate={() => handleDeleteCategory(filter, [id])}

                  />
                </div>
              </Suspense>
            ))}
          </ReactSortable>

          <div style={{ marginTop: 15 }}>
            <button onClick={guardarOrden} disabled={guardando}>
              {guardando ? "Guardando orden..." : "Guardar orden"}
            </button>
          </div>

        </>
      ) : (
        <div className={s.cardsContainer}>
          {currentData.map(({ id, model, modelUser, description, price, stock, categories, images, quantity }) => (
            <Suspense key={id} fallback={<Loeader mensaje="..." heigth="100%" />}>
              <Card
                id={id}
                model={model}
                description={description}
                price={price}
                stock={stock}
                categoryIds={categories}
                quantity={quantity}
                images={images}
                isAdmin={isAdmin}
                nameFilter={nameFilter}
              />
            </Suspense>
          ))}
        </div>
      )}

      {/* <div className={s.paginationButtons}>
        <button onClick={handlePrev} disabled={page === 0}>Anterior</button>
        <span>Página {page + 1} de {totalPages}</span>
        <button onClick={handleNext} disabled={page === totalPages - 1}>Siguiente</button>
      </div> */}
    </>
  );
}

export default ProductsCards;
