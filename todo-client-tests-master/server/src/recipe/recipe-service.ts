import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Recipe = {
  recipe_id: number;
  name: string;
  region: string;
  picture_url: string;
  description: string;
};

export type Ingredient = {
  ingredients_id: number;
  name: string;
  amount: number;
  unit: string;
}


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

  getAllRecipeIngredients(id: number) {
    return new Promise<Ingredient[]>((resolve, reject)=>{
      pool.query('SELECT i.ingredients_id, i.name, itr.amount, itr.unit FROM `ingredients_to_recipe` itr, `recipes` r, `ingredients` i WHERE r.recipe_id = itr.recipe_id AND i.ingredients_id = itr.ingredients_id AND r.recipe_id = ?', [id], (error: any, results: RowDataPacket[])=>{
        if(error) return reject(error);

        resolve(results as Ingredient[]);
      })
    })
  }

  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM recipes WHERE id = ?', [id], (error, results: ResultSetHeader) =>{
        if (error) return reject(error)
        if(results.affectedRows == 0) return reject(new Error('No row deleted'));

        resolve();
      })
    })
  }



}

const recipeService = new RecipeService();
export default recipeService;
