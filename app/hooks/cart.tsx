import { createContext, useContext, useState } from "react";
import type { Clothing } from "../constants/types";

interface CartItem {
  item: Clothing;
  count: number;
}

const CartContext = createContext({
  cartItems: [] as CartItem[],
  // updateCart: (
  //   newClothing: Clothing,
  //   count: number,
  //   clothingToRemove?: Clothing[]
  // ) => {},
  addToCart: (newClothing: Clothing) => {},
  removeFromCart: (clothingToRemove: Clothing) => {},
  clearCart: () => {},
  getCartTotal: () => 0 as number,
  getCartFormattedTotal: (amount?: number) => "" as string,
  getItemCount: (item: Clothing) => 0 as number,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const findCartItemIndex = (clothing: Clothing) =>
    cartItems.findIndex((ci) => ci.item.id === clothing.id);

  const addToCart = (newClothing: Clothing) => {
    const itemIndex = findCartItemIndex(newClothing);
    if (itemIndex > -1) {
      const newCartItems = [...cartItems];
      newCartItems[itemIndex].count += 1;
      setCartItems(newCartItems);
    } else {
      setCartItems([...cartItems, { item: newClothing, count: 1 }]);
    }
  };

  const removeFromCart = (clothingToRemove: Clothing) => {
    const itemIndex = findCartItemIndex(clothingToRemove);
    if (itemIndex > -1) {
      if (cartItems[itemIndex].count > 1) {
        const newCartItems = [...cartItems];
        newCartItems[itemIndex].count -= 1;
        setCartItems(newCartItems);
      } else {
        setCartItems(cartItems.filter((_, index) => index !== itemIndex));
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (sum, { item, count }) => sum + item.price * count,
      0
    );
  };

  const getCartFormattedTotal = (amount?: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    if (amount) {
      return formatter.format(amount);
    }
    const total = getCartTotal();
    return formatter.format(total);
  };

  const getItemCount = (item: Clothing) => {
    const cartItem = cartItems.find((ci) => ci.item.id === item.id);
    return cartItem ? cartItem.count : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartFormattedTotal,
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
