import { Message, User } from "../constants/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./user-context";

const WebSocketContext = createContext({
  messages: [] as Message[],
  socket: null as WebSocket | null,
  sendMessage: (message: Message) => {},
  hasNewMessages: false,
  notify: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  useEffect(() => {
    console.log("Creating new WebSocket");

    try {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_MESSAGES_URL}/messages?user1=${user}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.status !== 200) {
            console.error(response.statusText);
            console.error(response.status);
            throw new Error(response.statusText);
          }

          const messages = await response.json();

          setMessages(messages);
        } catch (error) {
          console.error(error);
          throw error;
        }
      };

      if (user) fetchMessages();

      const newSocket = new WebSocket(
        process.env.WS_URL || "ws://localhost:9999/ws"
      );

      newSocket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      newSocket.onmessage = (event) => {
        const msg = event.data;
        if (typeof msg !== "string") return;

        console.log("Received message:", msg);

        let jsonMsg: Message;
        try {
          jsonMsg = JSON.parse(msg);
        } catch (e) {
          return;
        }

        setMessages((messages) => [...messages, jsonMsg]);

        notify();
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } catch (e) {
      console.log("Error creating WebSocket:", e);
    }
  }, []);

  function sendMessage(message: Message) {
    if (!message.sender || !message.receiver || !message.content) return;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  function notify(timeout: number = 2000) {
    setHasNewMessages(true);
    setTimeout(() => {
      setHasNewMessages(false);
    }, timeout);
  }

  return (
    <WebSocketContext.Provider
      value={{ messages, socket, sendMessage, hasNewMessages, notify }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
