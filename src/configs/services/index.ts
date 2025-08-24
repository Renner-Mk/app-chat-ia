import { AxiosError } from "axios";
import type { ILogin, IRegister } from "../types/auth";
import api from "./http-ws-config";
import type { LoginResponse, RegisterResp } from "../types";

export async function SignIn(data: ILogin): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/login", {
      email: data.email,
      password: data.password,
    });

    if (!response.data.success) throw new Error("erro");

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

export async function SignUp(data: IRegister): Promise<RegisterResp> {
  try {
    const response = await api.post<RegisterResp>("/register", {
      firstName: data.firstName,
      lastName: data.lastName,
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
