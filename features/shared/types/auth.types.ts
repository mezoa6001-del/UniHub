import type { UserRole } from "@/types";

export interface CurrentUser {
  uid: string;
  role: UserRole;
}