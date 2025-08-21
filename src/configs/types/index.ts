export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}

export type UserRegisterResponse = ApiResponse<ApiResp>;

export interface ApiResp {
  success: boolean;
  code: number;
  message: string;
}
