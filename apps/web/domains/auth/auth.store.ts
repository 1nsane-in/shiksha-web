export {
  useAuthStore,
  selectUser,
  selectToken,
  selectLoading,
  selectIsAuthenticated,
  selectIsAdmin,
  selectIsSuperAdmin,
  selectIsStudent,
} from "@/stores/auth-store";

export type { User as AuthUser } from "@/stores/auth-store";
