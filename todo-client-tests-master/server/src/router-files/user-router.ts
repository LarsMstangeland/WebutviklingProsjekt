import express from 'express';
import userService from '../service-files/user-service';

/**
 * Express router containing task methods.
 */
const UserRouter = express.Router();

UserRouter.get('', (_request, response) => {
  userService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(404).send(error));
});

UserRouter.get('/:username', (request, response) => {
  const username = request.params.username;
  userService
    .get(username)
    .then((task) => (task ? response.send(task) : response.status(404).send('User not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
UserRouter.post('', (request, response) => {

  const password = request.body.password;
  const username = request.body.username;
  const admin = request.body.admin;
    userService
      .create(password, username, admin)
      .then((id) => response.send({id: id}))
      .catch((error) => response.status(500).send(error.response.data));
});

UserRouter.delete('/:id', (request, response) => {
  userService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

UserRouter.get('/recipes/:userId', (request, response)=> {
  const userId = Number(request.params.userId)
  userService.getLikedRecipes(userId)
  .then((rows) => response.send(rows))
  .catch((error) => response.status(404).send(error));
})

UserRouter.delete('/:userId/recipes/:recipeId', (request, response) => {

  const userId = Number(request.params.userId)
  const recipeId = Number(request.params.recipeId)
  userService.removeLikedRecipe(userId, recipeId)
  .then((_result) => response.send())
  .catch((error) => response.status(500).send(error))
})
export default UserRouter;
