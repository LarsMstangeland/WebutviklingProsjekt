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

    /**
     * Gets all the different '
     * units in the db
     * 
     * @returns Unit[]
     */

    getAllUnit() {
        return new Promise<Unit[]>((resolve, reject) => {
            pool.query('SELECT * FROM units', (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results as Unit[]);
            });
        });
    }

    
    /**
     * Gets all the different '
     * Types in the db
     * 
     * @returns type[]
     */

    getAllType() {
        return new Promise<Type[]>((resolve, reject) => {
            pool.query('SELECT * FROM types', (error: any, results: RowDataPacket[]) => {
              if (error) return reject(error);
      
              resolve(results as Type[]);
            });
        });
    }

    /**
     * gets a region based on id provided
     * @param id 
     * @returns 
     */
    
    getRegion(id: number) {
        return new Promise<Region | undefined>((resolve, reject) => {
            pool.query('SELECT * FROM region WHERE id = ?', [id], (error: any, results: RowDataPacket[]) => {
                if (error) return reject(error);
          
                resolve(results[0] as Region);
                });
            });
        }

    /**
     * gets all the regions that are present in db
     * 
     * @returns Region[]
     */
    
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