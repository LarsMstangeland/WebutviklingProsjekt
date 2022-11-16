import express, { response } from 'express';
import unitService, {Unit} from '../service-files/unit-service';

const UnitRouter = express.Router();

UnitRouter.get('', (_request, response) => {
    unitService
      .getAll()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  });

export default UnitRouter;