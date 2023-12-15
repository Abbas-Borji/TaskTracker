import React from "react";
import classNames from "../functions/ClassNames";

interface ButtonProps {
  text: string;
  className?: string;
  onClick: () => void;
}
const Button = ({
  text,
  className = "bg-primary text-white hover:bg-indigo-400 focus-visible:outline-indigo-500",
  onClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={classNames(
        className,
        "rounded max-h-8 px-4 py-1 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
