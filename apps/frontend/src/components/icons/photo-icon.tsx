import * as React from 'react';
import { SVGProps } from 'react';

const PhotoIcon = ({ width = 20, height = 20, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={width}
    height={height}
    className={'fill-gray-400'}
    {...rest}
  >
    <path d="M152 120c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.5-48-48-48zm295.1-88h-384C28.65 32-.01 60.65-.01 96v320c0 35.35 28.65 64 63.1 64h384c35.35 0 64-28.65 64-64V96c.01-35.35-27.79-64-63.99-64zm16 377.3L326.3 223.4c-2.5-4.6-8.2-7.4-14.3-7.4-6.113 0-11.82 2.768-15.21 7.379l-106.6 144.1-37.09-46.1c-3.441-4.279-8.934-6.809-14.77-6.809-5.842 0-11.33 2.529-14.78 6.809l-75.52 93.81c0-.03 0 .03 0 0L47.99 96c0-8.822 7.178-16 16-16h384c8.822 0 16 7.178 16 16v313.3z" />
  </svg>
);

export default PhotoIcon;
