import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Type = {
    id: number;
    name: string;
}

export type Unit = {
    id: number;
    unit: string;
}

export type Region = {
    id: number;
    name: string;
}

class UtilityService{
    getAllUnit() {
        return new Promise<Unit[]>((resolve, reject) => {
            pool.query('SELECT * FROM units', (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results as Unit[]);
            });
        });
    }

    /*
    get(id: number) {
        return new Promise<Type | undefined>((resolve, reject) => {
            pool.query('SELECT * FROM types WHERE id = ?', [id], (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results[0] as Type);
            });
          });
    }*/

    getAllType() {
        return new Promise<Type[]>((resolve, reject) => {
            pool.query('SELECT * FROM types', (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results as Type[]);
            });
        });
    }
    
    getRegion(id: number) {
        return new Promise<Region | undefined>((resolve, reject) => {
            pool.query('SELECT * FROM region WHERE id = ?', [id], (error: any, results: RowDataPacket[]) => {
                if (error) return reject(error);
          
                resolve(results[0] as Region);
                });
            });
        }
    
    getAllRegion() {
        return new Promise<Region[]>((resolve, reject) => {
            pool.query('SELECT * FROM region', (error: any, results: RowDataPacket[]) => {
                if (error) return reject(error);
          
                resolve(results as Region[]);
            });
        });
    }


}
const utilityService = new UtilityService();
export default utilityService;