import React, { useState } from "react";
import { useForm } from "react-hook-form";
import s from "./CheckoutForm.module.css";
import { selectorCarrito } from "../../redux/cartReducer.js";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useCart } from "../CartContext.jsx"
import Carrito from "../Carrito/Carrito.jsx";


const CheckoutForm = React.memo(() => {
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [submitError, setSubmitError] = useState(null);
  const cartItems = useSelector(selectorCarrito);
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onFormSubmit = async (data) => {
    if (data.extraField) return; // honeypot spam protection
    setSubmitStatus("loading");
    setSubmitError(null);
    const orderData = {
      ...data,
      products: cartItems.map(({ id, quantity, price }) => ({
        productId: id,
        quantity,
        price,
      })),
    };
    try {
      await axios.post(
        `${apiUrl}/api/ordenes`,
        orderData,
        { headers: { "Content-Type": "application/json" } }
      );
      // Axios lanza en catch si status no está en 2xx, así que no necesitas chequeo manual
      reset();
      setSubmitStatus("success");
    } catch (error) {
      // error.response contiene la respuesta del servidor, si existe
      const message = error.response?.data?.message || error.message || "Error inesperado al enviar el pedido";
      setSubmitStatus("error");
      setSubmitError(message);
    }
  };
  //carrito 
  const { openCart, boxCarritoGlobal } = useCart();

  return (
    <div className={s.headerCheck}>
      <div className={s.recorrido}>
        <span className={s.pasoActivo}>Elegir productos</span>
        <span className={s.flecha}>===&gt;</span>
        <span className={s.pasoActivo}>Llenar formulario</span>
        <span className={s.flecha}>===&gt;</span>
        <span className={s.pasoInactivo}>Confirmamos pedido mayorista</span>
      </div>
      <h1 className={s.titleFormulario}>LLENAR FORMULARIO</h1>

      <form
        className={s.form}
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
        autoComplete="off"
        aria-live="polite"
      >
      <div className={s.boxCarritoChech}>
        <span className={s.openCarritoCheck} onClick={() => openCart(true)}>Ver productos</span>
        {boxCarritoGlobal && <Carrito />}
      </div> 

        {/* Honeypot hidden field */}
        <input
          type="text"
          {...register("extraField")}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Nombre completo */}
        <label htmlFor="fullName" className={s.label}>
          Nombre completo*
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="Tu nombre completo"
          className={`${s.input} ${errors.fullName ? s.inputError : ""}`}
          {...register("fullName", {
            required: "El nombre completo es obligatorio",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
            maxLength: { value: 100, message: "Máximo 100 caracteres" },
            pattern: {
              value: /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/,
              message: "Solo letras y espacios",
            },
          })}
        />
        {errors.fullName && <p className={s.errorMessage}>{errors.fullName.message}</p>}

        {/* Email */}
        <label htmlFor="email" className={s.label}>
          Correo electrónico*
        </label>
        <input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          className={`${s.input} ${errors.email ? s.inputError : ""}`}
          {...register("email", {
            required: "El correo electrónico es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Formato de correo inválido",
            },
          })}
        />
        {errors.email && <p className={s.errorMessage}>{errors.email.message}</p>}

        {/* Teléfono */}
        <label htmlFor="phone" className={s.label}>
          Teléfono de contacto*
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="Ej: 1234567890"
          className={`${s.input} ${errors.phone ? s.inputError : ""}`}
          {...register("phone", {
            required: "El teléfono es obligatorio",
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo números",
            },
            minLength: { value: 7, message: "Número muy corto" },
            maxLength: { value: 15, message: "Número muy largo" },
          })}
        />
        {errors.phone && <p className={s.errorMessage}>{errors.phone.message}</p>}

        {/* Dirección */}
        <label htmlFor="address" className={s.label}>
          Dirección completa*
        </label>
        <textarea
          id="address"
          placeholder="Dirección de entrega"
          rows={3}
          className={`${s.textarea} ${errors.address ? s.inputError : ""}`}
          {...register("address", {
            required: "La dirección es obligatoria",
            minLength: { value: 5, message: "Dirección muy corta" },
            maxLength: { value: 250, message: "Dirección muy larga" },
          })}
        />
        {errors.address && <p className={s.errorMessage}>{errors.address.message}</p>}

        {/* Nombre del local (opcional) */}
        <label htmlFor="storeName" className={s.label}>
          Nombre del local (opcional)
        </label>
        <input
          id="storeName"
          type="text"
          placeholder="Nombre del local"
          className={`${s.input} ${errors.storeName ? s.inputError : ""}`}
          {...register("storeName", {
            maxLength: { value: 100, message: "Máximo 100 caracteres" },
          })}
        />
        {errors.storeName && <p className={s.errorMessage}>{errors.storeName.message}</p>}

        {/* Tipo de entrega */}
        <fieldset className={s.fieldset}>
          <legend className={s.label}>Tipo de entrega*</legend>
          {["Entrega estandar", "Entrega anticipada"].map((tipo) => (
            <label key={tipo} className={s.radioLabel}>
              <input
                type="radio"
                value={tipo}
                {...register("deliveryType", {
                  required: "Debes seleccionar un tipo de entrega",
                })}
              />
              {tipo}
            </label>
          ))}
        </fieldset>
        {errors.deliveryType && <p className={s.errorMessage}>{errors.deliveryType.message}</p>}

        {/* Medio de pago */}
        <fieldset className={s.fieldset}>
          <legend className={s.label}>Medio de pago*</legend>
          {["Transferencia", "MercadoPago", "Efectivo"].map((metodo) => (
            <label key={metodo} className={s.radioLabel}>
              <input
                type="radio"
                value={metodo}
                {...register("paymentMethod", {
                  required: "Debes seleccionar un medio de pago",
                })}
              />
              {metodo}
            </label>
          ))}
        </fieldset>
        {errors.paymentMethod && <p className={s.errorMessage}>{errors.paymentMethod.message}</p>}

        {/* Botón y mensajes de estado */}
        <button
          type="submit"
          className={s.submitButton}
          disabled={isSubmitting || submitStatus === "loading"}
          aria-busy={isSubmitting || submitStatus === "loading"}
        >
          {isSubmitting || submitStatus === "loading" ? "Enviando..." : "Enviar pedido"}
        </button>

        {submitStatus === "loading" && <p className={s.infoMessage}>Enviando formulario...</p>}
        {submitStatus === "success" && <p className={s.successMessage}>¡Formulario enviado con éxito!</p>}
        {submitStatus === "error" && <p className={s.errorMessage}>{submitError}</p>}
      </form>
    </div>
  );


});

export default CheckoutForm;
