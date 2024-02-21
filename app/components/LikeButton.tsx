import { TouchableOpacity } from "react-native";
import React from "react";
import { Clothing } from "../constants/types";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLikedItems } from "../hooks/liked-items";

const LikeButton = ({ clothingItem }: { clothingItem: Clothing }) => {
  const { updateLikedItems, likedItems } = useLikedItems();
  return (
    <TouchableOpacity
      onPress={() => updateLikedItems(clothingItem)}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: Colors.backgroundColorItem,
        borderRadius: 20,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {likedItems.includes(clothingItem) ? (
        <Ionicons name="heart" size={24} color="red" />
      ) : (
        <Ionicons name="heart-outline" size={22} color={Colors.white} />
      )}
    </TouchableOpacity>
  );
};

export default LikeButton;
