import axios from 'axios';
import app from '../../src/app';
import recipeService, { Recipe, Ingredient, IngredientName } from '../../src/service-files/recipe-service';

const testRecipes : Recipe[] = [
    {recipe_id : 1, name : 'Fishsoup', region : 'Europe', type : 'Fish', picture_url : 'hey', description : 'Veryy nice'},
    {recipe_id : 2, name : 'Taco', region : 'North-America', type : 'meat', picture_url : 'heyyy', description : 'Verrryyy good'},
    {recipe_id : 3, name : 'pizza', region : 'Europe', type : 'ham', picture_url : 'noooo', description : 'muy bien'}
]

const testIngredients: Ingredient[] = [


    {ingredients_id: 1, name: "test", amount: 1, unit: "test", type: "test"},
    {ingredients_id: 2, name: "test", amount: 2, unit: "test", type: "test"}

]

axios.defaults.baseURL = 'http://localhost:3001/api/v2';

jest.mock('../../src/service-files/recipe-service');

let webServer: any;
beforeAll(() => webServer = app.listen(3001));
afterAll(() => webServer.close());

describe('Fetch recipes (GET)', ()=> {
    test('Fetch all recipes (200 OK)', async ()=> {
        recipeService.getAll = jest.fn(() => Promise.resolve(testRecipes));

        const response = await axios.get('/recipes/');
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testRecipes);
    });

    test('Fetch all recipes (404 Not Found)', async () => {
        recipeService.getAll = jest.fn(() => Promise.resolve(testRecipes));

        const response = await axios.get('/recipies/badpath').catch(error => {
            expect(error.response.status).toEqual(404);
            //expect(error.response.data).toEqual('Recipes not found')
        });
    });

    test('Fetch all recipes (500 internal server error)', async () => {
        recipeService.getAll = jest.fn(() => Promise.reject());

        const response = await axios.get('/recipes').catch((error) => {
            expect(error.response.status).toEqual(500);
        });
    });

    test('Fetch recipe (200 OK)', async ()=> {
        recipeService.get = jest.fn(() => Promise.resolve(testRecipes[0]));

        const response = await axios.get('/recipes/1');
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testRecipes[0]);
    })

    test('Fetch recipe (404 Not Found)', async ()=> {
        recipeService.get = jest.fn(() => Promise.resolve(testRecipes[0]));

        const response = await axios.get('badpath').catch((error) => {
            expect(error.response.status).toEqual(404);
            // expect(error.response.data).toEqual('Recipe not found');
        })
    })

    test('Fetch recipe (500 internal server error)', async () => {
        recipeService.get = jest.fn(() => Promise.reject());

        const response = await axios.get('/recipes/1').catch((error) => {
            expect(error.response.status).toEqual(500);
        })
    })

});


/*
describe('Fetch ingredients (GET)', () => {

    test('Fetch all ingredients', async () => {

        recipeService.getIngredients = jest.fn(() => Promise.resolve(testIngredients));
        const response = await axios.get('/recipes/ingredients');
            
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testIngredients)

    })
})

*/


describe('Post recipes (POST)', () => {

    test('Create a recipe (200)', async () => {

        const testid = 1

        recipeService.createRecipe = jest.fn(() => Promise.resolve(testid));

        const response = await axios.post('recipes/add', testRecipes[0])
        expect(response.data).toEqual({"id": testid});
        expect(response.status).toEqual(200);

    })

    
    test('add ingredient to recipe (200)', async () => {
        const testid = 1

        recipeService.addRecipeIngredient = jest.fn(() => Promise.resolve());

        const response = await axios.post('recipes/'+testid+'/edit/ingredients', testIngredients)
        expect(response.status).toEqual(200);

    })





})

