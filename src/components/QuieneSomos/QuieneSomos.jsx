import React, { useState } from "react";
import s from "./QuieneSomos.module.css";

const QuieneSomos = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Acá podés integrar con tu backend o enviar a tu email
    console.log("Formulario enviado:", form);
    alert("¡Gracias por contactarnos!");
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className={s.container}>
      <section className={s.quienesSomos}>
        <h2 className={s.titulo}>Quiénes Somos?</h2>
        <p className={s.descripcion}>
          Somos un mayorista especializada en la distribución de artículos electrónicos. Ubicados en la ciudad de Trelew, en el corazón de la Patagonia argentina, ofrecemos soluciones tecnológicas de calidad a comercios, revendedores y emprendedores de toda la región.
        </p>
        <p className={s.descripcion}>
          Nuestro catálogo abarca desde auriculares, parlantes, cables y adaptadores, hasta productos para el hogar y conectividad. Trabajamos día a día para garantizar precios competitivos, atención personalizada y un servicio logístico eficiente.
        </p>
        <p className={s.descripcion}>
          Nos mueve la pasión por la tecnología, la confianza en el comercio local y el compromiso con nuestros clientes. Si estás buscando un proveedor confiable para tu negocio, estás en el lugar indicado.
        </p>
      </section>

      <section className={s.contacto}>
        <h2 className={s.titulo}>Contacto</h2>
        <form onSubmit={handleSubmit} className={s.form}>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
            className={s.input}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Tu correo electrónico"
            required
            className={s.input}
          />
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Escribí tu mensaje"
            rows="5"
            required
            className={s.textarea}
          ></textarea>
          <button type="submit" className={s.boton}>Enviar mensaje</button>
        </form>
      </section>
    </div>
  );
};

export default QuieneSomos;
