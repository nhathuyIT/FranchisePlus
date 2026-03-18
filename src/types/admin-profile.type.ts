export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAdminProfileInput {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  address?: string;
}
