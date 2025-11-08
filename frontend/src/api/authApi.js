import axiosInstance from './axiosInstance'

export const signup = (data) => axiosInstance.post('/auth/signup', data).then(r=>r.data)
export const login = (data) => axiosInstance.post('/auth/login', data).then(r=>r.data)
