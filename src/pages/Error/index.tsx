import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        textAlign: "center",
        p: 2,
      }}
    >
      <Typography variant="h1" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Ops! Página não encontrada.
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        A página que você está procurando não existe ou foi removida.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Voltar para a Home
      </Button>
    </Box>
  );
}
