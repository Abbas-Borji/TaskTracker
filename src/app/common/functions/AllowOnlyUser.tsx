import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AllowOnlyUser = () => {
  const session = useSession();
  const userRole = session.data?.user?.role;
  const router = useRouter();
  if (userRole === "ADMIN" || userRole === "MANAGER") {
    router.replace("/redirect");
  }
};

export default AllowOnlyUser;
