import express, { response } from 'express';
import utilityService from '../service-files/utility-service';

const TypeRouter = express.Router();

TypeRouter.get('', (_request, response) => {
    utilityService
      .getAllType()
      .then((rows) => rows ? response.send(rows) : response.status(500).send("Could not find types"))
      .catch((error) => response.status(500).send(error));
  });

export default TypeRouter;