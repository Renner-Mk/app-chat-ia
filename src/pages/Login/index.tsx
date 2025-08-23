import AccountCircle from "@mui/icons-material/AccountCircle";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { Box, Button, Container, TextField } from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { ILogin } from "../../configs/types/auth";
import { SignIn } from "../../configs/services";
import { useNavigate } from "react-router";

export function Login() {
  const navegate = useNavigate();
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
        setFormData({
          email: "",
          password: "",
        });

        localStorage.setItem("token", res.data.authToken);

        navegate("/login");
      } else {
        alert(res.message);
        return;
      }
    } catch (error) {
      alert("Erro ao cadastrar usuário");
      console.log(error);
    } finally {
      setLoading(false);
    }
    navegate("/");
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
          textAlign: "center",
        }}
      >
        <Box component="form" onSubmit={submit}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              margin: 1,
              justifyContent: "center",
            }}
          >
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              id="input-with-sx"
              name="email"
              label="Email"
              variant="standard"
              value={formData.email}
              onChange={handleInputChange}
            />
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
              name="password"
              label="Password"
              variant="standard"
              value={formData.password}
              onChange={handleInputChange}
              type="password"
            />
          </Box>

          <Button
            loading={loading}
            variant="contained"
            loadingPosition="start"
            type="submit"
          >
            Login
          </Button>
        </Box>
      </Container>
    </>
  );
}
