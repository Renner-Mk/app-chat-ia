import * as yup from "yup";
import type { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { SignIn } from "../../configs/services";
import { useNavigate } from "react-router";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Digite um email válido")
    .required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatório"),
});

const defaultValues = {
  email: "",
  password: "",
};

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { control, formState, handleSubmit } = useForm({
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

  const onSubmit = async ({ email, password }: InferType<typeof schema>) => {
    setLoading(true);

    try {
      const res = await SignIn({
        email,
        password,
      });

      if (res.success && res.data) {
        localStorage.setItem("token", res.data.authToken);
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

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 3 }}>
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isEmpty(dirtyFields) || !isValid}
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
