import { styles } from "../../constants/styles";
import React from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Colors from "../../constants/Colors";
import SingleColumnItems from "../../components/SingleColumnItems";
import Header from "../../components/Header";
import { useCart } from "../../hooks/cart";
import { Ionicons } from "@expo/vector-icons";

const Cart = () => {
  const { cartItems, getCartTotal } = useCart();

  return (
    <SafeAreaView style={styles.main}>
      <Header
        title={`Your Cart (${cartItems.length})`}
        children={
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text style={{ color: Colors.primary, fontSize: 18 }}>
              Checkout
            </Text>
            <Ionicons
              name="ios-arrow-forward"
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        }
      />
      <SingleColumnItems
        clothing={cartItems}
        isCart
        paddingBottom={Dimensions.get("window").height * 0.4}
      />
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
          paddingBottom: Dimensions.get("window").height * 0.15,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: Dimensions.get("window").width * 0.9,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 22,
                fontWeight: "bold",
              }}
            >
              Total
            </Text>
            <Text
              style={{
                color: "lightgreen",
                fontSize: 22,
                fontWeight: "bold",
              }}
            >
              {`${getCartTotal()}`}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.white,
              borderRadius: 20,
              height: 50,
              width: Dimensions.get("window").width * 0.9,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Cart;
