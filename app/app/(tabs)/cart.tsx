import { styles } from "../../constants/styles";
import React, { useState, useEffect } from "react";
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

import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import type { SetupParams } from "@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet";

const Cart = () => {
  const [ready, setReady] = useState(false);
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();
  const { cartItems, getCartTotal, getCartFormattedTotal, clearCart } =
    useCart();

  useEffect(() => {
    initializePaymentSheet();
  }, [cartItems, getCartTotal]);

  async function initializePaymentSheet() {
    const { paymentIntent, ephemeralKey, customerId } =
      await fetchPaymentSheetParams();

    if (paymentIntent === undefined) {
      console.log("Payment intent is undefined");
      return;
    }

    if (!paymentIntent || !ephemeralKey || !customerId) {
      console.log(
        "Error fetching payment sheet params",
        paymentIntent,
        ephemeralKey,
        customerId
      );
      return;
    }

    const { error } = await initPaymentSheet({
      // customerId: customerId,
      // customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        address: {
          country: "NO",
        },
      },
      appearance: {
        font: {
          scale: 1.1,
        },
        colors: {
          background: "#1f1f1f",
          componentBorder: Colors.white,
          primaryText: Colors.white,
          secondaryText: Colors.white,
        },
        primaryButton: {
          colors: {
            background: Colors.primary,
          },
        },
      },
      // returnURL: "dressy://profile",
    } as SetupParams);

    if (error) {
      console.log("Error initializing payment sheet");
    } else {
      setReady(true);
    }
  }

  async function fetchPaymentSheetParams() {
    // @ts-ignore
    const price = getCartTotal() * 100;
    if (price === 0) {
      console.log("Price is 0");
      return {
        paymentIntent: null,
        ephemeralKey: null,
        customerId: null,
      };
    }
    try {
      const response = await fetch(
        "http://192.168.10.151:5555/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: "123",
            price,
          }),
        }
      );

      const {
        payment_intent: paymentIntent,
        customer_id: customerId,
        ephemeral_key: ephemeralKey,
      } = await response.json();

      return {
        paymentIntent,
        ephemeralKey,
        customerId,
      };
    } catch (e) {
      console.log("Error fetching payment sheet params", e);
      return {
        paymentIntent: null,
        ephemeralKey: null,
        customerId: null,
      };
    }
  }

  async function pay() {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log("Error paying", error);
    } else {
      console.log("Success paying!!!");
      clearCart();
    }
  }

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
    >
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
              onPress={pay}
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
          clothing={cartItems.map((ci) => ci.item)}
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
                {`${getCartFormattedTotal()}`}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor:
                  ready && !loading ? Colors.white : Colors.darkGray,
                borderRadius: 20,
                height: 50,
                width: Dimensions.get("window").width * 0.9,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
              onPress={pay}
              disabled={!ready || loading || getCartTotal() === 0}
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
    </StripeProvider>
  );
};

export default Cart;
