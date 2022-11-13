import clsx from 'clsx';
import { ReactNode } from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadElement> {
  children: ReactNode;
}

const Heading = ({ children, className, ...props }: HeadingProps) => (
  <h2 className={clsx(['font-semibold text-5xl text-neutral-800'], className)} {...props}>
    {children}
  </h2>
);

export default Heading;
