import { getAuthSession } from "@/lib/auth";
import CustomPosts from "@/components/CustomPosts";
import GeneralPost from "@/components/GeneralPost";
import RightComponent from "@/components/HomePage/RightComponent";

export default async function Home() {
  const session = await getAuthSession();
  return (
    <div className="px-20 mt-2">
      <div className="relative h-full w-full flex flex-col-reverse justify-center items-center lg:gap-4 lg:items-stretch lg:flex-row">
        <div className="">
          {/* @ts-expect-error async server component */}
          {session ? <CustomPosts /> : <GeneralPost />}
        </div>
        <div className="">
          <RightComponent />
        </div>
      </div>
    </div>
  );
}
