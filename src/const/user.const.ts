import type { User, Role, UserFranchiseRole } from "@/types/user.type";

export const UserDataMock: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@franchiseplus.com",
    password_hash: "12345678",
    phone: "0912333122",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 2,
    name: "Manager User",
    email: "manager@franchiseplus.com",
    password_hash: "12345678",
    phone: "0912333123",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=manager",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 3,
    name: "Staff User",
    email: "staff@franchiseplus.com",
    password_hash: "12345678",
    phone: "0912333124",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=staff",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 4,
    name: "Staff User 2",
    email: "staff2@franchiseplus.com",
    password_hash: "12345678",
    phone: "0912333125",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=staff2",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-01-15T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-15T00:00:00Z").toISOString(),
  },
  {
    id: 5,
    phone: "0901000001",
    email: "client1@gmail.com",
    name: "Nguyen Van A",
    password_hash: "12345678",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=client1",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-02-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-02-01T00:00:00Z").toISOString(),
  },
  {
    id: 6,
    phone: "0901000002",
    email: "client2@gmail.com",
    name: "Tran Thi B",
    password_hash: "12345678",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=client2",
    is_active: true,
    is_deleted: false,
    created_at: new Date("2024-02-05T00:00:00Z").toISOString(),
    updated_at: new Date("2024-02-05T00:00:00Z").toISOString(),
  },
];

export const RoleDataMock: Role[] = [
  {
    id: 1,
    code: "ADMIN",
    name: "Administrator",
    description: "Full system access",
    scope: "GLOBAL",
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 2,
    code: "MANAGER",
    name: "Franchise Manager",
    description: "Manages franchise operations",
    scope: "FRANCHISE",
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 3,
    code: "STAFF",
    name: "Franchise Staff",
    description: "Handles daily operations and POS",
    scope: "FRANCHISE",
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 4,
    code: "CLIENT",
    name: "Client User",
    description: "Access to client features",
    scope: "GLOBAL",
    is_deleted: false,
    created_at: new Date("2024-02-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-02-01T00:00:00Z").toISOString(),
  },
];

export const UserFranchiseRoleDataMock: UserFranchiseRole[] = [
  {
    id: 1,
    user_id: 1, // Admin User
    franchise_id: null, // Global role
    role_id: 1, // ADMIN
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 2,
    user_id: 2, // Manager User
    franchise_id: 1, // Franchise 1
    role_id: 2, // MANAGER
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 3,
    user_id: 3, // Staff User
    franchise_id: 1, // Franchise 1
    role_id: 3, // STAFF
    is_deleted: false,
    created_at: new Date("2024-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 4,
    user_id: 4, // Staff User 2
    franchise_id: 2, // Franchise 2
    role_id: 3, // STAFF
    is_deleted: false,
    created_at: new Date("2024-01-15T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-15T00:00:00Z").toISOString(),
  },
  {
    id: 5,
    user_id: 5, // Client User 1
    franchise_id: null,
    role_id: 4, // CLIENT
    is_deleted: false,
    created_at: new Date("2024-02-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-02-01T00:00:00Z").toISOString(),
  },
];
