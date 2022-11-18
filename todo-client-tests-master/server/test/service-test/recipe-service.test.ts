import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import recipeService, { Recipe, Ingredient, IngredientName } from '../../src/service-files/recipe-service';


const testRecipes : Recipe[] = [
    {description : 'Tasty porridge', name : 'porridge', picture_url : 'photo of porridge', recipe_id : 1, region : 'Europe' , type : 'Rice'},
    {description : 'Yumyum tacos', name : 'Taco', picture_url : 'photo of taco', recipe_id : 2, region : 'Mexico' , type : 'meat'},
    {description : 'Pizza very nice', name : 'pizza', picture_url : 'photo of pizza', recipe_id : 3, region : 'America' , type : 'Ham'}
]

const testIngredients : IngredientName[] = [
    {ingredients_id : 1, name : 'salt'},
    {ingredients_id : 2, name : 'oregano'},
    {ingredients_id : 3, name : 'pepper'},

]

const testRecipeIngredients : Ingredient[] = [
    {ingredients_id : 1, name : 'salt', amount : 2, unit : 'tsp'},
    {ingredients_id : 2, name : 'oregano', amount : 4, unit : 'g'},
    {ingredients_id : 3, name : 'pepper', amount : 1, unit : 'dl'}
]
axios.defaults.baseURL = 'http://localhost:3001/api/v2';


let webServer: any;
beforeAll( () => {
  // Use separate port for testing
  webServer = app.listen(3001);
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
    pool.query('TRUNCATE TABLE recipes', (error) => {
        if(error) return done(error)
    });

    pool.query('TRUNCATE TABLE ingredients', (error) => {
        if(error) return done(error)
    });

    pool.query('TRUNCATE TABLE ingredients_to_recipe', (error) => {
        if(error) return done(error)
    });

      recipeService.createRecipe(testRecipes[0].name, testRecipes[0].description, testRecipes[0].picture_url,  testRecipes[0].region, testRecipes[0].type)
      .then(() => recipeService.createRecipe(testRecipes[1].name, testRecipes[1].description, testRecipes[1].picture_url,  testRecipes[1].region, testRecipes[1].type))
      .then(() => recipeService.createRecipe(testRecipes[2].name, testRecipes[2].description, testRecipes[2].picture_url,  testRecipes[2].region, testRecipes[2].type))
      .then(()=> done())

      recipeService.createIngredient(testIngredients[0].name)
      .then(() => recipeService.createIngredient(testIngredients[1].name))
      .then(() => recipeService.createIngredient(testIngredients[2].name))
      .then(() => done());

      recipeService.addRecipeIngredient(1, testRecipeIngredients);
  });

// Stop web server and close connection to MySQL server
afterAll(async () => {
  pool.end();
  webServer.close();
})


describe('Testing towards table `recipes` database', ()=> {

    test('Fetch all recipes', async () => {
        const response = await recipeService.getAll();
        expect(response).toEqual(testRecipes);
    })

    test('Fetch spesific recipe', async () => {
        const response = await recipeService.get(1);
        expect(response).toEqual(testRecipes[0]);
    })

    test('Creating new recipes', async () => {
        const newRecipe = {description : 'Pancakes is yummy', name : 'Pancake', picture_url : 'pancake-photo', recipe_id : 4, region : 'Europe' , type : 'dinner'}

        await recipeService.createRecipe(newRecipe.name, newRecipe.description, newRecipe.picture_url, newRecipe.region, newRecipe.type);

        const createdRecipe = await recipeService.get(4);

        expect(createdRecipe).toEqual(newRecipe);
    })

    test('Updating existing recipe', async () => {
        const updatedRecipe = {description : 'Pancakes is yummy', name : 'Pancake', picture_url : 'pancake-photo', recipe_id : 1, region : 'Europe' , type : 'dinner'};

        await recipeService.updateRecipe(updatedRecipe);

        const newId1 = await recipeService.get(1);

        expect(newId1).toEqual(updatedRecipe);
    })
})



describe('Testing towards `ingredients` table in database', () => {
    
    test('Fetch all ingredients', async () => {

        const response = await recipeService.getAllIngredients();

        expect(response).toEqual(testIngredients);

    })

    test('Create new ingredient', async () => {
        const newIngredient = {ingredients_id : 4, name : 'chocolate'}

        await recipeService.createIngredient(newIngredient.name);

        const response = await recipeService.getAllIngredients();

        expect(response[3]).toEqual(newIngredient);
    })


    test('Delete ingredients to recipe and recipe', async () => {
        await recipeService.delete(1); 

        const remainingRecipes = await recipeService.getAll();

        const remainingRecipeIngredients = await recipeService.getAllRecipeIngredients(1);

        expect(remainingRecipes).toEqual([
            {description : 'Yumyum tacos', name : 'Taco', picture_url : 'photo of taco', recipe_id : 2, region : 'Mexico' , type : 'meat'},
        {description : 'Pizza very nice', name : 'pizza', picture_url : 'photo of pizza', recipe_id : 3, region : 'America' , type : 'Ham'}
    ]);

    expect(remainingRecipeIngredients).toEqual([]);
    })

})


describe('Testing towards `ingredients_to_recipe` table in database', ()=> {

    test('Delete ingredient from recipe', async () => {
        await recipeService.deleteRecipeIngredients(1, testRecipeIngredients)

        const response = await recipeService.getAllRecipeIngredients(1);

        expect(response).toEqual([]);
    })

    test('Add ingredients to recipe', async () => {


        const newIngredients : Ingredient[] = [
            {ingredients_id : 4, name : 'chili', amount : 4, unit : 'kg'},
            {ingredients_id : 5, name : 'kiwi', amount : 1, unit : 'g'}
        ]
        await recipeService.addRecipeIngredient(1, newIngredients);

        const response = await recipeService.getAllRecipeIngredients(1);

        expect(response).toEqual([
            {ingredients_id : 1, name : 'salt', amount : 2, unit : 'tsp'},
            {ingredients_id : 2, name : 'oregano', amount : 4, unit : 'g'},
            {ingredients_id : 3, name : 'pepper', amount : 1, unit : 'dl'},
            {ingredients_id : 4, name : 'chili', amount : 4, unit : 'kg'},
            {ingredients_id : 5, name : 'kiwi', amount : 1, unit : 'g'}
        ])

    })
})