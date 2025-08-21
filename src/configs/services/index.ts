import { AxiosError } from "axios";
import type { ILogin, IRegister } from "../types/auth";
import { api } from "./http-ws-config";
import type { ApiResp } from "../types";

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

export async function SignUp(data: IRegister): Promise<ApiResp> {
  try {
    const response: ApiResp = await api.post("/register", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });

    return response;
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
