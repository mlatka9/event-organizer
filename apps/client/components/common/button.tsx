import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSmall?: boolean;
  secondary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ isSmall, secondary, className, children, ...props }) => (
  <button
    type="submit"
    className={clsx(
      className,
      'rounded bg-blue-700 px-6 py-2 font-medium text-white transition-colors',
      isSmall && 'px-4 text-xs',
      secondary && ' !bg-white ring-2 ring-blue-500 ring-inset text-blue-500',
      !props.disabled && 'hover:bg-blue-600',
      props.disabled && '!hover:bg-blue-400 opacity-60'
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
