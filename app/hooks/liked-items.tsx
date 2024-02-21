import { createContext, useContext, useState } from "react";
import type { Clothing } from "../constants/types";

const LikedItemsContext = createContext({
  likedItems: [] as Clothing[],
  updateLikedItems: (newLikedItems: Clothing, itemsToRemove?: Clothing[]) => {},
});

export const LikedItemsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [likedItems, setLikedItems] = useState<Clothing[]>([]);

  const updateLikedItems = (
    newLikedItem: Clothing,
    itemsToRemove?: Clothing[]
  ) => {
    if (likedItems.includes(newLikedItem)) {
      setLikedItems(likedItems.filter((item) => item !== newLikedItem));
      return;
    }
    if (itemsToRemove) {
      const newLikedItems = likedItems.filter((item) => {
        return !itemsToRemove.includes(item);
      });

      setLikedItems(newLikedItems);
    } else {
      setLikedItems([...likedItems, newLikedItem]);
    }
  };

  return (
    <LikedItemsContext.Provider value={{ likedItems, updateLikedItems }}>
      {children}
    </LikedItemsContext.Provider>
  );
};

export const useLikedItems = () => {
  return useContext(LikedItemsContext);
};
