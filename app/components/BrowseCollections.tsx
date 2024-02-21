import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { collections } from "../data";
import Header from "./Header";
import { useRouter } from "expo-router";

const BrowseCollections = () => {
  const router = useRouter();
  const [curr, setCurr] = useState(0);

  const screenWidth = Dimensions.get("window").width;

  // @ts-ignore
  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollOffset / screenWidth);
    setCurr(currentIndex);
  };
  return (
    <>
      <Header
        title="Browse Collections"
        children={
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      <View style={{ flexDirection: "column", gap: 14, alignItems: "center" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          snapToInterval={screenWidth}
          snapToAlignment="center"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {collections.map((collection) => {
            const title = collection.title.toLowerCase().replace(" ", "-");
            return (
              <TouchableOpacity
                key={collection.id}
                onPress={() => router.push(`/collection/${title}`)}
                style={{
                  height: 200,
                  width: screenWidth,
                  borderRadius: 20,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    color: Colors.white,
                    fontSize: collection.font?.fontSize ?? 42,
                    fontWeight: "600",
                    fontFamily: collection.font?.fontFamily ?? "roboto",
                    zIndex: 100,
                  }}
                >
                  {collection.title}.
                </Text>
                <Image
                  source={collection.source}
                  style={{
                    width: "90%",
                    height: "100%",
                    borderRadius: 20,
                    backgroundColor: Colors.backgroundColorMenu,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          {[...Array(collections.length).keys()].map((num) => (
            <View
              key={num}
              style={{
                height: 6,
                width: 6,
                backgroundColor: num === curr ? Colors.white : Colors.lightGray,
                borderRadius: 50,
              }}
            />
          ))}
        </View>
      </View>
    </>
  );
};

export default BrowseCollections;
