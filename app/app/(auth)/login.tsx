import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUser } from "../../hooks/user-context";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { styles } from "../../constants/styles";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { User } from "../../constants/types";
import Header from "../../components/Header";

const Login = () => {
  useWarmUpBrowser();

  const router = useRouter();
  const { updateUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  }, [errorMessage]);

  const login = async () => {
    if (!username || !password) {
      setErrorMessage("Please enter a username and password");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_USERS_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      console.log(response.status, "login");

      if (response.status !== 200) {
        console.error(response.statusText);
        console.error(response.status);
        setErrorMessage(`Login failed ${response.statusText}`);
        return;
      }

      const { token, user } = await response.json();

      console.log("token", token);
      console.log("user", user);

      if (!token || !user) {
        setErrorMessage("No token or user found");
        return;
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      updateUser(user, token);

      console.log("Login successful");
      router.replace("/(tabs)/");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // const authURL = `${process.env.EXPO_PUBLIC_GOOGLE_AUTH_URL}/auth/google`;
      const authURL = `http://localhost:6060/auth/google`;
      const redirectURI = AuthSession.makeRedirectUri({
        scheme: "dressy",
      });

      console.log("redirectURI", redirectURI);

      const response = await WebBrowser.openAuthSessionAsync(
        authURL,
        redirectURI
      );

      if (response.type !== "success") {
        console.error(response);
        setErrorMessage("Login failed");
        return;
      } else {
        const parts = response.url.split("?")[1];
        const email = parts.split("email=")[1].split("&")[0];
        const token = parts.split("access_token=")[1].split("&")[0];
        const name = parts.split("name=")[1].split("&")[0];
        const imageURL = parts.split("avatar_url=")[1];

        const user = {
          username: email?.split("@")[0] ?? "guest",
          name,
          email,
          imageURL,
        } as User;

        if (!token || !user) {
          setErrorMessage("No token or user found");
          return;
        }

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        updateUser(user, token);

        console.log("Login successful with Google");
        router.replace("/(tabs)/");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <Header title="Login" />
      <View style={styles.inputContainer}>
        <MaterialIcons name="alternate-email" size={24} color={Colors.white} />
        <View style={styles.innerInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            placeholderTextColor={Colors.lightGray}
            autoCapitalize="none"
            value={username}
            onChange={(e) => {
              setUsername(e.nativeEvent.text);
            }}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <SimpleLineIcons name="lock-open" size={24} color={Colors.white} />
        <View style={styles.innerInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor={Colors.lightGray}
            autoCapitalize="none"
            secureTextEntry={true}
            value={password}
            onChange={(e) => {
              setPassword(e.nativeEvent.text);
            }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              bottom: 10,
            }}
          >
            <Text style={{ color: Colors.primary }}>Forgot?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ color: "red" }}>{errorMessage}</Text>
      <View style={styles.buttonColumnContainer}>
        <TouchableOpacity
          onPress={login}
          style={{
            backgroundColor: Colors.primary,
            width: "90%",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            marginTop: "auto",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "800" }}>Login</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            width: "80%",
          }}
        >
          <View
            style={{
              flex: 1,
              height: 0.5,
              backgroundColor: Colors.lightGray,
            }}
          ></View>
          <Text style={{ textAlign: "center", color: Colors.darkGray }}>
            or
          </Text>
          <View
            style={{
              flex: 1,
              height: 0.5,
              backgroundColor: Colors.lightGray,
            }}
          ></View>
        </View>
        <TouchableOpacity
          onPress={loginWithGoogle}
          style={{
            backgroundColor: Colors.white,
            width: "90%",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            marginTop: "auto",
            marginBottom: 10,
            position: "relative",
          }}
        >
          <Image
            source={require("../../assets/images/google.png")}
            style={{
              width: 28,
              height: "auto",
              resizeMode: "contain",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: 8,
              top: 0,
              bottom: 0,
            }}
          />
          <Text style={{ fontWeight: "800" }}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text style={{ textAlign: "center", color: Colors.white }}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
          <Text style={{ color: Colors.primary }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
