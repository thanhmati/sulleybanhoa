export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface IRefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface IChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}
