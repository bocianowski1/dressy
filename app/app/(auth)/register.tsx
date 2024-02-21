import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useUser } from "../../hooks/user-context";
import { MaterialIcons, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { styles } from "../../constants/styles";

const Login = () => {
  const router = useRouter();
  const { updateUser } = useUser();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  }, [errorMessage]);

  const register = async () => {
    if (!username || !password) {
      setErrorMessage("Please enter a username and password");
      return;
    }

    if (
      password !== repeatPassword &&
      (password.length > 0 || repeatPassword.length > 0)
    ) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_USERS_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, name, password }),
        }
      );

      if (response.status !== 200) {
        console.error(response.statusText);
        console.error(response.status);
        setErrorMessage(`Registration failed ${response.statusText}`);
        return;
      }

      const { token, user } = await response.json();

      if (!token || !user) {
        setErrorMessage("No token or user found");
        return;
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      updateUser(user);

      console.log("Registration successful");
      router.replace("/(tabs)/");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons name="alternate-email" size={24} color="gray" />
        <View style={styles.innerInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            autoCapitalize="none"
            value={username}
            onChange={(e) => {
              setUsername(e.nativeEvent.text);
            }}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <SimpleLineIcons name="user" size={24} color="gray" />
        <View style={styles.innerInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.nativeEvent.text);
            }}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <SimpleLineIcons name="lock-open" size={24} color="gray" />
        <View style={styles.innerInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            autoCapitalize="none"
            value={password}
            secureTextEntry={true}
            onChange={(e) => {
              setPassword(e.nativeEvent.text);
            }}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="repeat" size={24} color="gray" />
        <View style={styles.innerInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Repeat Password"
            autoCapitalize="none"
            secureTextEntry={true}
            value={repeatPassword}
            onChange={(e) => {
              setRepeatPassword(e.nativeEvent.text);
            }}
          />
        </View>
      </View>
      <Text style={{ color: "red" }}>{errorMessage}</Text>
      <View style={styles.buttonColumnContainer}>
        <TouchableOpacity
          onPress={register}
          style={[
            styles.authButton,
            {
              backgroundColor: Colors.blue,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Register</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            width: "90%",
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
        <TouchableOpacity onPress={register} style={styles.authButton}>
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
          <Text>Continue with Google</Text>
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
        <Text style={{ textAlign: "center" }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={{ color: Colors.blue }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
