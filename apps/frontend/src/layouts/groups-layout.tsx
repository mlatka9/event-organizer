import Header from '../components/common/header';
import { Outlet } from 'react-router-dom';

const GroupsLayout = () => {
  return (
    <div className={'grid grid-cols-[260px_1fr] min-h-screen'}>
      <Header />
      <main className="mx-auto max-w-[1200px] w-full h-full flex flex-col items-center">
        <Outlet />
      </main>
    </div>
  );
};

export default GroupsLayout;
