import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Animated } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Colors from "../../constants/Colors";
import { styles } from "../../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { clothing } from "../../data";
import BrowseCollections from "../../components/BrowseCollections";
import LikeButton from "../../components/LikeButton";
import AddButton from "../../components/AddButton";
import { useLikedItems } from "../../hooks/liked-items";
import type { Clothing } from "../../constants/types";

const Page = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [sort, setSort] = useState(false);
  const router = useRouter();
  const { likedItems } = useLikedItems();
  const [items, setItems] = useState<Clothing[]>(clothing);

  useEffect(() => {
    if (sort) {
      const sortedItems = clothing.sort((a, b) => a.price - b.price);
      setItems(sortedItems);
    } else {
      const sortedItems = clothing.sort((a, b) => b.price - a.price);
      setItems(sortedItems);
    }
  }, [sort]);

  const browseCollectionsHeight = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [310, 0],
    extrapolate: "clamp",
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView style={styles.main}>
      <Animated.View
        style={{ height: browseCollectionsHeight, overflow: "hidden" }}
      >
        <BrowseCollections />
      </Animated.View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 22, color: Colors.white }}>Popular</Text>
        <TouchableOpacity
          onPress={() => setSort(!sort)}
          style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
        >
          <Text
            style={{ fontSize: 16, color: Colors.primary, fontWeight: "600" }}
          >
            {sort ? "Price: Low to High" : "Price: High to Low"}
          </Text>
          <MaterialCommunityIcons
            name={sort ? "sort-ascending" : "sort-descending"}
            size={22}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
      <SafeAreaView
        style={{
          height: Dimensions.get("window").height - 200,
          paddingHorizontal: 14,
        }}
      >
        <Animated.ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignItems: "center",
            paddingBottom: Dimensions.get("window").height * 0.15,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {items.map((c, i) => {
            return (
              <View
                key={c.id}
                style={{
                  width: Dimensions.get("window").width / 2 - 30,
                  gap: 10,
                  marginBottom: 24,
                  position: "relative",
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/listing/${c.id}`)}
                  style={{
                    borderRadius: 20,
                    height: 220,
                    backgroundColor: Colors.backgroundColorMenu,
                  }}
                >
                  <Image
                    source={c.source}
                    style={{
                      width: "100%",
                      height: 220,
                      borderRadius: 20,
                    }}
                  />
                </TouchableOpacity>
                <LikeButton clothingItem={c} />
                <AddButton clothingItem={c} />
                <View
                  style={{
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: "600",
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
                </View>
              </View>
            );
          })}
        </Animated.ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default Page;
