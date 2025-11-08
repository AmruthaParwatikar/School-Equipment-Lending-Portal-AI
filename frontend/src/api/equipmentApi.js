import axiosInstance from './axiosInstance'

export const getAllEquipment = (params = {}) =>
  axiosInstance.get('/equipment', { params }).then(res => res.data)

export const addEquipment = (data) => axiosInstance.post('/equipment', data).then(res=>res.data)

export const updateEquipment = (id, data) =>
  axiosInstance.put(`/equipment/${id}`, data).then(res=>res.data)

export const deleteEquipment = (id) =>
  axiosInstance.delete(`/equipment/${id}`).then(res=>res.data)
