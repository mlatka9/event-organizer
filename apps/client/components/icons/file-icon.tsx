import * as React from 'react';
import { SVGProps } from 'react';

const FileIcon = ({ width = 20, height = 20, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 384 512"
    {...rest}
    className={'fill-gray-400'}
  >
    <path d="m365.3 93.38-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.006 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6c0-16.9-6.7-33.2-18.7-45.22zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160V128c0 17.67 14.33 32 32 32h79.1v288zM96 280c0 13.3 10.8 24 24 24h144c13.3 0 24-10.7 24-24s-10.7-24-24-24H120c-13.2 0-24 10.8-24 24zm168 72H120c-13.2 0-24 10.8-24 24s10.75 24 24 24h144c13.25 0 24-10.75 24-24s-10.7-24-24-24z" />
  </svg>
);

export default FileIcon;
