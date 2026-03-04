import type { User, Role, UserFranchiseRole } from "./user.type";

// AUTH-01: Login Request & Response
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  roles: Role[];
  franchiseRoles: UserFranchiseRole[] | null;
  accessToken: string;
  refreshToken: string;
}

// AUTH-02: Switch Context Request & Response
export interface SwitchContextRequest {
  franchiseId: string | null;
}

export interface SwitchContextResponse {
  accessToken: string;
>>>>>>> c2f1c9b ([20260303][VuongND] feat(auth): update role context switching to include role_id)
}

// AUTH-03: Get Profile Response
export interface GetProfileResponse {
  user: User;
<<<<<<< HEAD
<<<<<<< HEAD
  roles: Role[];
  franchiseRoles: UserFranchiseRole[] | null;
=======
  roles: ApiRoleItem[];
  activeContext: ActiveContext | null;
>>>>>>> e1bb0d7 (Fix switch context)
=======
  roles: Role[];
  franchiseRoles: UserFranchiseRole[] | null;
>>>>>>> c2f1c9b ([20260303][VuongND] feat(auth): update role context switching to include role_id)
}

// AUTH-04: Refresh Token Response
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// AUTH-05: Forgot Password Request
export interface ForgotPasswordRequest {
  email: string;
}

// AUTH-06: Change Password Request
export interface ChangePasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// AUTH-07: Logout (no request/response body)

// AUTH-08: Verify Token Request & Response
export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

// AUTH-09: Resend Token Request
export interface ResendTokenRequest {
  email: string;
}

// AUTH-10: Register Request & Response
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
}
export interface RegisterAdminRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}
export interface RegisterResponse {
  user: User;
  message: string;
}
