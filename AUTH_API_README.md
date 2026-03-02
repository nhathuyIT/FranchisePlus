# 🔐 AUTH API Implementation

Đã implement đầy đủ 9 endpoints cho **AUTH module** theo API specification.

## 📋 API Endpoints

| API ID      | Endpoint                    | Method | Token | Description           |
| ----------- | --------------------------- | ------ | ----- | --------------------- |
| **AUTH-01** | `/api/auth`                 | POST   | ❌    | Login                 |
| **AUTH-02** | `/api/auth/switch-context`  | POST   | ✅    | Switch Role/Franchise |
| **AUTH-03** | `/api/auth`                 | GET    | ✅    | Get Profile           |
| **AUTH-04** | `/api/auth/refresh-token`   | GET    | ❌    | Refresh Token         |
| **AUTH-05** | `/api/auth/forgot-password` | PUT    | ❌    | Forgot Password       |
| **AUTH-06** | `/api/auth/change-password` | PUT    | ❌    | Change Password       |
| **AUTH-07** | `/api/auth/log-out`         | POST   | ✅    | Logout                |
| **AUTH-08** | `/api/auth/verify-token`    | POST   | ❌    | Verify Token          |
| **AUTH-09** | `/api/auth/resend-token`    | POST   | ❌    | Resend Token          |

---

## 📁 File Structure

```
src/
├── api/
│   └── auth.api.ts              # AUTH API service functions
├── hooks/
│   └── auth/
│       └── useAuth.hooks.ts     # TanStack Query hooks
├── types/
│   └── auth.type.ts             # TypeScript types
└── stores/
    └── auth-store.ts            # Zustand auth store
```

---

## 🚀 Quick Start

### 1. **Login**

```typescript
import { useLogin } from "@/hooks/auth/useAuth.hooks";

const loginMutation = useLogin();

loginMutation.mutate({
  email: "admin@franchise.com",
  password: "12345678",
});
```

### 2. **Get Profile**

```typescript
import { useProfile } from "@/hooks/auth/useAuth.hooks";

const { data, isLoading } = useProfile();
```

### 3. **Switch Role**

```typescript
import { useSwitchContext } from "@/hooks/auth/useAuth.hooks";

const switchMutation = useSwitchContext();

switchMutation.mutate({
  roleId: 2,
  franchiseId: 1,
});
```

### 4. **Logout**

```typescript
import { useLogout } from "@/hooks/auth/useAuth.hooks";

const logoutMutation = useLogout();

logoutMutation.mutate();
```

---

## 🎯 Features

✅ **TanStack Query Integration** - Automatic caching, refetching, optimistic updates  
✅ **Type-Safe** - Full TypeScript support  
✅ **Error Handling** - Global mutation error toast  
✅ **Auto Navigation** - Redirect after login/logout  
✅ **Multi-Role Support** - Role selector for users with multiple roles  
✅ **Token Management** - Axios interceptors handle JWT tokens

---

## 📝 Available Hooks

| Hook                  | Type     | Description                |
| --------------------- | -------- | -------------------------- |
| `useLogin()`          | Mutation | Login user                 |
| `useSwitchContext()`  | Mutation | Switch role/franchise      |
| `useProfile()`        | Query    | Get user profile           |
| `useRefreshToken()`   | Mutation | Refresh access token       |
| `useForgotPassword()` | Mutation | Request password reset     |
| `useChangePassword()` | Mutation | Change password with token |
| `useLogout()`         | Mutation | Logout user                |
| `useVerifyToken()`    | Mutation | Verify reset token         |
| `useResendToken()`    | Mutation | Resend verification email  |

---

## 🔨 Usage Examples

Xem file `EXAMPLES_AUTH_API.tsx` để biết cách sử dụng chi tiết.

---

## 🎨 Integration với UI

### Replace Mock Login với Real API

**Before (Mock):**

```typescript
// admin-login.tsx
const user = UserDataMock.find(...);
login(authUser);
```

**After (Real API):**

```typescript
// admin-login.tsx
import { useLogin } from "@/hooks/auth/useAuth.hooks";

const loginMutation = useLogin();

const onSubmit = (data) => {
  loginMutation.mutate({
    email: data.email,
    password: data.password,
  });
};
```

---

## 🔧 Configuration

### Axios Config

Token tự động được attach vào headers qua interceptor:

```typescript
// axios.config.ts
config.headers.Authorization = `Bearer ${accessToken}`;
```

### TanStack Config

Error handling global:

```typescript
// tanstack.config.ts
mutations: {
  onError: (error) => {
    toast.error("Operation failed", {
      description: error.message,
    });
  },
}
```

---

## 🎯 Next Steps

1. **Replace mock login** trong `admin-login.tsx` với `useLogin()`
2. **Replace mock logout** trong `admin-sidebar.tsx` với `useLogout()`
3. **Add profile endpoint** trong `ProfilePage` với `useProfile()`
4. **Implement password reset flow** với `useForgotPassword()` & `useChangePassword()`

---

## 📚 References

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- API Spec: [Google Sheets](https://docs.google.com/spreadsheets/d/1Veup6oOAgBH_Q2bMyrbvtZJ-PyaKRovwXoj3l-CGTf8/edit?gid=890198999#gid=890198999)
