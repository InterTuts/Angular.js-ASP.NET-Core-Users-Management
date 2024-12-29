import List from "./list.model";

export interface BaseUser {
  email: string;
  password: string;
}

export interface UserPassword {
  password: string;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  options: Array<{
    optionId: number;
    optionName: string;
    optionValue: string
  }>
}

export interface UserLogin {
  message: string;
  success: boolean;
  user?: User;
}

export interface CreateUser extends BaseUser {
  firstName: string;
  lastName: string;
}

export interface UserSocial {
  success: boolean;
  message: string;
  content?: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    socialId: string;
  }
}

export interface UserInfo extends CreateUser {
  userId: number;
  role: number;
  token: string;
  sidebar: boolean;
  created: number;
}

export interface UsersList {
  result: List<UserInfo>
  page: number;
  total: number;
}
