import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type CartItem = {
  cart_id: number;
  ingredients: string;
};


class Cartservice{

    get(id: number) {
        return new Promise<CartItem[] | undefined>((resolve, reject) => {
          pool.query('SELECT * FROM cart WHERE user_id = ?', [id], (error: any, results: RowDataPacket[]) => {
            if (error) return reject(error);
    
            resolve(results as CartItem[]);
          });
        });
    }

    //burde vi bruke ingredient objekt?
    delete(ingrediens: string, id: number) {
        return new Promise<void>((resolve, reject) => {
          pool.query('DELETE * FROM cart WHERE ingredients = ? AND cart_id = ?', [ingrediens, id], (error: any, results: RowDataPacket[]) => {
            if (error) return reject(error);
    
            resolve();
          });
        });
    }

}



const cartService = new Cartservice();
export default cartService;
