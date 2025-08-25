import { createContext } from "react";
import type { Message } from "../configs/types";

export interface WSContextType {
  ws: WebSocket | null;
  isConnected: boolean;
  sendMessage: (msg: string, chatId: string) => void;
  NewChat: (msg: string, chatId: string) => void;
  GetWsChats: (msg: string, chatId: string) => void;
  subscribe: (cb: (msg: Message) => void) => () => void;
}

export const WSContext = createContext<WSContextType>({
  ws: null,
  isConnected: false,
  sendMessage: () => {},
  NewChat: () => {},
  GetWsChats: () => {},
  subscribe: () => () => {},
});
