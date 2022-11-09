import express from 'express';
import RecipeService from './Recipe-service';

/**
 * Express router containing task methods.
 */
const RecipeRouter = express.Router();

RecipeRouter.get('/recipes', (_request, response) => {
  RecipeService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

RecipeRouter.get('/recipes/:id', (request, response) => {
  const id = Number(request.params.id);
  RecipeService
    .get(id)
    .then((task) => (task ? response.send(task) : response.status(404).send('Recipie not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }

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
