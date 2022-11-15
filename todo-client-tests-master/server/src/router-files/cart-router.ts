import express, { request, response } from 'express';
import cartService, { Cart } from '../service-files/cart-service';

/**
 * Express router containing task methods.
 */
const CartRouter = express.Router();

CartRouter.get('/:id', (request, response) => {

    const id = Number(request.params.id)

  cartService
    .get(id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

CartRouter.delete('/:id/:ingredient', (request, response) => {

    const id = Number(request.params.id)
    const ingredient = request.params.ingredient

  cartService
    .delete(ingredient, id)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default CartRouter
