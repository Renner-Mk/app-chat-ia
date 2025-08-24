import { AxiosError } from "axios";
import api from "./http-ws-config";
import type { CreateChatResp, GetChatsResp } from "../types";

export async function GetChats(token: string): Promise<GetChatsResp> {
  try {
    const response = await api.get<GetChatsResp>("/chats", {
      headers: { Authorization: token },
    });

    if (!response.data.success) throw new Error(response.data.message);

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

export async function CreateChat(token: string): Promise<CreateChatResp> {
  try {
    const response = await api.post(
      "/chats",
      {},
      {
        headers: { Authorization: token },
      }
    );

    if (!response.data.success) throw new Error(response.data.message);

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

export async function DeleteChat(
  token: string,
  chatId: string
): Promise<CreateChatResp> {
  try {
    const response = await api.delete("/chats", {
      headers: { Authorization: token },
      data: { chatId },
    });

    if (!response.data.success) throw new Error(response.data.message);

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
