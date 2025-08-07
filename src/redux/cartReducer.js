// cardSlice.js
// SEGUN CHAT GPT
import { createSlice } from '@reduxjs/toolkit';

const initialState ={
  cardsCarrito: ["No hay productos"],
  errors: null,  // Este campo almacenará el error si ocurre
}
const cardSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errors = action.payload;
    },
    addToCart: (state, action) => {
      try {
        // Intento de agregar producto al carrito
        state.cardsCarrito.push(action.payload);
      } catch (error) {
        state.errors = 'Error al agregar al carrito';
      }
    },
    removeFromCart: (state, action) => {
      try {
        state.cardsCarrito = state.cardsCarrito.filter(item => item.id !== action.payload);
      } catch (error) {
        state.errors = 'Error al eliminar del carrito';
      }
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      try {
        const item = state.cardsCarrito.find(item => item.id === id);
        if (item && quantity > 0) {
          item.quantity = quantity;
        } else if (item && quantity === 0) {
          state.cardsCarrito = state.cardsCarrito.filter(item => item.id !== id); // Elimina el item
        }
      } catch (error) {
        state.errors = 'Error al actualizar cantidad';
      }
    },
    
  }
});



export const { setError, addToCart, removeFromCart,updateCartItemQuantity } = cardSlice.actions;
export const selectorCarrito = (state) => state.cardSlice.cardsCarrito;
export default cardSlice.reducer;









// import { ADD_FAVORITE, DELETE_FAVORITE } from "./actions-type.js"
// // import { useSelector, useDispatch } from "react-redux";
// // import { useEffect} from "react";

// const initialState = {
//     myFavorites : [],
//     countmyFavorites : [],
// }
// console.log(initialState.countmyFavorites)  

// const reducer = ( state = initialState, action ) =>{ // agregando los personajes favoritos que vienen de la action payload

//     console.log(action)
//     switch (action.type) {
//         case ADD_FAVORITE:
//             return{
//                 ...state,
//                 myFavorites: [...state.myFavorites, action.payload],// si hay informacion, copiamos y agregamos, si no reemplazamos 
                
//             }
            
//         case DELETE_FAVORITE:
//             return{
//                 ...state,
//                 myFavorites: state.myFavorites.filter(char => char.id !== action.payload),
           
//             } 

//         default:
//             return{...state} 
//     }
// }