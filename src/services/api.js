import http from './http.js';

export const api = {
  getMaterials(params) {
    return http.get('/materials', { params });
  },
  searchMaterials(data) {
    return http.post('/materials/search', data);
  },
  getProjects(params) {
    return http.get('/projects', { params });
  },
  uploadMaterial(data, config) {
    return http.post('/materials/upload', data, config);
  },
};
