import api from '../lib/api';

interface RegisterDataType {
  email: string;
  password: string;
}

interface LoginDataType {
  email: string;
  password: string;
}

interface MeType {
  userId: string;
}

const register = async (registerData: RegisterDataType) => {
  const { data } = await api.post('/auth/register', registerData);
  return data;
};

const login = async (registerData: LoginDataType) => {
  const { data } = await api.post('/auth/login', registerData, {
    withCredentials: true,
  });
  return data;
};

const logout = async () => {
  const { data } = await api.get('/auth/logout', {
    withCredentials: true,
  });
  return data;
};

const me = async (): Promise<MeType> => {
  const { data } = await api.get('/auth/me', {
    withCredentials: true,
  });
  return data;
};

const authAPI = {
  register,
  login,
  logout,
  me,
};
export default authAPI;
