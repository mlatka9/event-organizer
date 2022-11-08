import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSmall?: boolean;
}

const Button: React.FC<ButtonProps> = ({isSmall, className, children, ...props}) => (
  <button
    type="submit"
    className={clsx(
      className,
      "rounded bg-blue-700 px-6 py-2 font-medium text-white transition-colors",
      isSmall && "px-4 text-xs",
      !props.disabled && "hover:bg-blue-600",
      props.disabled && "!hover:bg-blue-400 opacity-60"
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
