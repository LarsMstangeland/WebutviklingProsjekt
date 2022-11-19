import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import recipeService, { Recipe, Ingredient, IngredientName } from '../../src/service-files/recipe-service';
import cartService from '../../src/service-files/cart-service';


const testCart = [
    {cart_id : 1, user_id : 1, ingredients : 'salt'},
    {cart_id : 2, user_id : 1, ingredients : 'olive'},
    {cart_id : 3, user_id : 2, ingredients : 'pepper'}

]

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

    pool.query('TRUNCATE TABLE cart', (error) => {
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

        //expecting all the recipes in the database to be like testRecipes
        expect(response).toEqual(testRecipes);
    })

    test('Fetch spesific recipe', async () => {
        //fetches recipe based on recipe_id
        const response = await recipeService.get(1);
        expect(response).toEqual(testRecipes[0]);
    })

    test('Creating new recipes', async () => {

        const newRecipe = {description : 'Pancakes is yummy', name : 'Pancake', picture_url : 'pancake-photo', recipe_id : 4, region : 'Europe' , type : 'dinner'}

        //creates the new recipe and inserts it into the database
        await recipeService.createRecipe(newRecipe.name, newRecipe.description, newRecipe.picture_url, newRecipe.region, newRecipe.type);

        //fetches the recipe with id = 4 which should be the recipe added in line 98 
        const createdRecipe = await recipeService.get(4);

        //if the creating we wanted to test was successful, createdRecipe should equal the newrecipe
        expect(createdRecipe).toEqual(newRecipe);
    })

    test('Updating existing recipe', async () => {
        
        //Changes the recipe with id = 1 to the object below
        const updatedRecipe = {description : 'Pancakes is yummy', name : 'Pancake', picture_url : 'pancake-photo', recipe_id : 1, region : 'Europe' , type : 'dinner'};

        await recipeService.updateRecipe(updatedRecipe);

        //retrieves the object in the recipe table with id = 1
        const newId1 = await recipeService.get(1);

        //if the updating was successful, the recipe we fetched on line 118 should equal the update on line 113
        expect(newId1).toEqual(updatedRecipe);
    })
})



describe('Testing towards `ingredients` table in database', () => {
    
    test('Fetch all ingredients used for filtering', async () => {
        
        const response = await recipeService.getAllIngredients();

        //expecting the ingredients in the ingredients database to equal the ones we create in beforeEach()
        expect(response).toEqual(testIngredients);

    })

    test('Fetch all ingredients used for displaying', async () => {

        //used two different methods because the types we needed from the database were different for filtering and actually displaying on a recipe
        const response = await recipeService.getIngredients();

        expect(response).toEqual(testIngredients);
    })

    test('Create new ingredient', async () => {
        
        const newIngredient = {ingredients_id : 4, name : 'chocolate'}
        //Creates a new ingredient in the database
        await recipeService.createIngredient(newIngredient.name);

        //retrieves all the ingredients in the ingredients table
        const response = await recipeService.getAllIngredients();

        //the 4th (and last) ingredient in the table with index = 3 should be the one added on line 150
        expect(response[3]).toEqual(newIngredient);
    })


    test('Delete ingredients to recipe and delete the recipe', async () => {
        //deleting from table where recipe_id = 1
        await recipeService.delete(1); 

        //Fetches the remaining recipes in the recipes table 
        const remainingRecipes = await recipeService.getAll();

        //fetches the remaining ingredients in ingredients_to_recipe with recipe_id = 1
        const remainingRecipeIngredients = await recipeService.getAllRecipeIngredients(1);

        //expecting the first object in testRecipes to have been removed because of the id : 1 in recipeService.delete(1)
        expect(remainingRecipes).toEqual([
            {description : 'Yumyum tacos', name : 'Taco', picture_url : 'photo of taco', recipe_id : 2, region : 'Mexico' , type : 'meat'},
        {description : 'Pizza very nice', name : 'pizza', picture_url : 'photo of pizza', recipe_id : 3, region : 'America' , type : 'Ham'}
    ]);

    //expecting all the recipeIngredients to be removed because they were all inserted into the database with recipe_id = 1 in beforeEach()
    expect(remainingRecipeIngredients).toEqual([]);
    })

})


describe('Testing towards `ingredients_to_recipe` table in database', ()=> {


    test('Delete ingredient from recipe', async () => {
        //deletes all the ingredients made in beforeEach() for the recipe with recipe_id = 1 
        await recipeService.deleteRecipeIngredients(1, testRecipeIngredients)

        //then tries to fetch all the ingredients from the ingredients_to_recipe table with recipe_id = 1
        const response = await recipeService.getAllRecipeIngredients(1);

        //expecting the response to equal an empty array
        expect(response).toEqual([]);
    })

    test('Add ingredients to recipe', async () => {

        //have to create an ingredient with a new name in the ingredients table before adding it to ingredients_to_recipe table
        //The reason is we get the name in the sql-sentence from ingredients (i) so it has to exist in that table
        await recipeService.createIngredient('chicken');

        //creates a new ingredient with the name of the ingredient recently added to ingredients-table
        const newIngredients : Ingredient[] = [
            {ingredients_id : 4, name : 'chicken', amount : 2, unit : 'kg'},
        ]

        //adds the ingredient to ingredients_to_recipe table
        await recipeService.addRecipeIngredient(1, newIngredients);

        const response = await recipeService.getAllRecipeIngredients(1);

        //expects the recipe with id = 1 to have the new ingredient chichken in addition to the ones added in beforeEach()
        expect(response).toEqual([
            {ingredients_id : 1, name : 'salt', amount : 2, unit : 'tsp'},
            {ingredients_id : 2, name : 'oregano', amount : 4, unit : 'g'},
            {ingredients_id : 3, name : 'pepper', amount : 1, unit : 'dl'},
            {ingredients_id : 4, name : 'chicken', amount : 2, unit : 'kg'},
        ])

    })

    test('Get all ingredients in a specific recipe', async () => {
        const response = await recipeService.getAllRecipeIngredients(1);

        //expecting all ingredients of the recipe with recipe_id = 1 to be all the ingredients in the testRecipeIngredients-array because they were all added to the database with recipe_id = 1
        expect(response).toEqual(testRecipeIngredients);
    })

    test('Update amount or unit on ingredient in a recipe', async () => {
        const updates : Ingredient[] = [
            {amount : 4,  unit : 'kg', ingredients_id : 2, name : 'oregano'},
            {amount : 3,  unit : 'mg', ingredients_id : 3, name : 'pepper'}
        ];
        

        await recipeService.updateRecipeIngredients(1, updates);

        const newIngredients = await recipeService.getAllRecipeIngredients(1);

        //expecting the the last two ingredients to recipe_id = 1 to be like 'updates' after updating table in database
        expect(newIngredients).toEqual([
            {amount : 2, unit : 'tsp', ingredients_id : 1, name : 'salt'},
            {amount : 4,  unit : 'kg', ingredients_id : 2, name : 'oregano'},
            {amount : 3,  unit : 'mg', ingredients_id : 3, name : 'pepper'}
        ])

    })

})

describe('Cart and recipe together in the database', () => {


    test('Add ingredient to cart from a recipe', async () => {
        const newIngredients = [
            {ingredients_id : 1, name : 'salt', amount : 2, unit : 'tsp'},
            {ingredients_id : 2, name : 'oregano', amount : 4, unit : 'g'}
        ]

        //adds two new ingredients to the cart table in the database
        await recipeService.AddIngredientsToCartFromRecipe(newIngredients, 3);
        
        const response = await cartService.get(3);  

        //expecting the database to contain the added new ingredients
        expect(response).toEqual([
            {ingredients: 'salt', cart_id : 1, user_id : 3},
            {ingredients: 'oregano', cart_id : 2, user_id : 3}
    ])
    })


})