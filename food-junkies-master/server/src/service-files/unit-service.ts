import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Unit = {
    id: number;
    unit: string;
}

class UnitService{

    getAll() {
        return new Promise<Unit[]>((resolve, reject) => {
            pool.query('SELECT * FROM units', (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results as Unit[]);
            });
          });
    }
}

const unitService = new UnitService();
export default unitService;