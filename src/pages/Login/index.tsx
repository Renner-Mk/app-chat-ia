import AccountCircle from "@mui/icons-material/AccountCircle";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { Box, Button, Container, TextField } from "@mui/material";
import { useState } from "react";
import { ws } from "../../configs/services/api";

export function Login() {
  const [loading, setLoading] = useState(false);

  const loadingButton = () => {
    setLoading(true);

    console.log(import.meta.env.REACT_APP_API_WS_URL);

    ws.onopen = () => {
      console.log("conectado");
      setLoading(false);
    };

    ws.onerror = () => {
      console.log("erro");
      setLoading(false);
    };

    console.log("b");
  };
  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          textAlign: "center",
        }}
      >
        <form action="">
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              margin: 1,
              justifyContent: "center",
            }}
          >
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField id="input-with-sx" label="Email" variant="standard" />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              margin: 1,
              justifyContent: "center",
            }}
          >
            <LockPersonIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="input-password"
              label="Password"
              variant="standard"
            />
          </Box>

          <Button onClick={loadingButton} variant="contained">
            Contained
          </Button>
          <Button loading={loading} variant="contained" loadingPosition="start">
            Loading
          </Button>
        </form>
      </Container>
    </>
  );
}
