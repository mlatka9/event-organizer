import api from '../libs/api/api';
import { CredentialsType, SessionType } from '@event-organizer/shared-types';
import { APIError } from '../libs/api/types';

const register = async (registerData: CredentialsType) => {
  const { data } = await api.post('/auth/register', registerData);
  return data;
};

const login = async (registerData: CredentialsType): Promise<SessionType> => {
  const { data } = await api.post<SessionType>('/auth/login', registerData, {
    withCredentials: true,
  });
  return data;
};

const logout = async () => {
  return await api.get('/auth/logout', {
    withCredentials: true,
  });
};

const me = async (): Promise<SessionType> => {
  const { data } = await api.get('/auth/me', {
    withCredentials: true,
  });
  return data;
};

const authAPI = {
  me,
  register,
  login,
  logout,
};

export default authAPI;
