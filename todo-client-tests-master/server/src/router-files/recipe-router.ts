import express, { request, response } from 'express';
import recipeService, {Recipe, Ingredient, IngredientName} from '../service-files/recipe-service';

/**
 * Express router containing task methods.
 */
const RecipeRouter = express.Router();

RecipeRouter.get('/', (_request, response) => {
  recipeService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

RecipeRouter.get('/:id', (request, response) => {
  const id = Number(request.params.id);
  recipeService
    .get(id)
    .then((recipe) => (recipe ? response.send(recipe) : response.status(404).send('Recipe not found')))
    .catch((error) => response.status(500).send(error));
});

RecipeRouter.get('/:id/ingredients', (request, response) => {

    const id = Number(request.params.id);
    recipeService
    .getAllRecipeIngredients(id)
    .then((recipeIngredients) => (recipeIngredients ? response.send(recipeIngredients) : response.status(404).send('Could not find ingredients')))
    .catch((error) => response.status(500).send(error))
    })

  RecipeRouter.delete('/:id', (request, response) => {
    recipeService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
  })
// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }

  RecipeRouter.post('/add', (request, response) => {
    const name = request.body.name;
    const description = request.body.description;
    const picture_url = request.body.picture_url;
    const region = request.body.region;
    // console.log(recipe)
    recipeService.createRecipe(name, description, picture_url, region)
    .then((id) => response.send({id:id}))
    .catch((error) => response.status(500).send(error));
  })

  RecipeRouter.put('/:id/edit', (request, response) => {
    //hent ut de normale dataen og gjør det mulig å redigere
    //bruker patch for å være økonomiske med kjøretid
    const data = request.body
    recipeService.updateRecipe(data)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error))
  })

  
  RecipeRouter.put('/:id/edit/ingredients', (request,response) => {
    //oppdaterer ingredients inn til en gitt recipie
    //bruker patch for å være økonomiske med kjøretid
    const ingredients = request.body.ingredients
    const id = Number(request.params.id)
    recipeService.updateRecipeIngredients(id, ingredients)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error))
  })

  RecipeRouter.delete('/:id/edit', (request,response) => {
    //oppdaterer ingredients inn til en gitt recipie
    const data = request.body.ingredientsToDelete
    const id = Number(request.params.id)
    recipeService.deleteRecipeIngredients(id, data)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error))
  })

  RecipeRouter.get('/:id/edit/ingredients', (_request, response) => {    
    recipeService
      .getAllIngredients()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  });

  RecipeRouter.get('/ingredients', (_request, response) => {
    recipeService
      .getIngredients()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  })
  RecipeRouter.post('/:id/edit/ingredients', (request, response) => {
    const data = request.body.ingredients;
    const id = Number(request.params.id);
  
      recipeService
        .addRecipeIngredient(id, data)
        .then(() => {
          response.send();
        })
        .catch((error) => response.status(500).send(error));
  });


  /*
RecipeRouter.post('/recipies/addRecipe', (request, response) => {
  const newrecipe = request.body
  if (id)
    recipeService
      .createRecipe(id)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing UserId');
});

*/

export default RecipeRouter;
