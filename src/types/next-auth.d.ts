import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

type userId = string;
declare module "next-auth/jwt" {
  interface JWT {
    id: userId;
    username?: string | null;
  }
}
declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      username?: string | null;
    };
  }
}
