import { AuthProvider } from './providers/auth-provider';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/main-layout';
import HomePage from './pages/home/home-page';
import LoginPage from './pages/login/login-page';
import EventsPage from './pages/events/events-home/events-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateEventPage from './pages/events/create-event/create-event-page';
import RegisterPage from './pages/register/register-page';
import LoginLayout from './layouts/login-layout';
import EventLayout from './layouts/events-layout';
import UserProfilePage from './pages/user-profile/user-profile-page';
import UserProfileLayout from './layouts/user-profile-layout';
import NotFoundPage from './pages/not-found/not-found-page';
import UserEventsPage from './pages/user-profile/user-events-page';
import UserGroupsPage from './pages/user-profile/user-groups-page';
import EventDetailsPage from './pages/events/event-details/event-details-page';
import EventParticipantsPage from './pages/events/event-details/event-participants-page';
import EventSettingsPage from './pages/events/event-details/event-settings-page';
import RequireAuth from './components/common/require-auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventSettingsLayout from './layouts/event-settings-layout';
import EventSettingsModulesPage from './pages/events/event-details/event-settings-modules-page';

import dayjs from 'dayjs';

require('dayjs/locale/pl');
dayjs.locale('pl');

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path={'/'} element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path={'events'} element={<EventsPage />} />
            <Route
              path={'events/create'}
              element={
                <RequireAuth>
                  <CreateEventPage />
                </RequireAuth>
              }
            />
          </Route>
          <Route path={'/users/:id'} element={<UserProfileLayout />}>
            <Route index element={<UserProfilePage />} />
            <Route path={'events'} element={<UserEventsPage />} />
            <Route path={'groups'} element={<UserGroupsPage />} />
          </Route>
          <Route path={'/'} element={<LoginLayout />}>
            <Route path={'login'} element={<LoginPage />} />
            <Route path={'register'} element={<RegisterPage />} />
          </Route>
          <Route path={'/events/:id'} element={<EventLayout />}>
            <Route index element={<EventDetailsPage />} />
            <Route path={'participants'} element={<EventParticipantsPage />} />
            <Route path={'settings'} element={<EventSettingsLayout />}>
              <Route index element={<EventSettingsPage />} />
              <Route path={'modules'} element={<EventSettingsModulesPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;