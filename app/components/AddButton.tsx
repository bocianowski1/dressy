import { TouchableOpacity } from "react-native";
import React from "react";
import { Clothing } from "../constants/types";
import Colors from "../constants/Colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useCart } from "../hooks/cart";

const AddButton = ({ clothingItem }: { clothingItem: Clothing }) => {
  const { updateCart } = useCart();
  return (
    <TouchableOpacity
      onPress={() => updateCart(clothingItem)}
      style={{
        position: "absolute",
        top: 55,
        right: 10,
        backgroundColor: Colors.backgroundColorItem,
        borderRadius: 20,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SimpleLineIcons name="plus" size={22} color={Colors.white} />
    </TouchableOpacity>
  );
};

export default AddButton;
