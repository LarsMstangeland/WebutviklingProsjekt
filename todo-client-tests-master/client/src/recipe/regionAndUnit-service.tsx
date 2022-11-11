import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Region = {
    id: number;
    name: string;
}

export type Unit = {
  id: number;
  unit: string;
}

class RegionAndUnitsService {

  getRegion(id: number) {
      return axios.get<Region>('/regions/' + id).then((response) => response.data);
  }

  getAllRegions() {
    return axios.get<Region[]>('/regions').then((response) => response.data);
  }

  getAllUnits() {
    return axios.get<Unit[]>('/units').then((response) => response.data);
  }
}

const regionAndUnitsService = new RegionAndUnitsService();
export default regionAndUnitsService;