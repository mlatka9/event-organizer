import * as React from 'react';
import { SVGProps } from 'react';

const MapIcon = ({ width = 20, height = 20, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    width={width}
    height={height}
    className={'fill-gray-400'}
    {...rest}
  >
    <path d="M565.6 36.24C572.1 40.72 576 48.11 576 56v336c0 9.1-6.2 18.9-15.5 22.4l-168 64c-5.1 2-10.8 2.1-16.1.4l-183.9-61.3-159.96 60.9c-7.37 2.8-15.66 1.8-22.16-2.6A24.091 24.091 0 0 1 0 456V120c0-10 6.15-18.9 15.46-22.43l168.04-64c5.1-1.97 10.8-2.09 16.1-.34l183.9 61.29 160-60.95c7.3-2.81 15.6-1.81 22.1 2.67zM48 421.2l120-45.7V90.83L48 136.5v284.7zm312-283.9-144-48v285.4l144 48V137.3zm48 283.9 120-45.7V90.83L408 136.5v284.7z" />
  </svg>
);

export default MapIcon;
