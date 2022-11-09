import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type User = {
  id: number;
  name: string;
  cart: number;
};

class RecipeService {
  /**
   * Get recipe with given id.
   */
  get(id: number) {
    return axios.get<User>('/recipes/' + id).then((response) => response.data);
  }

  /**
   * Get all recipes.
   */
  getAll() {
    return axios.get<User[]>('/recipes').then((response) => response.data);
  }
}

const recipeService = new RecipeService();
export default recipeService;