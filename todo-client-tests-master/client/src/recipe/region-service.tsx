import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Region = {
    id: number;
    name: string;
}

class RegionService {

    get(id: number) {
        return axios.get<Region>('/regions/' + id).then((response) => response.data);
      }

    getAll() {
    return axios.get<Region[]>('/regions').then((response) => response.data);
  }
}

const regionService = new RegionService();
export default regionService;