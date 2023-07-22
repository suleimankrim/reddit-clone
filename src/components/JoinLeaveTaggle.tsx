"use client";
import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { subridderSubreddirIdPayload } from "@/lib/validator/subreddirtValidation";
import { toast } from "@/hooks";
import { useLoginToast } from "@/hooks/useLoginToast";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

const JoinLeaveTaggle = ({
  subredditId,
  subredditName,
  isSubscribe,
}: {
  subredditId: string;
  subredditName: string;
  isSubscribe: boolean;
}) => {
  const route = useRouter();
  const { loginToast } = useLoginToast();
  const { mutate: subscribeFetch, isLoading: subscribeIsLoading } = useMutation(
    {
      mutationFn: async () => {
        const payload: subridderSubreddirIdPayload = {
          subredditId,
        };
        const { data } = await axios.post("/api/subridder/subscribe", payload);
        return data as string;
      },
      onSuccess: () => {
        startTransition(() => {
          route.refresh();
        });
        return toast({
          title: "subscribed",
          description: `You Are now subscribed to ${subredditName}`,
        });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) return loginToast();
          if (error.response?.status === 409) {
            return toast({
              title: "you already subscribe",
              description: "",
              variant: "destructive",
            });
          }

          return toast({
            title: "there is an error",
            description: error.message,
            variant: "destructive",
          });
        }
      },
    }
  );
  const { mutate: unsubscribeFetch, isLoading: unsubscribeIsLoading } =
    useMutation({
      mutationFn: async () => {
        const payload: subridderSubreddirIdPayload = {
          subredditId,
        };
        const { data } = await axios.post(
          "/api/subridder/unsubscribe",
          payload
        );
        return data as string;
      },
      onSuccess: () => {
        startTransition(() => {
          route.refresh();
        });
        return toast({
          title: "unsubscribed",
          description: `You Are now unsubscribed from ${subredditName}`,
        });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) return loginToast();
          if (error.response?.status === 409) {
            return toast({
              title: "you already unsubscribe",
              description: "",
              variant: "destructive",
            });
          }

          return toast({
            title: "there is an error",
            description: error.message,
            variant: "destructive",
          });
        }
      },
    });
  return (
    <>
      <div className="w-full p-3">
        {isSubscribe ? (
          <Button
            onClick={() => unsubscribeFetch()}
            isLoading={unsubscribeIsLoading}
            className="w-full"
          >
            Leave Community
          </Button>
        ) : (
          <Button
            onClick={() => subscribeFetch()}
            isLoading={subscribeIsLoading}
            className="w-full"
          >
            Join Community
          </Button>
        )}
      </div>
    </>
  );
};
export default JoinLeaveTaggle;
