import { User } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export async function getAuth() {
  const router = useRouter();
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      throw new Error("No token found");
    }

    const userString = await AsyncStorage.getItem("user");

    if (!userString) {
      console.log("No user found");
      throw new Error("No user found");
    }

    const user = JSON.parse(userString) as User;

    return { token, user };
  } catch (error) {
    console.error(error);
    router.push("/(modals)/login");
  }
}

export async function login(username: string, password: string) {
  // const router = useRouter();
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_USERS_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.status !== 200) {
      console.error(response.statusText);
      console.error(response.status);
      return false;
    }

    const { token, user } = await response.json();

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    console.log("Login successful");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  const router = useRouter();
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.push("/(modals)/login");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
