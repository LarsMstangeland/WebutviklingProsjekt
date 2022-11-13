import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Cart = {
  cart_id: number;
  ingredient: string;
};


class Cartservice{

    get(id: number) {
        return new Promise<Cart | undefined>((resolve, reject) => {
          pool.query('SELECT * FROM cart WHERE cart_id = ?', [id], (error: any, results: RowDataPacket[]) => {
            if (error) return reject(error);
    
            resolve(results[0] as Cart);
          });
        });
    }

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
