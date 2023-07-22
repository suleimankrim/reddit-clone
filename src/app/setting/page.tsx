import UserForm from "@/components/UserForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};
const Page = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <div className="flex justify-center items-center h-full">
      <UserForm
        user={{
          username: session.user.username ?? "",
          id: session.user.id,
        }}
      />
    </div>
  );
};
export default Page;
