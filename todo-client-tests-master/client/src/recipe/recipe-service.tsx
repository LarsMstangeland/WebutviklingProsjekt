import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

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
   * Get recipe with given id.
   */
  get(id: number) {
    return axios.get<Recipe>('/recipes/' + id).then((response) => response.data);
  }

  /**
   * Get all recipes.
   */
  getAll() {
    return axios.get<Recipe[]>('/recipes').then((response) => response.data);
  }

  /**
   * Gets all ingredients for a recipe
   */
  getRecipeIngredients(id: number){
    return axios.get<Ingredient[]>('/recipes/' + id + '/ingredients').then((response) => response.data);
  }

  /**
   * Deletes a recipe
   */
  delete(id: number){
    return axios.delete<Recipe>('/recipes/' + id)
    .then((response) => response.data)
    .catch((error) => console.error(error));
  }

  update(recipe: Recipe){
    return axios
      .put('/recipes/' + recipe.recipe_id + '/edit', {
        recipe_id: recipe.recipe_id,
        name: recipe.name,
        picture_url: recipe.picture_url,
        description: recipe.description,
        region: recipe.region
      })
      .then((response) => response.data.id);
  }
}

const recipeService = new RecipeService();
export default recipeService;
