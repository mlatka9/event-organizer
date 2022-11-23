import Header from '../components/common/header';
import { Outlet } from 'react-router-dom';

const GroupsLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1200px] pt-[80px] h-full flex flex-col">
        <Outlet />
      </main>
    </>
  );
};

export default GroupsLayout;
