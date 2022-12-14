import express from 'express';
import userService from '../service-files/user-service';

/**
 * Express router containing task methods.
 */
const UserRouter = express.Router();

UserRouter.get('', (_request, response) => {
  userService
    .getAll()
    .then((users) => users ? response.send(users) : response.status(404).send("error couldnt find users"))
    .catch((error) => response.status(500).send(error));
});

UserRouter.get('/:username', (request, response) => {
  const username = request.params.username;
  userService
    .get(username)
    .then((user) => (user ? response.send(user) : response.status(404).send('User not found')))
    .catch((error) => response.status(500).send(error));
});

UserRouter.post('', (request, response) => {

  const password = request.body.password;
  const username = request.body.username;
  const admin = request.body.admin;
    userService
      .create(password, username, admin)
      .then((id) => response.send({id: id}))
      .catch((error) => response.status(500).send(error));
});

UserRouter.post('/:id/like', (request, response) => {

  const userId = request.body.userId;
  const recipeId = Number(request.params.id);

  userService.likeRecipe(userId, recipeId)
  .then(() => {
    response.send();
  }).catch((error)=> response.status(400).send(error))
})


UserRouter.delete('/:id', (request, response) => {
  userService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

UserRouter.get('/recipes/:userId', (request, response)=> {
  const userId = Number(request.params.userId)
  userService.getLikedRecipes(userId)
  .then((rows) => rows ? response.send(rows) : response.send("No liked recipes"))
  .catch((error) => response.status(500).send(error));
})

UserRouter.get('/recipes/all/MostLikedRecipes', (_request, response)=> {
  userService.getMostLikedRecipe()
  .then((rows) => rows ? response.send(rows) : response.send("No liked recipes"))
  .catch((error) => response.status(500).send(error));
})

UserRouter.delete('/:userId/recipes/:recipeId', (request, response) => {

  const userId = Number(request.params.userId)
  const recipeId = Number(request.params.recipeId)
  userService.removeLikedRecipe(userId, recipeId)
  .then((_result) => response.send())
  .catch((error) => response.status(500).send(error))
})
export default UserRouter;
