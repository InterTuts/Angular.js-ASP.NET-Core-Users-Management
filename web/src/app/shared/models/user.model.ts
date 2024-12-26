export interface BaseUser {
  email: string;
  password: string;
}

export interface UserPassword {
  password: string;
}

export interface User {
  userId: number;
  email: string;
  token: string;
}

export interface UserLogin {
  message: string;
  success: boolean;
  user?: User;
}

export interface CreateUser extends BaseUser {
  first_name: string;
  last_name: string;
}

export interface UserSocial {
  success: boolean;
  message: string;
  content?: {
    userId: number,
    email: string,
    token: string,
    socialId: string
  }
}
