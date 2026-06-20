export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface LoginSuccessResponse {
  token: string;
  user: {
    username: string;
    displayName: string;
  };
}

export interface LoginErrorResponse {
  message: string;
}
