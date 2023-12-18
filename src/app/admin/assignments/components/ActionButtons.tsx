import React from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

const ActionButtons = () => {
  return (
    <div className="flex">
      <Link href={"#"} className="mr-4 px-2 text-primary font-medium">
        Edit Checklist
      </Link>

      <Link href={"#"}>
        <TrashIcon className="h-5 w-5 text-red-600" />
      </Link>
    </div>
  );
};

export default ActionButtons;
