import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { User } from "../constants/types";
import { createContext, useContext, useState } from "react";

const UserContext = createContext({
  user: null as User | null,
  updateUser: (newUser: User | null, newToken?: string) => {},
  token: "",
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");

  const updateUser = (newUser: User | null, newToken?: string) => {
    setUser(newUser);
    if (newToken) setToken(newToken);
  };

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tokenFromStorage = await AsyncStorage.getItem("token");
        const userStringFromStorage = await AsyncStorage.getItem("user");

        if (!tokenFromStorage) {
          console.log("No token found");
          throw new Error("No token found");
        }

        if (!userStringFromStorage) {
          console.log("No user found");
          throw new Error("No user found");
        }

        const userParsed = JSON.parse(userStringFromStorage) as User;

        // await AsyncStorage.setItem("user", JSON.stringify(user));
        // await AsyncStorage.setItem("token", token);

        setUser(userParsed);
        setToken(tokenFromStorage);
      } catch (error) {
        console.error(error);
        console.log("Redirecting to login");
        router.push("/(auth)/login");
      }
    };

    fetchUser();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, updateUser, token }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
