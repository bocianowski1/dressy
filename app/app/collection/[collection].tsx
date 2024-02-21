import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { clothing } from "../../data";
import { styles } from "../../constants/styles";
import Header from "../../components/Header";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Collections = () => {
  const { collection } = useLocalSearchParams<{ collection: string }>();
  const title =
    collection.charAt(0).toUpperCase() + collection.slice(1) + " Collection";
  const filteredClothing = clothing.filter(
    (c) => c.collection.toLowerCase() === collection.toLowerCase()
  );
  const router = useRouter();
  return (
    <SafeAreaView style={styles.main}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }} // same as header
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color={Colors.white}
          />
        </TouchableOpacity>
        <Header
          title={title}
          font={{
            fontFamily: collection,
            fontSize: 28,
          }}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 14,
          marginTop: -20,
        }}
      >
        <Text style={{ color: Colors.white, fontWeight: "600" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere qui
          nam culpa ab autem dolor exercitationem ex molestiae, nesciunt
          provident mollitia nulla nostrum! Facere qui nam culpa ab autem dolor
          exercitationem ex molestiae, nesciunt provident mollitia nulla
          nostrum! {filteredClothing.length}
        </Text>
      </View>
      <SafeAreaView style={{ paddingHorizontal: 14, marginTop: 20 }}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: Dimensions.get("window").height * 0.4,
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {filteredClothing.map((c) => (
            <View key={c.id}>
              <Text
                style={{
                  fontFamily: c.font?.fontFamily,
                  fontSize: 22,
                  color: Colors.white,
                  marginBottom: 4,
                }}
              >
                {c.title}
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/listing/${c.id}`)}
                style={{
                  width: Dimensions.get("window").width - 30,
                  gap: 10,
                  marginBottom: 10,
                  marginHorizontal: "auto",
                  flexDirection: "row",
                  backgroundColor: Colors.backgroundColorMenu,
                  borderRadius: 20,
                  borderColor: Colors.backgroundColorItem,
                  borderWidth: 1,
                }}
              >
                <Image
                  source={c.source}
                  style={{
                    width: "100%",
                    height: 220,
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                  }}
                />
              </TouchableOpacity>
              <Text style={{ color: Colors.lightGray }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
                qui nam culpa ab autem dolor exercitationem ex molestiae,
                nesciunt provident mollitia nulla nostrum!
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default Collections;
