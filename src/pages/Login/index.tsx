import AccountCircle from "@mui/icons-material/AccountCircle";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { ILogin } from "../../configs/types/auth";
import { SignIn } from "../../configs/services";
import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setLoading(true);

    const data: ILogin = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await SignIn(data);

      if (res.success && res.data) {
        localStorage.setItem("token", res.data.authToken);
        setFormData({ email: "", password: "" });
        navigate("/");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" mb={4}>
          Login
        </Typography>

        <Box component="form" onSubmit={submit}>
          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Email"
              name="email"
              variant="standard"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 3 }}>
            <LockPersonIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Senha"
              name="password"
              variant="standard"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleInputChange}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            // disabled={loading}
            loading={loading}
            loadingPosition="start"
          >
            {loading ? "Carregando..." : "Entrar"}
          </Button>
          <Button
            disabled={loading}
            variant="outlined"
            fullWidth
            onClick={() => navigate("/register")}
            sx={{
              mt: "15px",
            }}
          >
            Criar conta
          </Button>
        </Box>
      </Container>
    </>
  );
}
