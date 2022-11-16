import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Type = {
    id: number;
    name: string;
}

class TypeService {

    /*
    get(id: number) {
        return new Promise<Type | undefined>((resolve, reject) => {
            pool.query('SELECT * FROM types WHERE id = ?', [id], (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results[0] as Type);
            });
          });
    }*/

    getAll() {
        return new Promise<Type[]>((resolve, reject) => {
            pool.query('SELECT * FROM types', (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results as Type[]);
            });
          });
    }
}

const typeService = new TypeService();
export default typeService;