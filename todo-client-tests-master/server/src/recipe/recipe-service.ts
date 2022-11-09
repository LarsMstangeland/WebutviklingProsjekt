import pool from '../mysql-pool';
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
    return new Promise<Recipe | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM recipes WHERE recipe_id = ?', [id], (error: any, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Recipe);
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Recipe[]>((resolve, reject) => {
      pool.query('SELECT * FROM recipes', (error: any, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Recipe[]);
      });
    });
  }



}

const recipeService = new RecipeService();
export default recipeService;
