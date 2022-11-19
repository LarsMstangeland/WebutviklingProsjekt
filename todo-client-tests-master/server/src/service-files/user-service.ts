import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Recipe } from './recipe-service';

export type User = {
  user_id: number;
  username: string;
  password: string;
  admin: boolean;
};

export type LikedRecipe = {
  recipe_id : number;
  name : string;
}

class UserService {
  /**
   * Get task with given id.
   */
  get(username : string) {
    return new Promise<User | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM user WHERE username = ?', [username], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as User);
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<User[]>((resolve, reject) => {
      pool.query('SELECT * FROM user', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as User[]);
      });
    });
  }

  getLikedRecipes(userId : number) {
    return new Promise<LikedRecipe[]>((resolve, reject) => {
      pool.query('SELECT r.recipe_id, r.name FROM recipes r, user_to_recipe utr WHERE utr.recipe_id = r.recipe_id AND utr.user_id = ?',
      [userId],
      (error, results: RowDataPacket[]) => {
        if(error) return reject(error)

        resolve(results as LikedRecipe[])
      }
      )
    })
  }

  /**
   * Create new user having the given username, password and admin rights declaration.
   *
   * Resolves the newly created user id.
   */
  create( password : string, username : string, admin : boolean) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO user (username, password, admin) VALUES (?,?,?)', [username, password, admin], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        resolve(results.insertId);
      });
    });
  }

  //created for beforeEach and afterAll on testing the database. This way the testUsers' id is always the same as the ones getting deleted without having to use truncate
  createForTest( user_id : number, password : string, username : string, admin : boolean) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO user (user_id, password, username, admin) VALUES (?,?,?,?)', [user_id, password, username, admin], 
        (error, results: ResultSetHeader) => {
          if(error) return reject(error);
          resolve(results.insertId);
        }
      )
    })
  }
  /**
   * Delete task with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM user WHERE user_id = ?', [id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        //if (results.affectedRows == 0) return reject(new Error('No row deleted'));
        resolve();
      });
    });
  }


  // reset() {
  //   return new Promise<void>((resolve,reject) => {
  //     pool.query(
  //       'TRUNCATE TABLE user', (error, results) => {
  //         if (error) return console.error(error);

  //         else return console.log(results);
  //       }
  //     )
  //   })
  // }

  likeRecipe(userId : number, recipeId : number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO user_to_recipe (user_id, recipe_id) VALUES (?, ?)', 
        [userId, recipeId],
        (error, results) => {
          if(error) return reject(error)

          resolve();
        }
      )
    })
  }

  removeLikedRecipe(userId : number, recipeId : number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM user_to_recipe WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId],
      (error, results: ResultSetHeader) => {
        if(error) return reject(error);
        if(results.affectedRows == 0) return reject(new Error('No row deleted'));

        resolve();
      }
      )
    })
  }
  
}

const userService = new UserService();
export default userService;
