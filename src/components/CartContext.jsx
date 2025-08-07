import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [boxCarritoGlobal, setBoxCarritoGlobal] = useState(false);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openCart = useCallback((global = false) => {
    setIsOpen(true);
    setBoxCarritoGlobal(global);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
    setBoxCarritoGlobal(false);
  }, []);
  // Estado loader global
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <CartContext.Provider
      value={{
        // carrito
         isOpen,
        boxCarritoGlobal,
        toggleCart,
        openCart,
        closeCart,
        // loader
        isLoading,
        startLoading,
        stopLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el contexto (carrito + loader)
export const useCart = () => useContext(CartContext);
