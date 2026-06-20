export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface User {
  username: string;
  displayName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
}
