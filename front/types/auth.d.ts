import { UUID } from "crypto";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface user {
  id: UUID;
  username: string;
  email: string;
  updatedat: string;
  createdat: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}
