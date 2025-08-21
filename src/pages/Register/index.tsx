import AccountCircle from "@mui/icons-material/AccountCircle";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { Box, Button, Container, TextField } from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { IRegister } from "../../configs/types/auth";
import { SignUp } from "../../configs/services";
import { useNavigate } from "react-router";

export function Register() {
  const navegate = useNavigate();
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
      const userRegister = await SignUp(data);

      if (userRegister.success) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          passwordConfirm: "",
        });

        alert("Usuario cadastrado");

        navegate("/login");
      } else {
        alert(userRegister.message);
        return;
      }
    } catch (error) {
      alert("Erro ao cadastrar usuário");
      console.log(error);
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
              id="input-name"
              name="firstName"
              label="Name"
              variant="standard"
              value={formData.firstName}
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
              id="input-lastName"
              name="lastName"
              label="Last Name"
              variant="standard"
              value={formData.lastName}
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
              id="input-email"
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
              error={!!error}
              helperText={error}
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
              id="input-passwordConfirm"
              name="passwordConfirm"
              label="Confirm Password"
              variant="standard"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              type="password"
              error={!!error}
              helperText={error}
            />
          </Box>

          <Button
            loading={loading}
            variant="contained"
            loadingPosition="start"
            type="submit"
          >
            Loading
          </Button>
        </Box>
      </Container>
    </>
  );
}
