import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Region = {
    id: number;
    name: string;
}

class RegionService {

    get(id: number) {
        return new Promise<Region | undefined>((resolve, reject) => {
            pool.query('SELECT * FROM region WHERE id = ?', [id], (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results[0] as Region);
            });
          });
    }

    getAll() {
        return new Promise<Region[]>((resolve, reject) => {
            pool.query('SELECT * FROM region', (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results as Region[]);
            });
          });
    }
}

const regionService = new RegionService();
export default regionService;