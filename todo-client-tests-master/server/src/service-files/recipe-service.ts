import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { resolve } from 'path';
import { rejects } from 'assert';

export type Recipe = {
  recipe_id: number;
  name: string;
  region: string;
  type: string;
  picture_url: string;
  description: string;
};

export type Ingredient = {
  ingredients_id: number;
  name: string;
  amount: number;
  unit: string;
  // type: string;
};

export type IngredientName = {
  ingredients_id: number;
  name: string;
};

export type RecipeToIngredient = {
  ingredients_id: number;
  recipe_id: number;
  amount: number;
  unit: string;
}

class RecipeService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return new Promise<Recipe | undefined>((resolve, reject) => {
      pool.query(
        'SELECT * FROM recipes WHERE recipe_id = ?',
        [id],
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as Recipe);
        }
      );
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

  /**
   * gets the all the ingredients 
   * in a given recipe
   * 
   * @param id 
   * @returns Ingredient[]
   */

  getRecipeIngredients(id: number) {
    return new Promise<Ingredient[]>((resolve, reject) => {
      pool.query(
        'SELECT i.ingredients_id, i.name, itr.amount, itr.unit FROM `ingredients_to_recipe` itr, `recipes` r, `ingredients` i WHERE r.recipe_id = itr.recipe_id AND i.ingredients_id = itr.ingredients_id AND r.recipe_id = ?',
        [id],
        (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Ingredient[]);
        }
      );
    });
  }

  /**
   * gets all the ingredients from the database
   * @returns Ingredient[]
   */


  getAllIngredients() {
    return new Promise<IngredientName[]>((resolve, reject) => {
      pool.query('SELECT * FROM ingredients', (error: any, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as IngredientName[]);
      });
    });
  }

  
  /**
   * gets all the ingredients from the database
   * @returns Ingredient[]
   */
  getIngredients() {
    return new Promise<Ingredient[]>((resolve, reject) => {
      pool.query('SELECT * FROM ingredients', (error: any, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Ingredient[]);
      });
    });
  }

    /**
   * deletes a ingredients based on number
   * 
   */

  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE a.*, b.* FROM ingredients_to_recipe as a, recipes as b WHERE a.recipe_id = b.recipe_id AND a.recipe_id = ?',
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) return reject(new Error('No row deleted'));

          resolve();
        }
      );
    });
  }

  /**
   * takes a recipe and deletes a given set of ingredients
   * @param id 
   * @param ingredients 
   * 
   */


  deleteRecipeIngredients(id: number, ingredients: Ingredient[]) {
    return new Promise<void>((resolve, reject) => {
      ingredients.map((ingredient) => {
        pool.query(
          'DELETE FROM ingredients_to_recipe WHERE recipe_id = ? AND ingredients_id = ?',
          [id, ingredient.ingredients_id],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            if (results.affectedRows == 0) return reject(new Error('No row deleted'));
          }
        );
      });

      resolve();
    });
  }

  /**
   * 
   * Uses all the nessesary params 
   * to create a recipe
   * 
   * @param name 
   * @param description 
   * @param picture_url 
   * @param region 
   * @param type 
   * @returns the inserted id
   */

  createRecipe(name: string, description: string, picture_url: string, region: string, type: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO recipes (name, region, picture_url, description, type) VALUES (?,?,?,?,?)',
        [name, region, picture_url, description, type],
        (error, results: ResultSetHeader) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          resolve(results.insertId);
        }
      );
    });
  }


  /**
   * Updates the normal values in a recipe
   * 
   * @param recipe 
   */

  updateRecipe(recipe: Recipe) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE recipes SET name = ?, region = ?, picture_url = ?, description = ?, type=? WHERE recipe_id = ?',
        [recipe.name, recipe.region, recipe.picture_url, recipe.description, recipe.type, recipe.recipe_id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) return reject(new Error('No row updated'));

          resolve();
        }
      );
    });
  }

  /**
   * updates the ingredients in a recipe
   * 
   * @param id 
   * @param ingredients 
   */


  updateRecipeIngredients(id: number, ingredients: Ingredient[]) {
    return new Promise<void>((resolve, reject) => {
      ingredients.map((ingredient: Ingredient) => {
        pool.query(
          'UPDATE ingredients_to_recipe SET amount = ?, unit = ? WHERE recipe_id = ? AND ingredients_id = ?',
          [ingredient.amount, ingredient.unit, id, ingredient.ingredients_id],
          (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            if (results.affectedRows == 0) return reject(new Error('No row updated'));
          }
        );
      });

      resolve();
    });
  }

  /**
   * adds a list of ingredients to a recipe
   * 
   * @param id 
   * @param ingredients 
   *  
   */

  addRecipeIngredient(id: number, ingredients : Ingredient[]) {
    return new Promise<void>((resolve, reject) => {
      ingredients.map((ingredient: Ingredient) => {
        pool.query(
          'INSERT INTO ingredients_to_recipe (amount, unit, ingredients_id, recipe_id) VALUES (?,?,?,?)',
          [ingredient.amount, ingredient.unit, ingredient.ingredients_id, id],
          (error, results: RowDataPacket[]) => {
            if (error) {
              console.log(error);
              return reject(error);
            }
          }
        );
      });
      resolve();
    });
  }

  /**
   * Takes inn a array of ingredients
   * and then adds the ingredients to the users cart
   * 
   * @param ingredients 
   * @param user_id 
   */

  AddIngredientsToCartFromRecipe(ingredients: Ingredient[], user_id: number){
    return new Promise<void>((resolve, reject) => {
        ingredients.map((ingredient) => {
          pool.query(
            'INSERT INTO cart (ingredients, user_id) VALUES (?,?)', [ingredient.name, user_id], (error) => {
              if (error) return reject(error);
              resolve();
            }
          )
        })      
      })
    }

    /**
     * creates a ingredient with the IngredientName object
     * 
     * @param ingredient 
     */

  createIngredient(ingredient: IngredientName){
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO ingredients (name) VALUES (?)', [ingredient.name], (error: any) => {
          if (error) return reject(error);
          resolve()
        }
      )
    })
  }
  /**
   * gets all the connections between recipes and ingredients
   * @returns 
   */

  getAllRecipeIngredients(){
    return new Promise<RecipeToIngredient[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM ingredients_to_recipe', (error: any, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as RecipeToIngredient[])
        }
      )
    })
  }
}

const recipeService = new RecipeService();
export default recipeService;
