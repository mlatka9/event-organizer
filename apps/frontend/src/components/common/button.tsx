import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSmall?: boolean;
  kind?: 'secondary' | 'error';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ isLoading, isSmall, kind, className, children, ...props }) => (
  <button
    type="submit"
    className={clsx(
      className,
      'rounded px-6 py-2 font-medium transition-colors',
      isSmall && 'px-4 text-xs',
      !kind && 'bg-blue-700 text-white hover:bg-blue-600',
      kind === 'secondary' && 'bg-white ring-2 ring-blue-500 ring-inset text-blue-500',
      kind === 'error' && 'bg-white ring-2 ring-red-500 ring-inset text-red-500',
      props.disabled && '!hover:bg-blue-400 opacity-60'
    )}
    {...props}
  >
    {isLoading ? 'przetwarzanie...' : children}
  </button>
);

export default Button;
