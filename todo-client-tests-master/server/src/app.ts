import express from 'express';
import RecipeRouter from './recipe/recipe-router';
import UserRouter from './user/user-router';
import RegionRouter from './region/region-router';
import CartRouter from './cart/cart-router';
import UnitRouter from './unit/unit-router';


/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2/users', UserRouter);
app.use('/api/v2/recipes', RecipeRouter);
app.use('/api/v2/regions', RegionRouter);
app.use('/api/v2/cart', CartRouter);
app.use('(api/v2/units', UnitRouter);


export default app;
