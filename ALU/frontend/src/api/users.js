import client from './client';

export const fetchUser = (userId) => client.get(`/api/users/${userId}`);

export const fetchUserDues = (userId) => client.get(`/api/users/${userId}/dues`);

export const createDues = (userId, payload) => client.post(`/api/users/${userId}/dues`, payload);
