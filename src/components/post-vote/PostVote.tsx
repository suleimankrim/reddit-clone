"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vote, VoteType } from ".prisma/client";
import { useLoginToast } from "@/hooks/useLoginToast";
import { useMutation } from "@tanstack/react-query";
import { VoteSchemaRequest } from "@/types/VoteSchema";
import axios, { AxiosError } from "axios";
import { usePrevious } from "@mantine/hooks";
import { toast } from "@/hooks";
import dynamic from "next/dynamic";

type voteType = Pick<Vote, "type">;

interface PostVoteProps {
  initialVote: number;
  didVote?: voteType | null;
  postId: string;
}

const PostVote: FC<PostVoteProps> = ({
  initialVote,
  didVote,
  postId,
}: PostVoteProps) => {
  const { loginToast } = useLoginToast();
  const [voteNumber, setVoteNumber] = useState<number>(initialVote);
  const [didVotePost, setDidVotePost] = useState(didVote);
  const prevVote = usePrevious(didVotePost);
  useEffect(() => {
    setDidVotePost(didVote);
  }, [didVote]);
  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: VoteSchemaRequest = {
        postId,
        voteType,
      };
      await axios.patch("/api/subridder/post/vote", payload);
    },
    onError: (error, voteType) => {
      if (voteType === "UP") setVoteNumber((prevState) => prevState - 1);
      else setVoteNumber((prevState) => prevState + 1);
      setDidVotePost(prevVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          return toast({
            title: "not valid body",
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
    onMutate: (type) => {
      if (type === didVotePost?.type) {
        setDidVotePost(undefined);
        if (type === "UP") setVoteNumber((prevState) => prevState - 1);
        else if (type === "DOWN") setVoteNumber((prevState) => prevState + 1);
      } else {
        setDidVotePost({ type });
        if (type === "UP")
          setVoteNumber((prevState) => prevState + (voteNumber ? 2 : 1));
        else if (type === "DOWN")
          setVoteNumber((prevState) => prevState - (voteNumber ? 2 : 1));
      }
    },
  });
  return (
    <>
      <div className="m-3 flex flex-col gap-2 justify-center items-center">
        <Button size="sm" variant={"ghost"} onClick={() => vote("UP")}>
          <ArrowBigUp
            className={cn(
              "w-6 h-8",
              didVotePost?.type === "UP"
                ? "fill-green-800 text-green-800"
                : null
            )}
          />
        </Button>
        <div>{voteNumber.toString()}</div>
        <Button size={"sm"} variant={"ghost"} onClick={() => vote("DOWN")}>
          <ArrowBigDown
            className={cn(
              "w-6 h-8",
              didVotePost?.type === "DOWN" ? "fill-red-800 text-red-800" : null
            )}
          />
        </Button>
      </div>
    </>
  );
};
export default dynamic(() => Promise.resolve(PostVote), { ssr: false });
