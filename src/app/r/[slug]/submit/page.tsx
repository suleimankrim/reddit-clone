import { FC } from "react";
import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params: { slug } }: PageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
  });

  if (!subreddit) return notFound();
  return (
    <div className="w-full h-full">
      <h1 className="text-3xl text-center mt-7 font-bold block">
        Create Post in r/{slug}
      </h1>
      <div className="flex w-full justify-center">
        <hr className="text-slate-900 w-96 text-center mt-3"></hr>
      </div>
      <Editor subredditId={subreddit.id}></Editor>
      <div className="w-full h-fit p-3 flex justify-center">
        <Button form="editor-form" className="w-[200px]" variant={"default"}>
          {" "}
          Submit
        </Button>
      </div>
    </div>
  );
};
export default Page;
