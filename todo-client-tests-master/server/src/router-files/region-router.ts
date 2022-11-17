import express, { response } from 'express';
import utilityService from '../service-files/utility-service';
import regionService, {Region} from '../service-files/utility-service';

const RegionRouter = express.Router();

RegionRouter.get('', (_request, response) => {
    utilityService
      .getAllRegion()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(404).send(error));
  });

RegionRouter.get('/:id', (request, response) => {
    const id = Number(request.params.id);
    utilityService
      .getRegion(id)
      .then((recipe) => (recipe ? response.send(recipe) : response.status(404).send('Region not found')))
      .catch((error) => response.status(404).send(error));
  });

export default RegionRouter;