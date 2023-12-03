import React from "react";

interface DividerProps {
  borderColor?: string;
}

// Divider with customizable border color
const Divider = ({ borderColor = "gray-200" }: DividerProps) => {
  return <div className={"w-full border-t border-" + borderColor} />;
};

export default Divider;
