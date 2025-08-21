import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";

const CrearProducto = ({ categories, apiUrlLocal, toggleStatus }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Manejar selección de archivos
  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files).map((file) => ({
      file,
      alt: file.name // por defecto el nombre del archivo
    }));
    setSelectedFiles(filesArray);
  };

  // Actualizar alt de cada imagen
  const handleAltChange = (index, value) => {
    const newFiles = [...selectedFiles];
    newFiles[index].alt = value;
    setSelectedFiles(newFiles);
  };

  // Subir imágenes primero
  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((imgObj) => formData.append("images", imgObj.file));

    try {
      const res = await axios.post(`${apiUrlLocal}/api/GuardarIMGSpublic`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Asociar el alt correspondiente
      const uploadedWithAlt = res.data.map((img, i) => ({
        ...img,
        alt: selectedFiles[i]?.alt || selectedFiles[i].file.name
      }));

      setUploadedImages(uploadedWithAlt);
      setSelectedFiles([]);
      setLoading(false);
      alert("Imágenes subidas correctamente ✅");
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Error subiendo imágenes");
    }
  };

  // Crear producto enviando primero el array de imágenes
  const onSubmit = async (data) => {
    if (!uploadedImages || uploadedImages.length === 0) {
      alert("Subí primero al menos una imagen para el producto");
      return;
    }

    if (!data.categoryId) {
      alert("Elegí una categoría");
      return;
    }

    try {
      toggleStatus("CrearProduct", { loading: true, mensaje: "Creando Producto..." });

      const price = Number(
        data.price.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]+/g, "")
      ) || 0;

      const productPayload = {
        model: data.name,
        modelUser: data.name,
        description: data.description || "",
        price,
        stock: data.stock ? Number(data.stock) : 10,
        categoryIds: [Number(data.categoryId)],
        images: uploadedImages.map((img) => ({
          imagenLocalJpeg: img.jpeg,
          imagenLocalWebp: img.webp,
          alt: img.alt,
        })),
      };
      console.log("Product Payload:", productPayload);
      await axios.post(`${apiUrlLocal}/api/createProduct`, productPayload);
      toggleStatus("CrearProduct", { loading: false, mensaje: "Producto Creado ✅" });
      reset();
      setUploadedImages([]);
      alert(`Producto "${data.name}" creado correctamente.`);
    } catch (error) {
      toggleStatus("CrearProduct", { loading: false, mensaje: "Error al crear producto ❌" });
      console.log(error);
      alert("Error al crear producto: " + error);
    }
  };

  const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }));

  return (
    <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "15px" }}>
      {/* Sección subir imágenes */}
      <section>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading || selectedFiles.length === 0} style={{ marginLeft: "10px" }}>
          {loading ? "Subiendo..." : "Subir Imágenes"}
        </button>

        <div style={{ marginTop: "20px" }}>
          {selectedFiles.map((imgObj, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <p>{imgObj.file.name}</p>
              <input
                type="text"
                placeholder="Alt de la imagen"
                value={imgObj.alt}
                onChange={(e) => handleAltChange(i, e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          ))}

          {uploadedImages.map((img, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <p>JPEG: <a href={img.jpeg} target="_blank" rel="noreferrer">{img.jpeg}</a></p>
              <p>WEBP: <a href={img.webp} target="_blank" rel="noreferrer">{img.webp}</a></p>
              <p>Alt: {img.alt}</p>
              <img src={img.webp || img.jpeg} alt={img.alt} style={{ width: "150px" }} />
            </div>
          ))}
        </div>
      </section>

      {/* Formulario crear producto */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label>Nombre:</label>
          <input {...register("name", { required: true })} />
          {errors.name && <span style={{ color: "red" }}>El nombre es obligatorio</span>}
        </div>

        <div>
          <label>Descripción:</label>
          <textarea {...register("description")} />
        </div>

        <div>
          <label>Precio:</label>
          <input {...register("price", { required: true })} />
          {errors.price && <span style={{ color: "red" }}>El precio es obligatorio</span>}
        </div>

        <div>
          <label>Stock:</label>
          <input type="number" {...register("stock")} defaultValue={10} />
        </div>

        <div>
          <label>Categoría:</label>
          <Select
            options={categoryOptions}
            onChange={(selected) => setValue("categoryId", selected.value)}
          />
          {errors.categoryId && <span style={{ color: "red" }}>Seleccioná una categoría</span>}
        </div>

        <button type="submit" style={{ padding: "8px 12px", marginTop: "10px" }}>Crear Producto</button>
      </form>
    </div>
  );
};

export default CrearProducto;
