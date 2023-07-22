"use client";
import React, { FC, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Icons } from "@/components/Icons";
import { useToast } from "@/hooks/use-toast";

interface UserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserForm: FC<UserFormProps> = ({ className }: UserFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "there is an error",
        description: "an error when trying to login in google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button
        onClick={loginWithGoogle}
        isLoading={loading}
        size="sm"
        className={cn(className, "w-full flex justify-center")}
      >
        {loading ? null : <Icons.google className="w-6 h-6"></Icons.google>}
        Google
      </Button>
    </div>
  );
};
export default UserForm;
