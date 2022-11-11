import express, { request, response } from 'express';


const AuthRouter = express.Router();

AuthRouter.get('/login', (_request, response) => {
    response.render('login');
})

export default AuthRouter;