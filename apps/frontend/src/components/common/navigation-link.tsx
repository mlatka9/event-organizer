import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import UserIcon from '../icons/user-icon';

interface NavigationLinkProps {
  href: string;
  label: string;
}

const NavigationLink = ({ href, label }: NavigationLinkProps) => {
  return (
    <NavLink to={href} className={({ isActive }) => clsx('flex p-5 relative', isActive && 'group active-link')} end>
      <UserIcon className={clsx('group-[.active-link]:fill-blue-500')} />
      <p className={clsx('ml-2 group-[.active-link]:text-blue-500')}>{label}</p>
      <div
        className={clsx(
          'w-1 h-10 rounded-r bg-blue-500 absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-[.active-link]:opacity-100'
        )}
      />
    </NavLink>
  );
};

export default NavigationLink;
