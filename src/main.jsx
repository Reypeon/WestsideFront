import React from 'react'
import ReactDOM from 'react-dom/client'
import'./main.module.css'
import App from './App.jsx'
// estado global del carrito
import { CartProvider } from './components/CartContext.jsx'; 
import { BrowserRouter } from "react-router-dom" 
//redux store
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist'
import {store } from './redux/store'

const persistor = persistStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <App />
          </Provider>
        </PersistGate>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>


)
//npm install @reduxjs/toolkit react-redux
// npm install redux-persist // mantener la persistencia del almacenamiento 
//npm install react-icons
// iconos
//para mostrar los graficos de la tabla en admin.jsx
// npm install chart.js react-chartjs-2
//muchos idomas libreria react

//animaciones
//npm install framer-motion
//npm install @motionone/utils
// fin animaciones
//npm install react-whatsapp-widget
//npm install --save-dev rollup-plugin-visualizer



//hacer npm install @react-three/drei@latest @react-three/fiber@latest






