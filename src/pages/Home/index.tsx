import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
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
import "./index.css";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useWs } from "../../context/useWs";

export function Home() {
  const navigate = useNavigate();
  const { sendMessage, subscribe, isConnected, GetWsChats, NewChat } = useWs();
  const [isLoading, setLoading] = useState(false);
  const [chatsData, setChatsData] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [inputChat, setInputChat] = useState("");
  const [messages, setMessages] = useState<Message>({
    chatId: "",
    content: [],
  });
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const toggleDrawer = (state: boolean) => () => setOpen(state);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      navigate("/login");
      return;
    }
    setToken(t);
  }, [navigate]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!token) return;
    const funcFeacth = async () => {
      // setLoading(true);
      try {
        const resp = await GetChats(token);

        if (resp.data) {
          setChatsData(resp.data);
        }
      } catch (error) {
        // setLoading(false);
        console.log(error);
      }
    };

    funcFeacth();
  }, [token]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    setLoading(true);

    if (messages.chatId !== selectedChat) {
      setMessages({
        chatId: "",
        content: [],
      });
    }

    if (selectedChat) {
      GetWsChats("", selectedChat);
    }
  }, [selectedChat, isConnected, GetWsChats, messages.chatId]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const unsubscribe = subscribe((msg: Message) => {
      if (msg.chatId === selectedChat && msg.content.length > 0) {
        setMessages((prev) => ({
          chatId: msg.chatId,
          content: [...prev.content, ...msg.content],
        }));
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [subscribe, selectedChat, isConnected]);

  const sendMsg = () => {
    setLoading(true);

    if (isConnected) {
      sendMessage(inputChat, selectedChat);

      setMessages((prev) => ({
        chatId: selectedChat,
        content: [...prev.content, ...[{ sender: "user", content: inputChat }]],
      }));

      setInputChat("");
    }
  };

  const handleSelectChat = (chatId: string): void => {
    setSelectedChat(chatId);

    setMessages({
      chatId,
      content: [],
    });
  };

  const handleNewChat = async () => {
    if (!inputChat.trim()) return;

    try {
      if (!token) return;
      const resp = await CreateChat(token);
      if (!resp.data) throw new Error(resp.message);
      setSelectedChat(resp.data.id);

      setChatsData((prev) => [...(resp.data ? [resp.data] : []), ...prev]);

      setLoading(true);
      if (isConnected) {
        NewChat(inputChat, resp.data.id);

        setMessages({
          chatId: resp.data.id,
          content: [{ sender: "user", content: inputChat }],
        });

        setInputChat("");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      if (!token) return;
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

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        bgcolor: "#1f2937",
        height: "100%",
        color: "white",
        display: "flex",
        flexDirection: "column",
        p: 1,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          mb: isDesktop ? "46px" : "0",
        }}
      >
        <IconButton
          color="inherit"
          onClick={toggleDrawer(false)}
          sx={{ display: isDesktop ? "none" : "block" }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Button
        fullWidth
        variant={selectedChat ? "text" : "contained"}
        onClick={() => {
          setSelectedChat("");
          if (!isDesktop) setOpen(false);
        }}
      >
        Criar novo chat
      </Button>
      {chatsData.map((chat) => (
        <Box
          key={chat.id}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            fullWidth
            disabled={!isConnected}
            onClick={() => {
              handleSelectChat(chat.id);
              if (!isDesktop) setOpen(false);
            }}
            variant={selectedChat === chat.id ? "contained" : "text"}
          >
            Novo Chat
          </Button>
          <IconButton
            disabled={!isConnected}
            onClick={() => handleDeleteChat(chat.id)}
          >
            <DeleteOutlineOutlinedIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      height="100vh"
      className="content"
      sx={{
        display: "flex",
      }}
    >
      {!isDesktop && (
        <Box sx={{ padding: "8px 5px", display: open ? "none" : "block" }}>
          <IconButton
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{ position: "relative", top: 10, left: 10, zIndex: 1300 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggleDrawer(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
              backgroundColor: "#1f2937",
              color: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            boxSizing: "border-box",
            "& .MuiDrawer-paper": {
              width: 250,
              position: "relative",
              backgroundColor: "#1f2937",
              color: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        width={"100%"}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: { md: "100vh", xs: "calc(100vh - 56px)" },
        }}
      >
        {selectedChat ? (
          <>
            <Container
              maxWidth="md"
              sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "16px 0 40px ",
              }}
            >
              <Box flex={1}>
                {messages.content.map((msg, i) => {
                  const isUser = msg.sender === "user";
                  return (
                    <Box
                      key={i}
                      display="flex"
                      justifyContent={isUser ? "flex-end" : "flex-start"}
                      sx={{ padding: "0 11px" }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 1.5,
                          maxWidth: "70%",
                          bgcolor: isUser ? "primary.main" : "grey.300",
                          color: isUser ? "white" : "black",
                          borderRadius: 2,
                          borderTopLeftRadius: isUser ? 20 : 2,
                          borderTopRightRadius: isUser ? 2 : 20,
                          borderBottomLeftRadius: isUser ? 2 : 20,
                          borderBottomRightRadius: isUser ? 20 : 2,
                          mt: isUser ? 2.5 : 0,
                          textAlign: "left",
                          mb: 1,
                          display: "flex",
                          justifyContent: "center",
                          overflowX: "hiden",
                        }}
                      >
                        <Box
                          sx={{
                            p: 0,
                            m: 0,
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
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
            </Container>

            <Box
              maxWidth="md"
              sx={{
                margin: "auto",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={5}
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMsg();
                  }
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "35px",
                    bgcolor: "white",
                    padding: "0 16px",
                    py: 1.5,
                    transform: "translate(0, -50%)",
                  },
                  "& .MuiInputBase-input": {
                    transform: "translate(0, -10%)",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={sendMsg}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </>
        ) : (
          <Box
            maxWidth="md"
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={5}
              value={inputChat}
              onChange={(e) => setInputChat(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleNewChat();
                }
              }}
              slotProps={{
                input: {
                  sx: {
                    borderRadius: "35px",
                    bgcolor: "white",
                    padding: "16px 16px",
                    transform: "translate(0, -50%)",
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
