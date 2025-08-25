import { useEffect, useRef, useState } from "react";
import { createWs } from "../configs/services/http-ws-config";
import type { Message, WsProp } from "../configs/types";
import { WSContext } from "./WsContext.tsx";

export function WSProvider({ token, children }: WsProp) {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const callbacks = useRef<((msg: Message) => void)[]>([]);

  useEffect(() => {
    if (!token) return;

    ws.current = createWs(token);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log("✅ WS conectado!");
    };
    ws.current.onclose = () => {
      setIsConnected(false);
      console.log("❌ WS desconectado!");
    };

    ws.current.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);

        callbacks.current.forEach((cb) => cb(message));
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    return () => {
      if (
        ws.current?.readyState === WebSocket.OPEN ||
        ws.current?.readyState === WebSocket.CONNECTING
      ) {
        ws.current?.close();
        console.log("❌ WS desconectado!");
      }
    };
  }, [token]);

  const sendMessage = (msg: string, chatId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ action: "sendMessage", chatId, content: msg })
      );
    }
  };
  const NewChat = (msg: string, chatId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ action: "newChat", chatId, content: msg })
      );
    }
  };
  const GetWsChats = (msg: string, chatId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ action: "getHistory", chatId, content: msg })
      );
    }
  };

  const subscribe = (cb: (msg: Message) => void) => {
    callbacks.current.push(cb);

    return () => {
      callbacks.current = callbacks.current.filter((fn) => fn !== cb);
    };
  };

  return (
    <WSContext.Provider
      value={{
        ws: ws.current,
        isConnected,
        sendMessage,
        NewChat,
        GetWsChats,
        subscribe,
      }}
    >
      {children}
    </WSContext.Provider>
  );
}
