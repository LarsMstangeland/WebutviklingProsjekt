import express, { response } from 'express';
import TypeService, {Type} from '../service-files/type-service';

const TypeRouter = express.Router();

TypeRouter.get('', (_request, response) => {
    TypeService
      .getAll()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  });

/*
TypeRouter.get('/:id', (request, response) => {
    const id = Number(request.params.id);
    TypeService
      .get(id)
      .then((recipe) => (recipe ? response.send(recipe) : response.status(404).send('Type not found')))
      .catch((error) => response.status(500).send(error));
  });*/

export default TypeRouter;