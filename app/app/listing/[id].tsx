import { Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { styles } from "../../constants/styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Clothing } from "@/constants/types";
import { clothing } from "../../data";
import { useLikedItems } from "../../hooks/liked-items";
import { useCart } from "../../hooks/cart";

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [clothingItem, setClothingItem] = React.useState<Clothing | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string>("M");
  const router = useRouter();

  const { updateLikedItems, likedItems } = useLikedItems();
  const { getCartFormattedTotal } = useCart();

  useEffect(() => {
    const item = clothing.find((item) => `${item.id}` === id);
    if (!item) {
      router.back();
      return;
    }
    setClothingItem(item);
  }, [id]);

  return (
    <View style={styles.main}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color={Colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!clothingItem) return;
            updateLikedItems(clothingItem);
          }}
          style={{ padding: 10 }}
        >
          {clothingItem && likedItems.includes(clothingItem) ? (
            <MaterialCommunityIcons name="heart" size={26} color="red" />
          ) : (
            <MaterialCommunityIcons
              name="heart-outline"
              size={26}
              color={Colors.white}
            />
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: Dimensions.get("window").height,
        }}
      >
        <Image
          source={clothingItem?.source}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Colors.backgroundColorMenu,
          backdropFilter: "blur(40px)",
          width: "102%",
          marginHorizontal: "-1%",
          paddingVertical: Dimensions.get("window").height * 0.04,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderColor: Colors.darkGray,
          borderWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontSize: clothingItem?.font?.fontSize ?? 32,
              fontWeight: "600",
              fontFamily: clothingItem?.font?.fontFamily ?? "roboto",
            }}
          >
            {clothingItem?.title}
          </Text>
          <Text
            style={{ color: Colors.lightGray, fontSize: 14, fontWeight: "600" }}
          >
            {clothingItem?.collection} Collection
          </Text>
          <Text
            style={{
              color: "lightgreen",
              fontSize: 36,
              fontWeight: "400",
              marginTop: 10,
            }}
          >
            {getCartFormattedTotal(clothingItem?.price)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 100,
              width: "70%",
              marginHorizontal: "15%",
              marginTop: 20,
            }}
          >
            {["XS", "S", "M", "L"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedSize(item)}
                style={{
                  backgroundColor:
                    selectedSize === item
                      ? Colors.white
                      : Colors.backgroundColorMenu,
                  borderRadius: 50,
                  borderColor: Colors.lightGray,
                  borderWidth: 1,
                  width: 60,
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: selectedSize === item ? Colors.black : Colors.white,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.white,
              width: "85%",
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
              paddingVertical: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800" }}>Buy now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Details;
