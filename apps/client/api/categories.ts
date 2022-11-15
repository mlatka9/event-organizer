import { CategoryType } from '@event-organizer/shared-types';
import api from '../lib/api';

const getCategories = async (): Promise<CategoryType[]> => {
  const { data } = await api.get('/categories');
  return data;
};

const categoriesAPI = {
  getCategories,
};

export default categoriesAPI;
