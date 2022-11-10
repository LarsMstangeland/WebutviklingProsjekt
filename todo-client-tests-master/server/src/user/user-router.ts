import express from 'express';
import userService from './user-service';

/**
 * Express router containing task methods.
 */
const UserRouter = express.Router();

UserRouter.get('', (_request, response) => {
  userService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

UserRouter.get('/:id', (request, response) => {
  const id = Number(request.params.id);
  userService
    .get(id)
    .then((task) => (task ? response.send(task) : response.status(404).send('Recipie not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
UserRouter.post('', (request, response) => {
  const data = request.body;
  if (data && data.title && data.title.length != 0)
    userService
      .create(data.title)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing recipes');
});

UserRouter.delete('/:id', (request, response) => {
  userService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default UserRouter;
