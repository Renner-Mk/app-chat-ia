import AccountCircle from "@mui/icons-material/AccountCircle";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { IRegister } from "../../configs/types/auth";
import { SignUp } from "../../configs/services";
import { useNavigate } from "react-router";

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    const data: IRegister = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await SignUp(data);

      if (res.success) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          passwordConfirm: "",
        });
        alert("Usuário cadastrado com sucesso!");
        navigate("/login");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.log(err);
      alert("Erro ao cadastrar usuário");
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
          Register
        </Typography>

        <Box component="form" onSubmit={submit}>
          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              name="firstName"
              label="First Name"
              variant="standard"
              fullWidth
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              name="lastName"
              label="Last Name"
              variant="standard"
              fullWidth
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              name="email"
              label="Email"
              variant="standard"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <LockPersonIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              name="password"
              label="Password"
              type="password"
              variant="standard"
              fullWidth
              value={formData.password}
              onChange={handleInputChange}
              error={!!error}
              helperText={error}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 3 }}>
            <LockPersonIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              name="passwordConfirm"
              label="Confirm Password"
              type="password"
              variant="standard"
              fullWidth
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              error={!!error}
              helperText={error}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Carregando..." : "Register"}
          </Button>
          <Button
            disabled={loading}
            variant="outlined"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              mt: "15px",
            }}
          >
            Fazer Login
          </Button>
        </Box>
      </Container>
    </>
  );
}
