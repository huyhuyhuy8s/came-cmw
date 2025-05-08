
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options?: string[];
  size?: string;
}

interface CartState {
  items: CartItem[];
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial state
const initialState: CartState = {
  items: [],
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      }
      
      return { ...state, items: [...state.items, action.payload] };
    }
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }
      
    case 'CLEAR_CART':
      return { ...state, items: [] };
      
    default:
      return state;
  }
};

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('came-cart');
    return savedCart ? JSON.parse(savedCart) : initialState;
  });
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('came-cart', JSON.stringify(state));
  }, [state]);
  
  // Cart actions
  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  const removeItem = (itemId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };
  
  const updateQuantity = (itemId: number, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: itemId, quantity },
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
