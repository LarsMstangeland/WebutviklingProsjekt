import express, { response } from 'express';
import recipeService, {Recipe, Ingredient} from './recipe-service';

/**
 * Express router containing task methods.
 */
const RecipeRouter = express.Router();

RecipeRouter.get('/recipes', (_request, response) => {
  recipeService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

RecipeRouter.get('/recipes/:id', (request, response) => {
  const id = Number(request.params.id);
  recipeService
    .get(id)
    .then((recipe) => (recipe ? response.send(recipe) : response.status(404).send('Recipe not found')))
    .catch((error) => response.status(500).send(error));
});

RecipeRouter.get('/recipes/:id/ingredients', (request, response) => {

    const id = Number(request.params.id);
    recipeService
    .getAllRecipeIngredients(id)
    .then((recipeIngredients) => (recipeIngredients ? response.send(recipeIngredients) : response.status(404).send('Could not find ingredients')))
    .catch((error) => response.status(500).send(error))
    })

  RecipeRouter.delete('/recipes/:id', (request, response) => {
    recipeService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
  })
// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }


  RecipeRouter.put('/recipes/:id/edit', (request, response) => {
    //hent ut de normale dataen og gjør det mulig å redigere
    //bruker patch for å være økonomiske med kjøretid

    const data = request.body
    recipeService.updateRecipe(data)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error))
  })

  
  RecipeRouter.put('/recipes/:id/edit/ingredients', (request,response) => {
    //oppdaterer ingridients inn til en gitt recipie
    //bruker patch for å være økonomiske med kjøretid
    const data = request.body
    const id = Number(request.params.id)
    recipeService.updateRecipeIngredients(id, data)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error))
  })




/*

RecipeRouter.post('/recipies', (request, response) => {
  const data = request.body;
  if (data && data.title && data.title.length != 0)
    RecipeService
      .create(data.title)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing recipies');
});

RecipeRouter.delete('/recipies/:id', (request, response) => {
  userService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});
*/

export default RecipeRouter;
