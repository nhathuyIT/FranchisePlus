import type { User, Role, UserFranchiseRole } from "@/types/user.type";

export const UserDataMock: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@franchiseplus.com",
    passwordHash: "12345678",
    phone: "0912333122",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    address: "123 Admin Street, District 1, Ho Chi Minh City",
    isActive: true,
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@franchiseplus.com",
    passwordHash: "12345678",
    phone: "0912333123",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=manager",
    address: "456 Manager Avenue, District 2, Ho Chi Minh City",
    isActive: true,
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: "3",
    name: "Staff User",
    email: "staff@franchiseplus.com",
    passwordHash: "12345678",
    phone: "0912333124",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=staff",
    address: "789 Staff Road, District 3, Ho Chi Minh City",
    isActive: true,
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: "4",
    name: "Staff User 2",
    email: "staff2@franchiseplus.com",
    passwordHash: "12345678",
    phone: "0912333125",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=staff2",
    address: "321 Employee Lane, District 4, Ho Chi Minh City",
    isActive: true,
    isDeleted: false,
    createdAt: new Date("2024-01-15T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T00:00:00Z").toISOString(),
  },
  {
    id: "5",
    phone: "0901000001",
    email: "client1@gmail.com",
    name: "Nguyen Van A",
    passwordHash: "12345678",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=client1",
    address: "15 Nguyen Hue Street, District 1, Ho Chi Minh City",
    isActive: true,
    isDeleted: false,
    createdAt: new Date("2024-02-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-01T00:00:00Z").toISOString(),
  },
  {
    id: "6",
    phone: "0901000002",
    email: "client2@gmail.com",
    name: "Tran Thi B",
    passwordHash: "12345678",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=client2",
    address: "28 Le Loi Boulevard, District 3, Ho Chi Minh City",
    isActive: true,
    isDeleted: false,
    createdAt: new Date("2024-02-05T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-05T00:00:00Z").toISOString(),
  },
  {
    id: "7",
    phone: "0912345678",
    email: "multi@franchiseplus.com",
    name: "Multi Role User",
    passwordHash: "12345678",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=multi",
    address: "99 Dong Khoi Street, District 1, Ho Chi Minh City",
    isActive: true,
    isDeleted: false,
    createdAt: new Date("2024-02-10T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-10T00:00:00Z").toISOString(),
  },
];

export const RoleDataMock: Role[] = [
  {
    id: 1,
    code: "ADMIN",
    name: "Administrator",
    description: "Full system access",
    scope: "GLOBAL",
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 2,
    code: "MANAGER",
    name: "Franchise Manager",
    description: "Manages franchise operations",
    scope: "FRANCHISE",
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 3,
    code: "STAFF",
    name: "Franchise Staff",
    description: "Handles daily operations and POS",
    scope: "FRANCHISE",
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 4,
    code: "CLIENT",
    name: "Client User",
    description: "Access to client features",
    scope: "GLOBAL",
    isDeleted: false,
    createdAt: new Date("2024-02-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-01T00:00:00Z").toISOString(),
  },
];

export const UserFranchiseRoleDataMock: UserFranchiseRole[] = [
  {
    id: 1,
    userId: "1", // Admin User
    franchiseId: null, // Global role
    roleId: 1, // ADMIN
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 2,
    userId: "2", // Manager User
    franchiseId: "1", // Franchise 1
    roleId: 2, // MANAGER
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 3,
    userId: "3", // Staff User
    franchiseId: "1", // Franchise 1
    roleId: 3, // STAFF
    isDeleted: false,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 4,
    userId: "4", // Staff User 2
    franchiseId: "2", // Franchise 2
    roleId: 3, // STAFF
    isDeleted: false,
    createdAt: new Date("2024-01-15T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T00:00:00Z").toISOString(),
  },
  {
    id: 5,
    userId: "5", // Client User 1
    franchiseId: null,
    roleId: 4, // CLIENT
    isDeleted: false,
    createdAt: new Date("2024-02-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-01T00:00:00Z").toISOString(),
  },
  {
    id: 6,
    userId: "7", // Multi Role User
    franchiseId: "1", // Franchise 1
    roleId: 2, // MANAGER
    isDeleted: false,
    createdAt: new Date("2024-02-10T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-10T00:00:00Z").toISOString(),
  },
  {
    id: 7,
    userId: "7", // Multi Role User
    franchiseId: "2", // Franchise 2
    roleId: 3, // STAFF
    isDeleted: false,
    createdAt: new Date("2024-02-10T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-10T00:00:00Z").toISOString(),
  },
  {
    id: 8,
    userId: "7", // Multi Role User
    franchiseId: "3", // Franchise 3
    roleId: 2, // MANAGER
    isDeleted: false,
    createdAt: new Date("2024-02-10T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-02-10T00:00:00Z").toISOString(),
  },
];
