import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env['NX_API_URL']}/api`,
});

export default api;
