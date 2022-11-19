import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/api/v2';

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
};

export type IngredientName = {
  ingredients_id: number;
  name: string;
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

  /**
   * Gets all ingredients for a recipe
   */
  getRecipeIngredients(id: number) {
    return axios
      .get<Ingredient[]>('/recipes/' + id + '/ingredients')
      .then((response) => response.data);
  }

  /**
   * Get all ingredients.
   */
  getAllIngredients(id: number) {
    return axios
      .get<IngredientName[]>('/recipes/' + id + '/edit/ingredients')
      .then((response) => response.data)
      .catch((error) => console.log(error));
  }

  getIngredients() {
    return axios
      .get<Ingredient[]>('/recipes/ingredients/all')
      .then((response) => response.data)
      .catch((error) => console.log(error));
  }
  /**
   * Deletes a recipe
   */
  delete(id: number) {
    return axios
      .delete<Recipe>('/recipes/' + id)
      .then((response) => response.data)
      .catch((error) => console.error(error));
  }

  /**
   * Updates a recipe
   */
  update(recipe: Recipe) {
    return axios
      .put('/recipes/' + recipe.recipe_id + '/edit', {
        recipe_id: recipe.recipe_id,
        name: recipe.name,
        picture_url: recipe.picture_url,
        description: recipe.description,
        region: recipe.region,
        type: recipe.type,
      })
      .then((response) => response.data.id);
  }

  deleteRecipeIngredients(ingredientsToDelete: Ingredient[], id: number) {
    return axios
      .delete('/recipes/' + id + '/edit', {
        data: { ingredientsToDelete },
      })
      .then((response) => response.data)
      .catch((error) => console.log(error))  
  }

  updateRecipeIngredients(ingredients: Ingredient[], id: number) {
    return axios
      .put('/recipes/' + id + '/edit/ingredients', {
        ingredients,
      })
      .then((response) => response.data)
      .catch((error) => console.log(error));
  }

  addRecipeIngredient(ingredients: Ingredient[], id: number){ 
    return axios
      .post('/recipes/' + id + '/edit/ingredients', { ingredients })
      .then((response) => response.data.id)
      .catch((error) => console.log(error));
  }

  addRecipe(name: string, description: string, picture_url: string, region: string, type: string) {
    return axios
      .post('/recipes/add', {
        name: name,
        description: description,
        picture_url: picture_url,
        region: region,
        type: type
      })
      .then((response) => response.data.id)
      .catch((error) => console.log(error));
  }

  /**
   * Adds all ingredients of a spesific recipe to the cart of the current logged in user
   */
  addRecipeIngredientsToCart(ingredients: Ingredient[], id: number, user_id: number){
    return axios
      .post('/recipes/' + id + '/ingredients', {ingredients, user_id})
      .then((response) => response.data.id)
      .catch((error) => console.log(error));
  }

  addNewIngredient(ingredient: IngredientName){
    return axios
      .post('/recipes/ingredients/edit', {ingredient})
      .then((response) => response.data)
      .catch((error) => console.log(error))
  }
}

const recipeService = new RecipeService();
export default recipeService;
