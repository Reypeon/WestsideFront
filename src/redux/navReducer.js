// navSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false, // cerrado por defecto
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    // Abre la barra lateral
    openNav: (state) => {
      state.isOpen = true;
    },
    // Cierra la barra lateral
    closeNav: (state) => {
      state.isOpen = false;
    },
    // Alterna entre abierto y cerrado
    toggleNav: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

// Exportar acciones
export const { openNav, closeNav, toggleNav } = navSlice.actions;

// Selector para usar en componentes
export const selectorNav = (state) => state.nav.isOpen;

// Exportar reducer
export default navSlice.reducer;
