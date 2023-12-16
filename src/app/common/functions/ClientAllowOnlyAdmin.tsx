import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AllowOnlyAdmin = () => {
  const session = useSession();
  const userRole = session.data?.user?.role;
  const router = useRouter();
  if (userRole === "MANAGER" || userRole === "USER") {
    router.replace("/redirect");
  }
};

export default AllowOnlyAdmin;
