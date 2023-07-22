import { getAuthSession } from "@/lib/auth";
import CustomPosts from "@/components/CustomPosts";
import GeneralPost from "@/components/GeneralPost";
import RightComponent from "@/components/HomePage/RightComponent";

export default async function Home() {
  const session = await getAuthSession();
  return (
    <div className="relative h-full w-full grid gap-2 grid-rows-2 md:grid-cols-4 px-4">
      <div className=" row-start-2 md:col-start-1 md:row-start-1 md:col-span-2 mt-10 ">
        {/* @ts-expect-error async server component */}
        {session ? <CustomPosts /> : <GeneralPost />}
      </div>
      <div className="row-start-1 md:col-start-3 md:col-span-2 mt-2">
        <RightComponent />
      </div>
    </div>
  );
}
