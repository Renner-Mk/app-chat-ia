// hooks/useWS.ts
import { useContext, useEffect } from "react";
import { WSContext } from "./WSContext";
import type { Message } from "../configs/types";

export function useWs(onMessage?: (msg: Message) => void) {
  const ctx = useContext(WSContext);

  useEffect(() => {
    if (!onMessage) return;
    const unsubscribe = ctx.subscribe(onMessage);
    return unsubscribe;
  }, [onMessage]);

  return ctx;
}
