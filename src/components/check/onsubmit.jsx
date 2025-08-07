// file: services/orderService.js (o donde prefieras)
 async function handleOrderSubmit(data, cartItems, apiUrl) {
  if (cartItems.length === 0) {
    throw new Error("El carrito está vacío");
  }

  const products = cartItems.map((item) => ({
    productId: item.id,
    quantity: item.cantidad || 1,
    price: item.precioUnitario || item.price || 0,
  }));

  const paymentMethodMap = {
    Transferencia: "credit_card",
    MercadoPago: "paypal",
    Efectivo: "cash",
  };

  const deliveryTypeMap = {
    "Entrega estándar": "standard",
    "Entrega anticipada": "express",
  };

  const payload = {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    storeName: data.storeName?.trim() || "",
    paymentMethod: paymentMethodMap[data.paymentMethod],
    deliveryType: deliveryTypeMap[data.deliveryType],
    products,
    userId: null, // opcional
  };

  const response = await fetch(`${apiUrl}/ordenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al enviar la orden");
  }

  return response.json();
}




//   const [open, setOpen] = useState(false);
//   const toggleOpen = () => setOpen((prev) => !prev);
//   const { openCart } = useCart();
// import { useCart } from "../CartContext.jsx";

        // {/* Detalles del pedido */}
        // <span className={s.carform} onClick={toggleOpen}>
        //   Ver detalles del pedido &rarr;
        // </span>
        // <div className={`${s.boxDetailscheck} ${!open ? s.boxDetailscheckNull : ""}`}>
        //   <span className={s.Xdetalles} onClick={toggleOpen}>
        //     X
        //   </span>

        //   <section className={s.entregaSection}>
        //     <div className={s.carritoCheck}>
        //       ¿Querés revisar tu pedido?
        //       <div className={s.boxrevisar}>
        //         <span className={s.CartCheck} onClick={openCart}>
        //           Hacé clic en el carrito &rarr;
        //         </span>
        //         <p>
        //           En esta sección vas a poder visualizar todos los productos que agregaste
        //           al carrito, sus cantidades, precios y detalles.
        //         </p>
        //       </div>
        //     </div>

        //     <h2 className={s.title}>🚚 Política de Entregas</h2>
        //     <p className={s.intro}>
        //       En nuestro mayorista de artículos electrónicos trabajamos con una logística
        //       planificada para ofrecerte{" "}
        //       <strong>los mejores precios y un servicio eficiente</strong>.
        //       <br />
        //       Por eso implementamos el siguiente sistema de entregas:
        //     </p>

        //     <div className={s.entregaBox}>
        //       <h3 className={s.subTitle}>📦 Entregas estándar</h3>
        //       <p>✔️ Durante la <strong>primera semana de cada mes</strong>.</p>
        //       <p>✔️ <strong>Sin costo adicional</strong>.</p>
        //       <p>✔️ Ideal para aprovechar precios mayoristas.</p>
        //     </div>

        //     <div className={s.entregaBox}>
        //       <h3 className={s.subTitle}>⚡ Entregas anticipadas (con recargo)</h3>
        //       <p>✔️ Disponibles <strong>bajo solicitud</strong>.</p>
        //       <p>✔️ Costo según <strong>zona y tiempo</strong>.</p>
        //       <p className={s.importante}>
        //         🛎️ <strong>Importante:</strong> los pedidos urgentes se coordinan manualmente.
        //       </p>
        //     </div>
        //   </section>
        // </div>