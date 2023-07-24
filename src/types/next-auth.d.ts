import type { User } from "next-auth";

type userId = string;
declare module "next-auth/jwt" {
  // eslint-disable-next-line no-unused-vars
  interface JWT {
    id: userId;
    username?: string | null;
  }
}
declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: User & {
      id: UserId;
      username?: string | null;
    };
  }
}
