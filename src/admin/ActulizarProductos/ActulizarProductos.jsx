import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';
import s from "./ActulizarProductos.module.css";

const ActulizarProductos = ({ categoryIds }) => {
  const { register, handleSubmit, setValue, control, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [alts, setAlts] = useState([]);
  const [MostrarJsonIMG, setMostrarJsonIMG] = useState(false);

    const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!categoryIds) return setProducts([]);
    axios.get(`${apiUrl}/api/productos?categoryIds=${categoryIds}`)
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, [categoryIds]);

  useEffect(() => {
    axios.get(`${apiUrl}/api/getCategorias`)
      .then(res => setAllCategories(res.data))
      .catch(console.error);
  }, [products]);

  const handleSelect = async (id) => {
    if (!id) return;
    try {
      const res = await axios.get(`${apiUrl}/api/products/detail/${id}`);
      const product = res.data;
      setSelectedProduct(product);

      reset({
        model: product.model || '',
        modelUser: product.modelUser || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
      });

    setSelectedCategories(product.categories?.map(cat => cat.id) || []);
      setImagesToDelete([]);
      setAlts([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
    setAlts(Array.from(e.target.files).map(() => ''));
  };

  const handleAltChange = (index, alt) => {
    setAlts(prev => {
      const copy = [...prev];
      copy[index] = alt;
      return copy;
    });
  };

  const toggleDeleteImageID = async (imgID, pathimg) => {
    setLoading(true);
    setMessage(''); // limpiar mensaje previo
    try {
      const response = await axios.delete(
        `${apiUrl}/api/delete-image/${imgID}`,
        {
          data: { path: pathimg }
        }
      );

      setMessage({ text: response.data.message, isError: false });
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || 'Error desconocido';
      const status = error.response?.status || '';
      setMessage({ text: `Error ${status}: ${errMsg}`, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleExistingImageAltChange = (imageId, alt) => {
    setSelectedProduct(prev => {
      const images = prev.images.map(img => img.id === imageId ? { ...img, alt } : img);
      return { ...prev, images };
    });
  };

  const onSubmit = async (data) => {
    if (!selectedProduct) return;
    setLoading(true);
    setMessage({ text: '', isError: false });
    const formData = new FormData();
    formData.append('model', data.model);
    formData.append('modelUser', data.modelUser);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('categoryIds', JSON.stringify(selectedCategories));

    if (imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }
    
    const updates = {};
    selectedProduct.images.forEach(img => {
      updates[img.id] = { alt: img.alt || '' };
    });
    formData.append('imageFieldUpdates', JSON.stringify(updates));

if (images.length > 0) {
  Array.from(images).forEach(file => formData.append('images', file));
  formData.append('alts', JSON.stringify(alts));
}
    try {
      
      const res = await axios.put(`${apiUrl}/api/updateProduct/${selectedProduct.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Mostrar el JSON recibido en texto formateado
    setMessage({
      text: `Producto actualizado correctamente:\n${JSON.stringify(res.data, null, 2)}`,
      isError: false
    });
      setMessage('Producto actualizado correctamente.');
      setSelectedProduct(res.data);
      setImages([]);
      setImagesToDelete([]);
      setAlts([]);
    } catch (error) {
         // Mostrar el error si tiene respuesta, si no el mensaje general
    const errorMsg = error.response?.data
      ? JSON.stringify(error.response.data, null, 2)
      : error.message;

    setMessage({
      text: `Error al actualizar el producto:\n${errorMsg}`,
      isError: true
    });
    }finally {
    setLoading(false);
  }
  };

//SELECT CATEGORIAS 
const options = allCategories.map(cat => ({
  value: cat.id,
  label: cat.name
}));
//SELECT REACT SYLES
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
  dropdownIndicator: (provided) => ({ // la flecha hacia abajo
    ...provided,
    cursor: 'pointer',
  }),
  menuPortal: base => ({
    ...base,
    zIndex: 9999,
  }),
  multiValueRemove: (provided) => ({ //boton de X selec
  ...provided,
  cursor: 'pointer',
}),
clearIndicator: (provided) => ({ //boton x que elimina todo selec
  ...provided,
  cursor: 'pointer',
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

  return (
    <div className={s.boxForm}>
      {/* <section className={s.boxForm}></section> */}
      <h2 className={s.titleUpdateP}>🛠️ EDITAR PRODUCTO/S</h2>
      <Select
        className={s.SelectInput}
        styles={customStyles}
        placeholder="Selecciona un Producto"
        value={
          selectedProduct
            ? {
              value: selectedProduct.id,
              label: `ID ${selectedProduct.id} - ${selectedProduct.model}`
            }
            : null
        } onChange={(selectedOption) => handleSelect(selectedOption?.value)}
        options={products.map(p => ({
          value: p.id,
          label: `ID ${p.id} - ${p.model}`
        }))}
      />

      {selectedProduct && (
        <form onSubmit={handleSubmit(onSubmit)} className={s.boxForm}>
          <div className={s.id}> ID: {selectedProduct.id}</div>

          <div className={s.SelectInput}>
            <label className={s.Label}>Nombre</label>
            <input className={s.Sinput} {...register('model', { required: true })} />
          </div>

          <div className={s.SelectInput}>
            <label className={s.Label}>Nombre que ve el usuario</label>
            <input className={s.Sinput} {...register('modelUser')} />
          </div>

          <div className={s.SelectInput}>
            <label className={s.Label}>Descripción</label>
            <textarea className={s.Sinput} {...register('description')} onInput={e => {
              e.target.style.height = "auto"; // reinicia la altura
              e.target.style.height = `${e.target.scrollHeight}px`; // ajusta a contenido
            }} />
          </div>

          <div className={s.SelectInput}>
            <label className={s.Label}>Precio</label>
            <input className={s.Sinput} type="number" {...register('price')} />
          </div>

          <div className={s.SelectInput}>
            <label className={s.Label}>Stock</label>
            <input className={s.Sinput} type="number" {...register('stock')} />
          </div>

          <div className={s.SelectInput}>
            <label className={s.Label}>Categorías actuales:</label>
            <Select
              styles={customStyles}
              isMulti
              options={options}
              placeholder="Selecciona categoria/s"
              value={options.filter(opt => selectedCategories.includes(opt.value))}
              onChange={selectedOptions =>
                setSelectedCategories(selectedOptions.map(opt => opt.value))
              }
            />
          </div>

          <div className={s.boxForm}>
            <h2 className={s.titleUpdateP}>Agregar nuevas imágenes:</h2>
            <input className={s.inputSubirImg} type="file" multiple onChange={handleImageChange} />
            <span className={s.spanINFO}>Guardo las imágenes automáticamente según su formato y nombre: si es .webp va a WEBP; si incluye "ZOOM", va a ZoomWEBP sino va a urlWEB.</span>

            {Array.from(images).map((img, i) => (

              <div className={s.boxSubirimg} key={i}>
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${i}`}
                  className={s.previewImg} // Estilo personalizado (ej: tamaño, bordes)
                />
                <input
                  className={s.Sinput}
                  type="text"
                  placeholder="Alt para la imagen"
                  value={alts[i] || ''}
                  onChange={e => handleAltChange(i, e.target.value)}
                />

              </div>
            ))}
          </div>

          <div className={s.boxForm}>         
            <h2 className={s.titleUpdateP}>IMAGENES ACTUALES</h2>   
            <>
              <button onClick={() => setMostrarJsonIMG(!MostrarJsonIMG)} className={s.btn} style={{maxHeight:'1.8rem'}}>
                {MostrarJsonIMG ? 'Ocultar imágenes' : 'Ver imágenes JSON'}
              </button>
              {MostrarJsonIMG && (
                <div className={s.cartel}>
                  <button className={s.cerrar} onClick={() => setMostrarJsonIMG(false)}>✕</button>
                  {selectedProduct && Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0 ? (
                    <pre>{JSON.stringify(selectedProduct.images, null, 2)}</pre>
                  ) : (
                    <p>No hay imágenes para mostrar.</p>
                  )}
                </div>
              )}
            </>
            <label className={s.Label}>(click para marcar y borrar del sistema por id):</label>
            <div>
              {selectedProduct.images.map(img => {
                const imageUrls = [img.urlWEBP, img.url, img.urlZoomWEBP, img.urlZoom].filter(Boolean);
                const marked = imageUrls.some(url => imagesToDelete.includes(url));
                const displayUrl = imageUrls.length > 0 ? `https://necdxbcyrfcwwiiqxqmh.supabase.co/storage/v1/object/public/media/${imageUrls[0]}` : '';
                return displayUrl && (
                  <div
                    key={img.id}
                    style={{
                      display: 'inline-block',
                      margin: '0.5rem',
                      border: marked ? '4px solid red' : '4px solid green',
                      cursor: 'pointer',
                      width: '110px'
                    }}
                    onClick={() => toggleDeleteImageID(img.id, imageUrls)}
                  >
                    <img
                      src={displayUrl}
                      alt={img.alt}
                      style={{ width: '100px', minHeight: '100px', margin:'0',objectFit: 'cover' }}
                    />
                    <input
                    className={s.Sinput}
                      type="text"
                      value={img.alt}
                      onChange={e => handleExistingImageAltChange(img.id, e.target.value)}
                      placeholder="Editar alt"
                      style={{ width: '10rem', marginTop: '0.2rem' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" className={s.btn} style={{backgroundColor:'#007BFF', margin:'0.5rem 0'}}>💾 Actualizar Producto</button>
        </form>
      )}

{loading && <p>Cargando...</p>}

{!loading && message && typeof message === 'string' && <p>{message}</p>}

{!loading && message && typeof message === 'object' && message.text && (
  <p style={{ color: message.isError ? 'red' : 'green' }}>
    {message.text}
  </p> 
)}

    </div>
  );
};

export default ActulizarProductos;
