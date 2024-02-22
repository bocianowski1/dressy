import { styles } from "../../constants/styles";
import React from "react";
import { SafeAreaView } from "react-native";
import Header from "../../components/Header";

const Likes = () => {
  return (
    <SafeAreaView style={styles.main}>
      <Header title="Chat" />
    </SafeAreaView>
  );
};

export default Likes;
