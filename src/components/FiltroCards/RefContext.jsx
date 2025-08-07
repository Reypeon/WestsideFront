import React, { createContext, useContext, useRef } from 'react';

const RefContext = createContext();

export const RefProvider = ({ children }) => {
    const filtrosContainerRef = useRef(null);

    return (
        <RefContext.Provider value={filtrosContainerRef}>
            {children}
        </RefContext.Provider>
    );
};

export const useRefContext = () => {
    return useContext(RefContext);
};
// referencias todavia no lo uso pero lo voy a dejar porsi
//Este componente define y exporta un contexto de React
// para compartir una referencia (ref) a un elemento DOM (filtrosContainerRef) 
// entre distintos componentes, sin tener que pasarla manualmente por props.