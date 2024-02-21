import React from "react";
import { Tabs } from "expo-router";
import Colors from "../../constants/Colors";
import { Foundation, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Dimensions, View } from "react-native";

const Layout = () => {
  const marginHorizontal = Dimensions.get("window").width * 0.04;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.white,
        tabBarStyle: {
          backgroundColor: Colors.backgroundColorMenu,
          backdropFilter: "blur(40px)",
          zIndex: 100,
          position: "absolute",
          bottom: 30,
          marginHorizontal: Dimensions.get("window").width * 0.05,
          width: Dimensions.get("window").width * 0.9,
          borderRadius: 50,
          height: 70,
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabelStyle: {
            display: "none",
          },
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <IconWrapper
              children={<Foundation name="home" size={26} color={color} />}
              backgroundColor={
                focused ? Colors.white : Colors.backgroundColorItem
              }
              style={{ marginLeft: -marginHorizontal }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          tabBarLabelStyle: {
            display: "none",
          },
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <IconWrapper
              children={
                <Ionicons
                  name={focused ? "heart" : "heart-outline"}
                  size={focused ? 26 : 28}
                  color={color}
                />
              }
              backgroundColor={
                focused ? Colors.white : Colors.backgroundColorItem
              }
              style={{ marginHorizontal: marginHorizontal / 2 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarLabelStyle: {
            display: "none",
          },
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <IconWrapper
              children={
                <FontAwesome5 name="shopping-bag" size={26} color={color} />
              }
              backgroundColor={
                focused ? Colors.white : Colors.backgroundColorItem
              }
              style={{ marginHorizontal: marginHorizontal / 2 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabelStyle: {
            display: "none",
          },
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <IconWrapper
              children={<FontAwesome5 name="user" size={26} color={color} />}
              backgroundColor={
                focused ? Colors.white : Colors.backgroundColorItem
              }
              style={{ marginRight: -marginHorizontal }}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const IconWrapper = ({
  children,
  backgroundColor,
  style,
}: {
  children: React.ReactNode;
  backgroundColor: string;
  style?: { [key: string]: string | number };
}) => {
  return (
    <View
      style={[
        {
          backgroundColor,
          height: 60,
          width: 60,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          position: "relative",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Layout;
