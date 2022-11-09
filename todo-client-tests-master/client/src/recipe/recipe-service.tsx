import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Recipe = {
  id: number;
  name: string;
  description: string;
  region: string;
};

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
}

const recipeService = new RecipeService();
export default recipeService;
