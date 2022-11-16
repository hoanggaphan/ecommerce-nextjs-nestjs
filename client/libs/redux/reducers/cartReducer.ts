import { createSlice } from '@reduxjs/toolkit';
import { CartItemType } from '../../../types/index';
import type { AppState } from '../store';

type initialStateType = {
  cart: CartItemType[] | [];
  totalAmount: number;
};

const initialState: initialStateType = {
  cart: [],
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCart: (state, { payload }) => {
      state.cart = state.cart.filter((c) => payload.ids.includes(c.variantId));
      state.totalAmount = state.cart.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
    },
    addItemToCart: (state, { payload }) => {
      const index = state.cart.findIndex(
        (item: CartItemType) => item.variantId === payload.variantId
      );

      let newCart;
      if (index !== -1) {
        newCart = [...state.cart];
        newCart[index].quantity += payload.quantity;
      } else {
        newCart = [...state.cart, payload];
      }

      state.cart = newCart;
      state.totalAmount = newCart.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
    },
    removeItemFromCart: (state, { payload }) => {
      const index = state.cart.findIndex(
        (item: CartItemType) => item.variantId === payload.variantId
      );

      if (index !== -1) {
        const newCart = [...state.cart];
        newCart.splice(index, 1);

        state.cart = newCart;
        state.totalAmount = newCart.reduce(
          (prev, curr) => prev + curr.quantity,
          0
        );
      }
    },
    increaseAmount: (state, { payload }) => {
      state.cart = state.cart.map((i) => {
        if (i.variantId === payload.variantId) {
          i.quantity++;
        }
        return i;
      });
      state.totalAmount = state.cart.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
    },
    decreaseAmount: (state, { payload }) => {
      state.cart = state.cart.map((i) => {
        if (i.variantId === payload.variantId) {
          i.quantity--;
        }
        return i;
      });
      state.totalAmount = state.cart.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
    },
    clearCart: () => initialState,
  },
});

export const {
  updateCart,
  addItemToCart,
  increaseAmount,
  decreaseAmount,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions;

// example: `useSelector((state: RootState) => state.counter.value)`
export const selectCart = (state: AppState) => state.cart.cart;
export const selectTotalAmount = (state: AppState) => state.cart.totalAmount;

export default cartSlice.reducer;
