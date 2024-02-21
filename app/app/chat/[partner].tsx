import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWebSocket } from "../../hooks/socket-context";
import { Message } from "../../constants/types";
import { useUser } from "../../hooks/user-context";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Chat() {
  const router = useRouter();
  const { user, token } = useUser();
  const [lastIndexThisUser, setLastIndexThisUser] = useState(-1);
  const [lastIndexOtherUser, setLastIndexOtherUser] = useState(-1);
  const [messageInput, setMessageInput] = useState("");
  const { messages, sendMessage } = useWebSocket();
  const { partner } = useLocalSearchParams();

  useEffect(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === user?.username) {
        setLastIndexThisUser(i);
        break;
      }
    }

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === partner) {
        setLastIndexOtherUser(i);
        break;
      }
    }
  }, [messages, user?.username, partner]);

  const send = () => {
    console.log("Sending message:", messageInput);
    if (messageInput) {
      sendMessage({
        sender: user?.username,
        content: messageInput,
        receiver: partner,
      } as Message);

      setMessageInput("");
    }
  };

  if (!user) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "gray",
        }}
      >
        <TouchableOpacity onPress={() => router.push("/(tabs)/chat")}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          {/* <Text style={{ fontWeight: "bold" }}>
            <Link to={`/auth/profile/${otherUser}`}>{otherUser}</Link>
          </Text> */}
          <Text style={{ fontSize: 12, color: "gray" }}>
            You are {user?.username}
          </Text>
        </View>
        <View />
      </SafeAreaView>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, flexDirection: "column-reverse", padding: 8 }}
        >
          {messages.map((message, idx) => {
            const isThisUser = message.sender === user?.username;

            return (
              <View
                key={`${message.ID}${idx}`}
                style={{ flexDirection: isThisUser ? "row-reverse" : "row" }}
              >
                <View
                  style={{
                    marginRight: isThisUser ? 0 : "auto",
                    marginLeft: isThisUser ? "auto" : 0,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: isThisUser ? "blue" : "gray",
                      alignSelf: isThisUser ? "flex-end" : "flex-start",
                      borderRadius: 20,
                      padding: 10,
                    }}
                  >
                    <Text style={{ color: isThisUser ? "white" : "black" }}>
                      {message.content}
                    </Text>
                    <View style={{ flexDirection: "column" }}>
                      {lastIndexOtherUser === idx && !isThisUser && (
                        <Text style={{ color: "gray", fontSize: 12 }}>
                          {partner}
                        </Text>
                      )}
                      {(lastIndexOtherUser === idx ||
                        lastIndexThisUser === idx) && (
                        <Text style={{ color: "black", fontSize: 12 }}>
                          {formatDate(message.CreatedAt)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row-reverse",
              padding: 8,
              borderTopWidth: 1,
              borderTopColor: "gray",
            }}
          >
            <TouchableOpacity onPress={() => send()}>
              <Ionicons name="paper-plane" size={24} />
            </TouchableOpacity>
          </View>
          <TextInput
            value={messageInput}
            onChangeText={(text) => setMessageInput(text)}
            style={{ padding: 8, backgroundColor: "lightgray", minHeight: 100 }}
            autoFocus
            multiline
            onSubmitEditing={() => send()}
          />
        </View>
      </View>
    </>
  );
}

function formatDate(input: string): string {
  const inputDate = new Date(input);

  if (isNaN(inputDate.getTime())) {
    return "Now";
  }

  const now = new Date();
  const diff = now.getTime() - inputDate.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  // Formatting based on the time difference
  if (minutes < 60) {
    if (minutes < 1) {
      return "Now";
    } else if (minutes === 1) {
      return "1 minute ago";
    } else return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return inputDate.toLocaleDateString();
  }
}
