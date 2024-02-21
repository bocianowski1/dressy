import { createContext, useContext, useState } from "react";
import type { Clothing } from "../constants/types";

const CartContext = createContext({
  cartItems: [] as Clothing[],
  updateCart: (newClothing: Clothing, clothingToRemove?: Clothing[]) => {},
  addToCart: (newClothing: Clothing) => {},
  removeFromCart: (clothingToRemove: Clothing) => {},
  clearCart: () => {},
  getCartTotal: () => {},
  getItemCount: (item: Clothing) => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<Clothing[]>([]);
  const updateCart = (newClothing: Clothing, clothingToRemove?: Clothing[]) => {
    if (cartItems.includes(newClothing)) {
      setCartItems(cartItems.filter((item) => item !== newClothing));
      return;
    }
    if (clothingToRemove) {
      const newCartItems = cartItems.filter((item) => {
        return !clothingToRemove.includes(item);
      });

      setCartItems(newCartItems);
    } else {
      setCartItems([...cartItems, newClothing]);
    }
  };

  const addToCart = (newClothing: Clothing) => {
    if (!cartItems.includes(newClothing)) {
      setCartItems([...cartItems, newClothing]);
    }
  };

  const removeFromCart = (clothingToRemove: Clothing) => {
    if (cartItems.includes(clothingToRemove)) {
      setCartItems(cartItems.filter((item) => item !== clothingToRemove));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = (): string => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(total);
  };

  const getItemCount = (item: Clothing) => {
    return cartItems.filter((cartItem) => cartItem === item).length;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateCart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
