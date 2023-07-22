"use client";
import { FC } from "react";
import { User } from ".prisma/client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/ui/form";
import { Input } from "@/components/ui/Input";
import {
  UserNameSchema,
  UserNameType,
} from "@/lib/validator/UserNameValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks";
import { useRouter } from "next/navigation";

interface UserFormProps {
  user: Pick<User, "id" | "username">;
}

const UserForm: FC<UserFormProps> = ({ user }: UserFormProps) => {
  const router = useRouter();
  const { mutate: submitUserName } = useMutation({
    mutationFn: async ({ username }: UserNameType) => {
      const { data } = await axios.patch("/api/username", { username });
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already taken.",
            description: "Please choose another username.",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your username was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your username has been updated.",
      });
      router.refresh();
    },
  });
  const form = useForm<UserNameType>({
    defaultValues: {
      username: user.username ?? "",
    },
    resolver: zodResolver(UserNameSchema),
  });

  function onSubmit(values: UserNameType) {
    submitUserName(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-12 rounded-lg shadow-lg "
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormDescription>
                Please Enter Your UserName That you Are Comfortable With
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end ">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
export default UserForm;
