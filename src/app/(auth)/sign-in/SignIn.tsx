import { FC } from "react";
import { Icons } from "@/components/Icons";
import Link from "next/link";
import UserForm from "../auth-commponent/UserForm";

const SignIn: FC = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Icons.logo className="h-6 w-6"></Icons.logo>
      <p>Welcome back</p>
      <p>By continuing, you agree to our User Agreement and Privacy Policy.</p>
      <UserForm />
      <p>
        Are you New in Breadit?
        <Link href="/sign-up" className="underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};
export default SignIn;
