import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type User = {
  user_id: number;
  username: string;
  cart_id: number;
  password: string;
  admin: boolean;
};

class UserService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return new Promise<User | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM user WHERE user_id = ?', [id], (error, results: RowDataPacket[]) => {
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

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create( user : User) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO user SET (username, password, admin) VALUES (?,?,?)', [user.username, user.password, user.admin], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        resolve(results.insertId);
      });
    });
  }

  /**
   * Delete task with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM User WHERE user_id = ?', [id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) return reject(new Error('No row deleted'));

        resolve();
      });
    });
  }
}

const userService = new UserService();
export default userService;
