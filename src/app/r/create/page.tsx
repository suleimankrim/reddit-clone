"use client";
import { FC, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, isAxiosError } from "axios";
import { subridderNamePayload } from "@/lib/validator/subreddirtValidation";
import { toast } from "@/hooks";
import { useLoginToast } from "@/hooks/useLoginToast";

interface PageProps {}

const Page: FC<PageProps> = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useLoginToast();
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: subridderNamePayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subridder", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Riddet name is already exist",
            description: "Please change the name",
            variant: "destructive",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Riddet name is to short or big",
            description: "Please change the name",
            variant: "destructive",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "there is an error",
        description: "subreddit could not create",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`);
    },
  });
  return (
    <div className="w-full h-full flex justify-center py-16">
      <div className="border border-gray-300 flex flex-col h-fit rounded shadow bg-white">
        <p className="font-bold text-2xl m-3">Create Community</p>
        <div className="w-[300px] px-4">
          <hr className="w-full"></hr>
        </div>
        <p className="m-3 text-xl">Name</p>
        <p className="text-sm leading-5 m-3">
          Community names including capitalization connot changed.
        </p>
        <div className="m-3 relative">
          <p className="absolute left-1 top-1 text-xl text-gray-300">r/</p>
          <Input
            className="pl-6 text-gray-500 leading-6"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        <div className="m-3 flex justify-between">
          <Button
            className="bg-gray-400 text-slate-900"
            onClick={() => {
              router.back();
            }}
          >
            {" "}
            Close
          </Button>
          <Button
            isLoading={isLoading}
            onClick={() => {
              createCommunity();
            }}
            disabled={input.length === 0}
          >
            Create Community{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Page;
