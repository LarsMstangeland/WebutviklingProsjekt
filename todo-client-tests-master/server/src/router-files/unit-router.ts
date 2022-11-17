import express, { response } from 'express';
import unitService, {Unit} from '../service-files/utility-service';

const UnitRouter = express.Router();

UnitRouter.get('', (_request, response) => {
    unitService
      .getAllUnit()
      .then((rows) => rows ? response.send(rows) : response.status(404).send('Units not found'))
      .catch((error) => response.status(500).send(error));
  });

export default UnitRouter;