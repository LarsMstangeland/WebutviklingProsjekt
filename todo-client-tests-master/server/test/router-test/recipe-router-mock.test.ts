import axios from 'axios';
import app from '../../src/app';
import recipeService, { Recipe, Ingredient, IngredientName } from '../../src/service-files/recipe-service';

const testRecipes : Recipe[] = [
    {recipe_id : 1, name : 'Fishsoup', region : 'Europe', type : 'Fish', picture_url : 'hey', description : 'Veryy nice'},
    {recipe_id : 2, name : 'Taco', region : 'North-America', type : 'meat', picture_url : 'heyyy', description : 'Verrryyy good'},
    {recipe_id : 3, name : 'pizza', region : 'Europe', type : 'ham', picture_url : 'noooo', description : 'muy bien'}
]

axios.defaults.baseURL = 'http://localhost:3001/api/v2';

jest.mock('../../src/service-files/recipe-service');

let webServer: any;
beforeAll(() => webServer = app.listen(3001));
afterAll(() => webServer.close());

describe('Fetch recipes (GET)', ()=> {
    test('Fetch all recipes (200 OK)', async ()=> {
        recipeService.getAll = jest.fn(() => Promise.resolve(testRecipes));

        const response = await axios.get('/recipes');
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testRecipes);
    });

    test('Fetch all recipes (404 Not Found)', async () => {
        recipeService.getAll = jest.fn(() => Promise.resolve(testRecipes));

        const response = await axios.get('badpath').catch(error => {
            expect(error.response.status).toEqual(404);
            // expect(error.response.data).toEqual('Recipes not found')
        })
    })

    test('Fetch all recipes (500 internal server error)', async () => {
        recipeService.getAll = jest.fn(() => Promise.reject());

        const response = await axios.get('/recipes').catch((error) => {
            expect(error.response.status).toEqual(500);
        })
    })
});

