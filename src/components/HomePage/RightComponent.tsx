import { FC } from "react";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

interface RightComponentProps {}

const RightComponent: FC<RightComponentProps> = () => {
  return (
    <>
      <div className="font-bold text-4xl w-[300px]">Your Feed</div>
      <div className="border-gray-300 mt-1 border w-[400px] overflow-hidden shadow rounded-2xl ">
        <div className="bg-emerald-300 text-sm p-1 ">
          <div className="flex m-7">
            <HomeIcon />
            <span className="ml-1 mt-0.5">Home</span>
          </div>
        </div>
        <div className="m-4 leading-6 text-sm">
          Your personal breadit homePage, come to check with you favorite
          communities.
        </div>
        <div className="w-full h-full p-4">
          <Link
            href="/r/create"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            {" "}
            Create Community
          </Link>
        </div>
      </div>
    </>
  );
};
export default RightComponent;