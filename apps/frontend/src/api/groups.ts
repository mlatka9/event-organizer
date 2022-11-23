import {
  CreateGroupInputType,
  GetAllGroupsQueryParamsType,
  GetAllGroupsReturnType,
} from '@event-organizer/shared-types';
import api from '../libs/api/api';

const createGroup = async (groupData: CreateGroupInputType): Promise<{ id: string }> => {
  const { data } = await api.post('/groups', groupData, {
    withCredentials: true,
  });
  return data;
};

const getGroups = async (params: GetAllGroupsQueryParamsType): Promise<GetAllGroupsReturnType> => {
  const { data } = await api.get('/groups', {
    params,
    withCredentials: true,
  });
  return data;
};

const groupsAPI = {
  createGroup,
  getGroups,
};

export default groupsAPI;
