import express, { response } from 'express';
import utilityService from '../service-files/utility-service';

const TypeRouter = express.Router();

TypeRouter.get('', (_request, response) => {
    utilityService
      .getAllType()
      .then((rows) => rows ? response.send(rows) : response.status(404).send('Types not found'))
      .catch((error) => response.status(500).send(error));
  });

/*
TypeRouter.get('/:id', (request, response) => {
    const id = Number(request.params.id);
    utilityService
      .getType(id)
      .then((recipe) => (recipe ? response.send(recipe) : response.status(404).send('Type not found')))
      .catch((error) => response.status(500).send(error));
  });*/

export default TypeRouter;