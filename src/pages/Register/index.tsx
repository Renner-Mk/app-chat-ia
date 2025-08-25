import * as yup from "yup";
import type { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { SignUp } from "../../configs/services";
import { useNavigate } from "react-router";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("Precisa passar um nome")
    .min(2, "Seu nome precisa ter no minimo duas letras"),
  lastName: yup.string().required("Precisa passar um sobrenome"),
  email: yup
    .string()
    .email("Digite um email válido")
    .required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatório"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas devem ser iguais")
    .required("Confirme sua senha"),
});

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { control, formState, handleSubmit } = useForm({
    mode: "onTouched",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const isEmpty = (obj: object) => Object.keys(obj).length === 0;

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async ({
    email,
    password,
    firstName,
    lastName,
  }: InferType<typeof schema>) => {
    setLoading(true);

    try {
      const res = await SignUp({ firstName, lastName, email, password });

      if (res.success) {
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

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  variant="standard"
                  fullWidth
                  required
                  slotProps={{
                    inputLabel: { required: false },
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sobrenome"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  variant="standard"
                  fullWidth
                  required
                  slotProps={{
                    inputLabel: { required: false },
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="E-mail"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="standard"
                  autoComplete="email"
                  fullWidth
                  required
                  slotProps={{
                    inputLabel: { required: false },
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <LockPersonIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="standard"
                  autoComplete="current-password"
                  fullWidth
                  required
                  slotProps={{
                    inputLabel: { required: false },
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 3 }}>
            <LockPersonIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirme a Senha"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.passwordConfirm}
                  helperText={errors?.passwordConfirm?.message}
                  variant="standard"
                  autoComplete="current-password"
                  fullWidth
                  required
                  slotProps={{
                    inputLabel: { required: false },
                  }}
                />
              )}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isEmpty(dirtyFields) || !isValid}
            loading={loading}
            loadingPosition="start"
          >
            {loading ? "Carregando..." : "Registrar-se"}
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
