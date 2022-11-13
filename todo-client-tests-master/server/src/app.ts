import express from 'express';
import RecipeRouter from './router-files/recipe-router';
import UserRouter from './router-files/user-router';
import RegionRouter from './router-files/region-router';
import CartRouter from './router-files/cart-router';
import UnitRouter from './router-files/unit-router';


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
app.use('/api/v2/units', UnitRouter);


export default app;
