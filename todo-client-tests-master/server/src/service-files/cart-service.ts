import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Ingredient } from './recipe-service';

export type CartItem = {
  cart_id: number;
  ingredients: string;
};


class CartService{

    get(id: number) {
        return new Promise<CartItem[] | undefined>((resolve, reject) => {
          pool.query('SELECT * FROM cart WHERE user_id = ?', [id], (error: any, results: RowDataPacket[]) => {
            if (error) return reject(error);
    
            resolve(results as CartItem[]);
          });
        });
      }


    delete(id: number) {

        return new Promise<void>((resolve, reject) => {
          pool.query('DELETE FROM cart WHERE cart_id = ?', [id], (error: any, results: RowDataPacket[]) => {
            if (error) return reject(error);
    
            resolve();
          });
        });
    }

    //created only for the testing of the calls
    createForTest(cart_id : number, user_id : number, ingredient : string) {
      return new Promise<number>((resolve, reject) => {
        pool.query('INSERT INTO cart (cart_id, user_id, ingredients) VALUES (?,?,?)', [cart_id, user_id, ingredient]), 
        (error : any, results : ResultSetHeader) => {
          if (error) return reject(error);
          resolve(results.insertId)
        }
      })
    }

}



const cartService = new CartService();
export default cartService;
