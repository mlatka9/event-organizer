import { useQuery } from '@tanstack/react-query';
import categoriesAPI from '../../api/categories';

export const useCategoriesQuery = () => {
  return useQuery(['categories'], categoriesAPI.getCategories);
};
