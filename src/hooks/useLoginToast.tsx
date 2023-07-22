import { FC } from "react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export const useLoginToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Not Authorize",
      description: "You should Login or Singup",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
          onClick={() => dismiss()}
        >
          Login
        </Link>
      ),
    });
  };
  return { loginToast };
};
