import { AxiosError } from "axios";
import type { ILogin } from "../types/auth";
import { api } from "./http-ws-config";

export async function SignIn(data: ILogin) {
  try {
    const response = await api.post("/login", {
      email: data.email,
      password: data.password,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        code: error.response?.status || 500,
        message: error.response?.data.message,
      };
    }
    return {
      success: false,
      code: 500, // Código de erro genérico
      message: "Ocorreu um erro inesperado. Entre en contato com o suporte.",
    };
  }
}
