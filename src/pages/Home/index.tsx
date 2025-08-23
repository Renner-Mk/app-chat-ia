import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { Chat, Message } from "../../configs/types";
import { useNavigate } from "react-router";
import {
  CreateChat,
  DeleteChat,
  GetChats,
} from "../../configs/services/chats.service";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { createWs } from "../../configs/services/http-ws-config";

export function Home() {
  const navegate = useNavigate();
  // const [isConnected, setIsConnected] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [chatsData, setChatsData] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [inputChat, setInputChat] = useState("");
  const [messages, setMessages] = useState<Message>({
    chatId: "",
    content: [],
  });
  const ws = useRef<WebSocket | null>(null);

  const token = localStorage.getItem("token");
  if (!token) {
    navegate("/login");
    throw new Error("Token invalido");
  }

  useEffect(() => {
    const funcFeacth = async () => {
      // setLoading(true);
      try {
        const resp = await GetChats(token);
        console.log(resp);

        if (!resp.data) throw new Error(resp.message);

        setChatsData(resp.data);
      } catch (error) {
        // setLoading(false);
        console.log(error);
      } finally {
        // setLoading(false);
      }
    };

    funcFeacth();
  }, [token]);

  useEffect(() => {
    ws.current = createWs(token);

    ws.current.onopen = () => console.log("conectado");

    ws.current.onclose = () => console.log("WebSocket desconectado");
  }, [token]);

  useEffect(() => {
    if (!selectedChat || ws.current?.readyState !== WebSocket.OPEN) return;

    setMessages({
      chatId: "",
      content: [],
    });
    setInputChat("");

    ws.current.send(
      JSON.stringify({
        action: "getHistory",
        chatId: selectedChat,
        content: "",
      })
    );

    const handleChat = () => {
      if (!selectedChat || ws.current?.readyState !== WebSocket.OPEN) return;

      ws.current.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);

        setMessages((prev) => ({
          chatId: selectedChat,
          content:
            message.content.length > 0
              ? [...prev.content, ...message.content]
              : prev.content,
        }));
      };
    };

    handleChat();
  }, [selectedChat]);

  const sendMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN && selectedChat) {
      ws.current.send(
        JSON.stringify({
          action: "sendMessage",
          chatId: selectedChat,
          content: inputChat,
        })
      );

      setMessages((prev) => ({
        chatId: selectedChat,
        content: [...prev.content, ...[{ sender: "user", content: inputChat }]],
      }));

      setInputChat(""); // limpa input
    }
  };

  const handleOnclick = (chatId: string): void => {
    setSelectedChat(chatId);
  };

  const handleNewChat = async () => {
    try {
      const resp = await CreateChat(token);

      if (!resp.data) throw new Error(resp.message);

      setChatsData((prev) => [...prev, resp.data!]);
    } catch (error) {
      // setLoading(false);
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const resp = await DeleteChat(token, chatId);

      if (!resp.data) throw new Error(resp.message);

      setChatsData((prevChats) =>
        prevChats.filter((chat) => chat.id !== chatId)
      );
    } catch (error) {
      // setLoading(false);
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Box display="flex" height="100vh">
          {/* Barra lateral com botões de chat */}
          <Box
            width="250px"
            bgcolor="#f5f5f5"
            p={2}
            borderRight="1px solid #ccc"
            overflow="auto"
          >
            <Button
              fullWidth
              variant={selectedChat ? "text" : "contained"}
              onClick={() => {
                setSelectedChat("");
              }}
            >
              Home
            </Button>
            {chatsData.map((chat) => (
              <Box
                key={chat.id}
                sx={{
                  display: "flex",
                }}
              >
                <Button
                  fullWidth
                  // disabled={isConnected}
                  onClick={() => handleOnclick(chat.id)}
                  variant={selectedChat === chat.id ? "contained" : "text"}
                >
                  Conversa
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <DeleteOutlineOutlinedIcon
                    onClick={() => handleDeleteChat(chat.id)}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            flex={1}
            p={2}
            display="flex"
            flexDirection="column"
            sx={{ justifyContent: "center" }}
          >
            {selectedChat ? (
              <>
                <Typography variant="h6">teste</Typography>
                <Box
                  flex={1}
                  mt={2}
                  overflow="auto"
                  border="1px solid #ccc"
                  p={2}
                >
                  {messages.content.map((msg, i) => (
                    <Box key={messages.chatId + i} mb={1}>
                      <strong>{msg.sender}: </strong> {msg.content}
                    </Box>
                  ))}
                </Box>
                <Box mt={2} display="flex" gap={1}>
                  <TextField
                    fullWidth
                    value={inputChat}
                    onChange={(e) => setInputChat(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                  />
                  <Button variant="contained" onClick={sendMessage}>
                    Enviar
                  </Button>
                </Box>
              </>
            ) : (
              <Box mt={2} display="flex" gap={1}>
                <TextField
                  fullWidth
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNewChat();
                  }}
                />
                <Button variant="contained" onClick={handleNewChat}>
                  Enviar
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}
