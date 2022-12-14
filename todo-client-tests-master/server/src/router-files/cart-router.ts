import express, { request, response } from 'express';
import cartService from '../service-files/cart-service';


const CartRouter = express.Router();

CartRouter.get('/:id', (request, response) => {

    const id = Number(request.params.id)

  cartService
    .get(id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(404).send(error));
});

CartRouter.delete('/:id', (request, response) => {

    const id = Number(request.params.id)
  cartService
    .delete(id)
    .then((_result) => response.send())
    .catch((error) => response.status(404).send(error));
});

export default CartRouter
