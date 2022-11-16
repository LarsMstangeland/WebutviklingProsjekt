import express, { response } from 'express';
import regionService, {Region} from '../service-files/region-service';

const RegionRouter = express.Router();

RegionRouter.get('', (_request, response) => {
    regionService
      .getAll()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  });

RegionRouter.get('/:id', (request, response) => {
    const id = Number(request.params.id);
    regionService
      .get(id)
      .then((recipe) => (recipe ? response.send(recipe) : response.status(404).send('Region not found')))
      .catch((error) => response.status(500).send(error));
  });

export default RegionRouter;