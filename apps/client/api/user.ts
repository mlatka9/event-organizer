import { UpdateUserInputType, UserType } from '@event-organizer/shared-types';
import api from '../lib/api';

const getUser = async (id: string): Promise<UserType> => {
  const { data } = await api.get(`/users/${id}`, {
    withCredentials: true,
  });
  return data;
};

const updateUser = async (updateUserData: UpdateUserInputType & { userId: string }) => {
  const { data } = await api.patch(`/users/${updateUserData.userId}`, updateUserData, {
    withCredentials: true,
  });
  return data;
};

const userAPI = { getUser, updateUser };

export default userAPI;
