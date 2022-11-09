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
  ingredient_id: number;
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

  getRecipeIngredients(id: number){
    return axios.get<Ingredient[]>('/recipes/' + id + '/ingredients').then((response) => response.data);
  }
}

const recipeService = new RecipeService();
export default recipeService;
