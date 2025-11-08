import axiosInstance from './axiosInstance'

export const requestLoan = (data) => axiosInstance.post('/loans', data).then(res=>res.data)
export const getAllLoans = () => axiosInstance.get('/loans').then(res=>res.data)
export const approveLoan = (id, data) => axiosInstance.put(`/loans/${id}/approve`, data).then(res=>res.data)
export const markReturned = (id) => axiosInstance.put(`/loans/${id}/return`).then(res=>res.data)
