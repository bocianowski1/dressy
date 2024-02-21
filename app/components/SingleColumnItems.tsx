import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useLikedItems } from "../hooks/liked-items";
import type { Clothing } from "../constants/types";
import Colors from "../constants/Colors";
import { useRouter } from "expo-router";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { useCart } from "../hooks/cart";

const SingleColumnItems = ({
  clothing,
  isLikes,
  isCart,
  paddingBottom,
}: {
  clothing: Clothing[];
  isLikes?: boolean;
  isCart?: boolean;
  paddingBottom?: number;
}) => {
  const { updateLikedItems, likedItems } = useLikedItems();
  const { addToCart, removeFromCart, getItemCount } = useCart();
  const router = useRouter();
  return (
    <>
      {clothing.length === 0 && (
        <Text
          style={{
            color: Colors.lightGray,
            paddingHorizontal: 16,
            marginTop: -36,
          }}
        >
          Not much to see here...
        </Text>
      )}
      <SafeAreaView style={{ paddingHorizontal: 14 }}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom:
              paddingBottom || Dimensions.get("window").height * 0.25,
          }}
          showsVerticalScrollIndicator={false}
        >
          {clothing.map((c) => {
            return (
              <View
                key={c.id}
                style={{
                  width: Dimensions.get("window").width - 30,
                  gap: 10,
                  marginBottom: 28,
                  marginHorizontal: "auto",
                  flexDirection: "row",
                  backgroundColor: Colors.backgroundColorMenu,
                  borderRadius: 20,
                  borderColor: Colors.backgroundColorItem,
                  borderWidth: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/listing/${c.id}`)}
                  style={{
                    width: 180,
                    position: "relative",
                    borderColor: Colors.backgroundColorItem,
                    borderRightWidth: 1,
                    height: 220,
                  }}
                >
                  <Image
                    source={c.source}
                    style={{
                      width: "100%",
                      height: 220,
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                  />
                  {isLikes && (
                    <TouchableOpacity
                      onPress={() => updateLikedItems(c)}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: Colors.backgroundColorItem,
                        borderRadius: 20,
                        padding: 10,
                      }}
                    >
                      {likedItems.includes(c) ? (
                        <Ionicons name="heart" size={22} color={"red"} />
                      ) : (
                        <Ionicons
                          name="heart-outline"
                          size={22}
                          color={Colors.white}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    width: "45%",
                    paddingTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: c.font?.fontSize,
                      color: Colors.white,
                      fontWeight: "600",
                      fontFamily: c.font?.fontFamily,
                    }}
                  >
                    {c.title}
                  </Text>
                  <Text style={{ color: Colors.lightGray, fontSize: 14 }}>
                    {c.collection} Collection
                  </Text>
                  <Text
                    style={{
                      color: "lightgreen",
                      fontSize: 20,
                      fontWeight: "600",
                    }}
                  >
                    ${c.price}.00
                  </Text>
                  {isLikes && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.white,
                        width: "90%",
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 14,
                        marginTop: "auto",
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ fontWeight: "800" }}>Buy now</Text>
                    </TouchableOpacity>
                  )}
                  {isCart && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "80%",
                        borderRadius: 50,
                        justifyContent: "space-between",
                        paddingVertical: 14,
                        marginTop: "auto",
                        marginBottom: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => removeFromCart(c)}
                        style={{
                          backgroundColor: Colors.backgroundColorItem,
                          borderRadius: 20,
                          height: 40,
                          width: 40,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SimpleLineIcons
                          name="minus"
                          size={22}
                          color={Colors.white}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontWeight: "800",
                          color: Colors.white,
                          fontSize: 18,
                        }}
                      >
                        {`${getItemCount(c)}`}
                      </Text>
                      <TouchableOpacity
                        onPress={() => addToCart(c)}
                        style={{
                          backgroundColor: Colors.backgroundColorItem,
                          borderRadius: 20,
                          height: 40,
                          width: 40,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SimpleLineIcons
                          name="plus"
                          size={22}
                          color={Colors.white}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SingleColumnItems;
