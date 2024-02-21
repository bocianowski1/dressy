import { TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import { useUser } from "../../hooks/user-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../constants/styles";
import Colors from "../../constants/Colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import Header from "../../components/Header";

const Profile = () => {
  const router = useRouter();
  const { user, updateUser } = useUser();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      updateUser(null);
      router.push("/(tabs)/");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <Header
        title={user?.email ?? "Profile"}
        children={
          <TouchableOpacity
            style={{
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
            }}
            onPress={logout}
          >
            <SimpleLineIcons name="logout" size={22} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      {/* <View
        style={{
          height: 100,
          width: 100,
        }}
      >
        <Image
          style={{
            height: 100,
            width: 100,
          }}
          source={require("../../assets/images/torger.jpeg")}
        />
      </View> */}
    </SafeAreaView>
  );
};

export default Profile;
