import { FC } from "react";
import { Session } from "next-auth";
import { Input } from "@/components/ui/Input";
import { buttonVariants } from "@/components/ui/Button";
import { ImageIcon, Link2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";

interface MiniCreatePostProps {
  session: Session;
  slug: string;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({
  session,
  slug,
}: MiniCreatePostProps) => {
  return (
    <div className="border-gray-300 border bg-white flex items-center rounded shadow w-[600px]">
      <div className="relative">
        <UserAvatar
          className="relative h-10 w-10 m-2"
          user={{
            image: session?.user.image,
          }}
        ></UserAvatar>
        <span className="absolute bottom-2.5 right-2.5 rounded-full w-2.5 h-2.5 bg-green-700" />
      </div>
      <Link className="w-3/4" href={`/r/${slug}/submit`}>
        <Input
          readOnly={true}
          placeholder="Create a Post"
          className="m-2"
        ></Input>
      </Link>
      <Link
        href={`/r/${slug}/submit`}
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        <ImageIcon className="text-zinc-900" />
      </Link>
      <Link
        className={buttonVariants({
          variant: "ghost",
        })}
        href={`/r/${slug}/submit`}
      >
        <Link2 className="text-zinc-900" />
      </Link>
    </div>
  );
};
export default MiniCreatePost;
