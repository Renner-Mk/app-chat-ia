export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}

export type LoginResponse = ApiResponse<LoginResp>;
export type RegisterResp = ApiResponse<ApiResp>;
export type GetChatsResp = ApiResponse<Chat[]>;
export type CreateChatResp = ApiResponse<Chat>;

export interface ApiResp {
  success: boolean;
  code: number;
  message: string;
}

export interface LoginResp {
  authToken: string;
  authUser: DataUser;
}

interface DataUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Chat {
  id: string;
  userId: string;
  updatedAt: Date;
}

export interface Message {
  chatId: string;
  content: WSMessage[];
}

export interface WSMessage {
  sender: string;
  content: string;
}
export interface WsProp {
  token: string;
  children: React.ReactNode;
}
