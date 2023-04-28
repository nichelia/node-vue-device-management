import axios from 'axios';

interface Device {
  id?: number;
  brand: string;
  model: string;
  os?: string;
  release_date?: string;
}

const API_BASE_URL = 'http://localhost:8081';

export default {

  async fetch(): Promise<Device[]> {
    const response = await axios.get(`${API_BASE_URL}/devices`);
    const items = response.data;
    return items;
  },

  async getById(id: string): Promise<Device> {
    const response = await axios.get(`${API_BASE_URL}/devices/${id}`);
    return response.data;
  },

  async create(data: Device): Promise<Device> {
    const response = await axios.post(`${API_BASE_URL}/devices`, data);
    return response.data;
  },

  async update(id: string, data: Device): Promise<Device> {
    const response = await axios.put(`${API_BASE_URL}/devices/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/devices/${id}`);
  },
};
