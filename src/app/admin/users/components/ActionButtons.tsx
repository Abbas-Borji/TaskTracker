import React from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

const ActionButtons = () => {
  return (
    <div className="flex">
      <Link href={"#"} className="mr-4 px-2">Edit</Link>

      <Link href={"#"}>
        <TrashIcon className="h-5 w-5 text-gray-500" />
      </Link>
    </div>
  );
};

export default ActionButtons;
