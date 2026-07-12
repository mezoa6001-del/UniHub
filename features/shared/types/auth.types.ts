export interface CurrentUser {
  uid: string;
  role: "owner" | "instructor" | "student";
}