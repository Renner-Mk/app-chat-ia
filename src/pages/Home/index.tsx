import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
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
import "./index.css";

export function Home() {
  const navegate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [chatsData, setChatsData] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [inputChat, setInputChat] = useState("");
  const [messages, setMessages] = useState<Message>({
    chatId: "",
    content: [],
  });

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
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
    setIsConnected(false);
    ws.current = createWs(token);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log("conectado");
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket desconectado");
    };
  }, [token]);

  useEffect(() => {
    if (!selectedChat || ws.current?.readyState !== WebSocket.OPEN) return;
    setLoading(true);
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
        console.log(message);

        setMessages((prev) => ({
          chatId: selectedChat,
          content:
            message.content.length > 0
              ? [...prev.content, ...message.content]
              : prev.content,
        }));

        setLoading(false);
      };
    };

    handleChat();
  }, [selectedChat]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    setLoading(true);
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

      setInputChat("");
    }
  };

  const handleOnclick = (chatId: string): void => {
    setSelectedChat(chatId);
  };

  const handleNewChat = async () => {
    try {
      const resp = await CreateChat(token);
      if (!resp.data) throw new Error(resp.message);
      // setSelectedChat(resp.data.id);

      setChatsData((prev) => [...(resp.data ? [resp.data] : []), ...prev]);

      if (ws.current?.readyState === WebSocket.OPEN && resp.data.id) {
        setLoading(true);
        ws.current.send(
          JSON.stringify({
            action: "newChat",
            chatId: resp.data.id,
            content: inputChat,
          })
        );

        setInputChat("");
      }

      setTimeout(() => {
        setSelectedChat(resp.data!.id);
      }, 500);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const resp = await DeleteChat(token, chatId);

      if (!resp.data) throw new Error(resp.message);

      setChatsData((prevChats) =>
        prevChats.filter((chat) => chat.id !== chatId)
      );
      setSelectedChat("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container>
        <Box display="flex" height="100vh">
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
                  disabled={!isConnected}
                  onClick={() => handleOnclick(chat.id)}
                  variant={selectedChat === chat.id ? "contained" : "text"}
                >
                  Conversa
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <IconButton disabled={!isConnected}>
                    <DeleteOutlineOutlinedIcon
                      onClick={() => handleDeleteChat(chat.id)}
                    />
                  </IconButton>
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
                <Box
                  flex={1}
                  mt={0}
                  overflow="auto"
                  border="1px solid #ccc"
                  p={3}
                >
                  {messages.content.map((msg, i) => {
                    const isUser = msg.sender === "user";

                    return (
                      <Box
                        key={i}
                        display="flex"
                        justifyContent={isUser ? "flex-end" : "flex-start"}
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            p: 1.5,
                            maxWidth: "70%",
                            minWidth: "15%",
                            bgcolor: isUser ? "primary.main" : "grey.300",
                            color: isUser ? "white" : "black",
                            borderRadius: 2,
                            borderTopLeftRadius: isUser ? 20 : 2,
                            borderTopRightRadius: isUser ? 2 : 20,
                            borderBottomLeftRadius: isUser ? 2 : 20,
                            borderBottomRightRadius: isUser ? 20 : 2,
                            mb: 1.3,
                            textAlign: isUser ? "right" : "left",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              p: 0,
                              m: 0,
                              width: "fit-content",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </Box>
                        </Paper>
                      </Box>
                    );
                  })}
                  {isLoading && (
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      mt={1}
                      mb={2.5}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 1,
                          bgcolor: "grey.300",
                          color: "black",
                          borderRadius: "16px",
                        }}
                      >
                        <span className="dot-flashing"></span>
                      </Paper>
                    </Box>
                  )}
                  <div ref={endOfMessagesRef} />
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
