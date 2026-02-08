// src/hooks/useSessionSocket.ts
import { useEffect } from "react";
import { Client, type Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL, SOCKET_URL } from "../../config/api_config";

export const useSessionSocket = (username: string, token: string | null, onUpdate: (sessions: any[]) => void) => {
  useEffect(() => {
    if (!username || !token) return;

    const socket = new SockJS(`${SOCKET_URL}/ws`); // change if using production
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("[WS]", str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("Connected to session WebSocket");
      // Subscribe to the user's session topic
      client.subscribe(`/topic/sessions/${username}`, (message: Message) => {
        const sessions = JSON.parse(message.body);
        onUpdate(sessions);
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [username, token, onUpdate]);
};
