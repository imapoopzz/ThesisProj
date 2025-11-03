import client from './client';

export const getAdminMember = (memberId) => client.get(`/api/admin/members/${memberId}`);
