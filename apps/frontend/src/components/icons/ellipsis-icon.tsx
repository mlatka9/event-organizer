import * as React from 'react';
import { SVGProps } from 'react';

const EllipsisIcon = ({ width = 20, height = 20, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 448 512"
    className={'fill-gray-400'}
    {...rest}
  >
    <path d="M120 256c0 30.9-25.1 56-56 56S8 286.9 8 256s25.1-56 56-56 56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56 56 25.1 56 56-25.1 56-56 56z" />
  </svg>
);

export default EllipsisIcon;
