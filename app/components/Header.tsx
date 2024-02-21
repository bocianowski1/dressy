import { View, Text, Dimensions } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

const Header = ({
  title,
  children,
  column,
  font,
}: {
  title: string;
  children?: React.ReactNode;
  column?: boolean;
  font?: {
    fontSize?: number;
    fontFamily?: string;
  };
}) => {
  return (
    <View
      style={{
        flexDirection: column ? "column" : "row",
        justifyContent: "space-between",
        alignItems: column ? "flex-start" : "center",
        paddingHorizontal: Dimensions.get("window").width * 0.04,
        paddingVertical: Dimensions.get("window").height * 0.025,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: font?.fontSize || 22,
          fontFamily: font?.fontFamily || "roboto",
          color: Colors.white,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
};

export default Header;
