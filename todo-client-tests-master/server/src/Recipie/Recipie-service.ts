import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Recipe = {
  id: number;
  name: string;
  description: number;
  region: string;

};

class RecipeService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return new Promise<User | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM bruker WHERE id = ?', [id], (error, results: RowDataPacket[]) => {
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
      pool.query('SELECT * FROM Bruker', (error, results: RowDataPacket[]) => {
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
  create(title: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO Tasks SET title=?', [title], (error, results: ResultSetHeader) => {
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
      pool.query('DELETE FROM Tasks WHERE id = ?', [id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) return reject(new Error('No row deleted'));

        resolve();
      });
    });
  }
}

const recipieService = new ();
export default recipieService;
