import { Container } from "@mui/material";
import { useState } from "react";

type chatProp = {
  chatId: string;
  token: string;
};

export function ChatsField({ chatId, token }: chatProp) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
    <>
      <Container></Container>
    </>
  );
}
