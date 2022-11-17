import express, { response } from 'express';
import unitService, {Unit} from '../service-files/utility-service';

const UnitRouter = express.Router();

UnitRouter.get('', (_request, response) => {
    unitService
      .getAllUnit()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(404).send(error));
  });

export default UnitRouter;