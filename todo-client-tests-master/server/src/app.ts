import express from 'express';
import RecipeRouter from './recipe/recipe-router';
import UserRouter from './user-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2', UserRouter);
app.use('/api/v2', RecipeRouter);

export default app;
