import client from './client';

export const login = (payload) => client.post('/api/auth/login', payload);

export const submitMembershipApplication = (payload) => client.post('/api/auth/register', payload);
