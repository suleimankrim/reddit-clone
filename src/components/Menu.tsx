"use client";
import { FC } from "react";
import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface MenuProps {
  user: Pick<User, "email" | "image" | "name">;
}

const Menu: FC<MenuProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="w-9 h-9 rounded-full relative"
          user={{
            image: user.image,
          }}
        ></UserAvatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user.email && <div className="w-full text-2xl"> {user.email} </div>}
        {user.name && <div className="w-full text-sm"> {user.name} </div>}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/"> Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/r/create"> create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/setting"> Setting</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}
        >
          Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default Menu;
