import { useEffect, useState } from 'react';
import axios from 'axios';
import s from './ScanURL.module.css'
import Select from 'react-select'
import ProductsJSonRepetidos from './ProductsJSonRepetidos'
import GetJSONScraping from './GetJSONScraping'
const ScanURL = () => {
  const [categoriasJSONForm, setCategoriasJSONForm] = useState([{ nombre: '', urls: [''] }]);
  const [categoriasJSONGuardadas, setCategoriasJSONGuardadas] = useState([]);
  const [categoriaJSONSeleccionada, setCategoriaSeleccionadaJSON] = useState('');
  const [status, setStatus] = useState({
    scraping: { loading: false, mensaje: '' },
    eliminar: { loading: false, mensaje: '' },
  });
  const toggleStatus = (seccion, { loading = false, mensaje = '' } = {}) => {
    setStatus(prev => ({
      ...prev,
      [seccion]: { loading, mensaje }
    }));
  };

  const apiUrl = import.meta.env.VITE_API_URL;


  const fetchCategorias = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/GetAllJsoNScraping`);
      const nombres = res.data.map(cat => cat.categoria);
      setCategoriasJSONGuardadas(nombres);
      return
    } catch (err) {
      console.error('Error al obtener scrapings:', err);
    }
  };
  // ➕ Agregar y modificar categorías del form
  const handleChange = (catIndex, field, value) => {
    const newCategorias = [...categoriasJSONForm];
    if (field === 'nombre') {
      newCategorias[catIndex].nombre = value;
    }
    setCategoriasJSONForm(newCategorias);
  };

  const handleUrlChange = (catIndex, urlIndex, value) => {
    const newCategorias = [...categoriasJSONForm];
    newCategorias[catIndex].urls[urlIndex] = value;
    setCategoriasJSONForm(newCategorias);
  };

  const addCategoria = () => {
    setCategoriasJSONForm([...categoriasJSONForm, { nombre: '', urls: [''] }]);
  };

  const addUrl = (catIndex) => {
    const newCategorias = [...categoriasJSONForm];
    newCategorias[catIndex].urls.push('');
    setCategoriasJSONForm(newCategorias);
  };

  const removeCategoria = (index) => {
    const newCategorias = categoriasJSONForm.filter((_, i) => i !== index);
    setCategoriasJSONForm(newCategorias);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toggleStatus('scraping', { loading: true, mensaje: 'Haciendo scraping...' });
      const res = await axios.post(`${apiUrl}/api/ScanProductos`, {
        categorias: categoriasJSONForm,
      });
      toggleStatus('scraping', { loading: false, mensaje: 'Scraping finalizado✅' });
      setTimeout(() => {
        toggleStatus('scraping', { loading: false, mensaje: '' });
      }, 6000);
      alert('Scraping realizado con éxito:\n' + JSON.stringify(res.data, null, 2));

    } catch (err) {
      toggleStatus('scraping', { loading: false, mensaje: 'Error al hacer scraping❌' });
      setTimeout(() => {
        toggleStatus('eliminar', { loading: false, mensaje: '' });
      }, 6000);
      alert('Error al hacer scraping❌' + err);
    }
  };

  // 🗑️ Eliminar una categoría
  const handleEliminarCategoria = async () => {
    if (!categoriaJSONSeleccionada) return;
    const confirmar = window.confirm(`¿Eliminar la categoría "${categoriaJSONSeleccionada}"?`);
    if (!confirmar) return;
    try {
      toggleStatus('eliminar', { loading: true, mensaje: `Eliminando Json ${categoriaJSONSeleccionada}` });
      const res = await axios.delete(`${apiUrl}/api/DELscraping/${categoriaJSONSeleccionada.toLowerCase()}`);
      toggleStatus('eliminar', { loading: false, mensaje: `Json ${categoriaJSONSeleccionada} Eliminado Correctamente✅` });
      setTimeout(() => {
        toggleStatus('eliminar', { loading: false, mensaje: '' });
      }, 6000);
      setCategoriasJSONGuardadas(prev => prev.filter(cat => cat !== categoriaJSONSeleccionada));
      setCategoriaSeleccionadaJSON('');

    } catch (err) {
      toggleStatus('eliminar', { loading: false, mensaje: 'Error al eliminar❌' });
      setTimeout(() => {
        toggleStatus('eliminar', { loading: false, mensaje: '' });
      }, 6000);
      alert('Error al eliminar el Json❌' + err);
    }
  };

  // 🗑️ Eliminar todos
  const handleEliminarTodos = async () => {
    const confirmar = window.confirm('¿Seguro que querés eliminar TODOS los scrapings?');
    if (!confirmar) return;

    try {
      toggleStatus('eliminar', { loading: true, mensaje: `Eliminando Json ${categoriaJSONSeleccionada}` });
      const res = await axios.delete(`${apiUrl}/api/DELscraping`);
      toggleStatus('eliminar', { loading: false, mensaje: `Jsons ${categoriaJSONSeleccionada}Eliminados correctamente✅` });
      setTimeout(() => {
        toggleStatus('eliminar', { loading: false, mensaje: '' });
      }, 6000);
      setCategoriasJSONGuardadas([]);
    } catch (err) {
      toggleStatus('eliminar', { loading: false, mensaje: 'Error al eliminar❌' });
      setTimeout(() => {
        toggleStatus('eliminar', { loading: false, mensaje: '' });
      }, 6000);      alert('Error al eliminar Jsons❌' + err);
    }
  };
  //para Select react
  // Transformar las categorías al formato que usa react-select
  const opcionesCategorias = categoriasJSONGuardadas?.map(cat => ({
    value: cat,
    label: cat,
  })) || [];
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
    <div className={s.boxScraping}>
      <h3 className={s.titleScra}>SCRAPINGS URLS</h3>
      <div className={s.boxGestion}>
        <Select
          styles={customStyles}
          value={opcionesCategorias.find(op => op.value === categoriaJSONSeleccionada) || null}
          onMenuOpen={fetchCategorias}
          onChange={(opcion) => setCategoriaSeleccionadaJSON(opcion?.value)}
          options={opcionesCategorias}
          placeholder="Seleccionar categoría JSON"
        />

        <button
          onClick={handleEliminarCategoria}
          disabled={!categoriaJSONSeleccionada}
          className={s.btn}>
          🚮 Eliminar JSON
        </button>
        <button
          onClick={handleEliminarTodos}
          className={s.btn}>
          ❌ Eliminar TODOS los archivos JSON
        </button>
        {status.eliminar && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
            {status.eliminar.loading && (
              <Spinner />
            )} <span>{status.eliminar.mensaje}</span>
          </div>
        )}
      </div>

      {/* FORMULARIO DE SCRAPING */}
      <div className={s.boxGestion}>
        <h3 className={s.titleScra}>📦 ESCANEAR PRODUCTOS</h3>
        <form onSubmit={handleSubmit}>
          {categoriasJSONForm.map((cat, catIndex) => (
            <div key={catIndex} className={s.boxScaner}>
              <label className={s.inputScan}>--Nombre del Json--
                <input
                  type="text"
                  value={cat.nombre}
                  onChange={(e) => handleChange(catIndex, 'nombre', e.target.value)}
                  required />
              </label>
              <br />
              <strong >--URLs--</strong>
              {cat.urls.map((url, urlIndex) => (
                <div key={urlIndex} className={s.inputScan}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(catIndex, urlIndex, e.target.value)}
                    required
                  />
                </div>
              ))}
              <div className={s.boxBtnScan}>
                <button className={s.btn} type="button" onClick={() => addUrl(catIndex)}>➕ Agregar URL</button>
                <button className={s.btn} type="button" onClick={() => removeCategoria(catIndex)}>❌ Eliminar Categoría</button>
              </div>
            </div>
          ))}
          <div className={`${s.boxBtnScan} ${s.boxBtnScan2}`}>
            <button className={s.btn} type="button" onClick={addCategoria}>➕ Nueva Categoría</button>
            <button className={s.btn} type="submit">🚀 Iniciar Scraping</button>

          </div>
          {status.scraping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
              {status.scraping.loading && (
                <Spinner />
              )} <span>{status.scraping.mensaje}</span>
            </div>
          )}
        </form>
      </div>
      <div className={s.boxGestion}>
        <ProductsJSonRepetidos />
      </div>
      <div className={s.boxGestion}>
        <GetJSONScraping />
      </div>

    </div>
  );
};

export default ScanURL;
