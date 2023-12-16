import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AllowOnlyManager = () => {
  const session = useSession();
  const userRole = session.data?.user?.role;
  const router = useRouter();
  if (userRole === "ADMIN" || userRole === "USER") {
    router.replace("/redirect");
  }
};

export default AllowOnlyManager;
