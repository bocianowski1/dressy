import { styles } from "../../constants/styles";
import { useLikedItems } from "../../hooks/liked-items";
import React from "react";
import { SafeAreaView } from "react-native";
import SingleColumnItems from "../../components/SingleColumnItems";
import Header from "../../components/Header";

const Likes = () => {
  const { likedItems } = useLikedItems();
  return (
    <SafeAreaView style={styles.main}>
      <Header title="Your Favourites" />
      <SingleColumnItems clothing={likedItems} isLikes />
    </SafeAreaView>
  );
};

export default Likes;
