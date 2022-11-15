import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Ingredient } from './recipe-service';

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
    delete(id: number) {

      console.log(id)

        return new Promise<void>((resolve, reject) => {
          pool.query('DELETE FROM cart WHERE cart_id = ?', [id], (error: any, results: RowDataPacket[]) => {
            if (error) return reject(error);
    
            resolve();
          });
        });
    }

}



const cartService = new Cartservice();
export default cartService;
