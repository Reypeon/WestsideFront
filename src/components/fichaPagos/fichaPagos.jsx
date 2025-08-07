import s from "./fichaPagos.module.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";


const FichaPagos = ({ stateFcha }) => {
  const [methods, setMethods] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [metodopagoID, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState(9000); // Monto inicial

  const apiUrl = import.meta.env.VITE_API_URL;

  // Obtener métodos de pago
  const axiosPaymentMethods = useCallback(async () => {
    if (methods.length > 0) return;  // Si ya tienes métodos, no haces la petición.
    try {
      const { data } = await axios.get(`${apiUrl}/api/metodos-pagos`);
      setMethods(data);
      
    } catch (error) {
      console.error("❌ Error obteniendo los métodos de pago:", error.response?.data || error.message);
    }
  }, [methods]);

  // Obtener cuotas según método seleccionado
  const axiosInstallments = useCallback(async () => {
    if (!metodopagoID || !amount) return;
    try {
      const { data } = await axios.get(`${apiUrl}/api/cuotas`, {
        params: {
          amount: parseFloat(amount),
          metodopagoID: metodopagoID,
        },
      });
      setInstallments(data?.[0]?.payer_costs || []);
    } catch (error) {
      console.error("❌ Error obteniendo cuotas:", error.response?.data || error.message);
    }
  }, [metodopagoID, amount]);



  useEffect(() => {
    // if(stateFcha.status == true)setAmount(stateFcha.characterProp)
    axiosPaymentMethods();
  }, [axiosPaymentMethods]);


  useEffect(() => {
    if (metodopagoID && amount) {
      axiosInstallments();
    }
  }, [metodopagoID, amount, axiosInstallments]);

  // Evitar métodos duplicados
  const uniqueMethods = [...new Map(methods.map(m => [m.id, m])).values()];
  // filtar tarjetas debit y credit
  const getFilteredMethods = (methods) => {
    const debitCards = methods.filter(met => met.payment_type_id === "debit_card");
    const creditCards = methods
      .filter(met => met.payment_type_id === "credit_card")
      .sort((a, b) => a.name.localeCompare(b.name));

    return { debitCards, creditCards };
  };

  const { debitCards, creditCards } = getFilteredMethods(uniqueMethods);
  // Cambiar método de pago

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setInstallments(<h1>Cargando</h1>); // Limpiamos para que se vea el loading o el nuevo set

  };
  useEffect(() => {
    if (creditCards.length > 0 && !metodopagoID) {
      setSelectedMethod(creditCards[0].id);
    }
  }, [creditCards, metodopagoID]);
  const amontArg =
   `$` + new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return (
    <div className={s.headerFichapagos}>
      
      {stateFcha && stateFcha.status == true ? (
        <div>

          {/* <section className={s.paymentSection}>
            <h3 className={s.sectionTitle}>Tarjetas de Débito</h3>
            <ul className={s.methodsList}>
              {debitCards.map((method) => (
                <li key={method.id} className={s.methodItem}>
                  <div className={s.methodHeader}>
                    <img
                      src={method.secure_thumbnail}
                      alt={method.name}
                      className={s.methodImage}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section> 
          
          */}
          <h1 className={s.h1Header}>Medios de Pagos</h1>
          <section className={s.boxTransfe}>
            <h1 className={s.titleTrasfe}>Transferencia o depósito bancario</h1>
            <span className={s.boxIcon}>
              <span className={s.icon}>ICON billete </span>
              <h2 className={s.h2Transfe}>5% de descuento pagando con Transferencia o depósito bancario</h2>
            </span>
            <div className={s.amountTransfe}>
              Total: <span className={s.strike}> {amontArg}</span> $
              {new Intl.NumberFormat('es-AR', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(amount - amount * 0.05)}
            </div>
            <h3 className={s.h3Transfe}>El descuento será aplicado sobre el costo total de la compra (sin envío) al finalizar la misma.</h3>
          </section>

          <section className={s.boxCredit}>
            <h4 className={s.sectionTitle}>Tarjetas de Crédito</h4>
            <span className={s.SPANsubtitle}>Seleccioná tarjeta para ver opciones de pago</span>
            
            <ul className={s.methodsList}>
              {creditCards.map((method) => (
                <li key={method.id} 
                      className={`${s.boxItem} ${metodopagoID === method.id ? s.active : ''}`}
                      onClick={() => handleSelectMethod(method.id)}>
                    <img
                      src={method.secure_thumbnail}
                      alt={method.name}
                      className={s.methodImage}
                    />
                </li>
              ))}
            </ul>


            {creditCards.map((method) => metodopagoID === method.id ? (
                <div className={s.cuotasBox} key={`installments-${method.id}`}>
                  <h4 className={s.TboxCuotas} >Cuotas Disponibles:</h4>
                  <h5 className={s.nameMethod}>{method.name}</h5>

                {installments.length > 0 ? (
                  <ul className={s.cuotasList}>
                    <li className={s.cuotasLi}> 
                      <div>1 cuota de{" "}
                      <span className={s.amount}>&nbsp;{amontArg}</span>
                      </div>
                      <span className={s.totalAmount}>Total:&nbsp; {amontArg}</span>
                    </li>

                    {installments.slice(1).map((installment) => (
                      <li className={s.cuotasLi} key={installment.installments}>
                        <div>
                          {installment.installments} cuotas de{" "}
                          <span className={s.amount}>
                            {"$" + new Intl.NumberFormat('es-AR', {
                              style: 'decimal',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(installment.installment_amount)}
                          </span>
                        </div>
                        <span className={s.totalAmount}>
                          Total:{" "}
                          {new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(installment.installments * installment.installment_amount)}</span>
                      </li>
                    ))}

                  </ul>

                  ) : (
                    <p className={s.cuotasList}>Cargando....</p>
                  )}
                </div>
              ) : null
            )}
          </section>
            <section className={s.boxDebit}>
            <h3 className={s.sectionTitle}>Tarjetas de Débito</h3>
            <ul className={s.debitList}>
              {debitCards.map((method) => (
                <li key={method.id} className={s.boxItem}>
                    <img
                      src={method.secure_thumbnail}
                      alt={method.name}
                      className={s.methodImage}
                    />
                </li>
              ))}
            </ul>
            <div className={s.BoxAmountDebit}>
              <h4 className={s.h4amountDebit}>El precio es el mismo pagando con tarjeta de débito.</h4>
              <span className={s.totalAmountDebit}>Total: {amontArg}</span>

            </div>
 
            </section>
            
            <div className={s.blanco}>
            </div>

        </div>
      ) : (
        (() => {
          if (stateFcha && stateFcha.status == false && stateFcha.characterProp) {
            console.log("Condición de 'a' es 1")
            return
          } else {
            return <p>No hay datos disponibles</p>;
          }
        })()
      )
      }

    </div>
  );

};

export default FichaPagos;
