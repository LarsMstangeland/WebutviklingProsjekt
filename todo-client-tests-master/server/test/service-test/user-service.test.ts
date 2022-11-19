import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import userService, { User, LikedRecipe } from '../../src/service-files/user-service';


//using this for base data to compare with db-calls
let testUsers: User[] = [
  { user_id: 1, username: 'lars', password: "test1", admin: false},
  { user_id: 2, username: 'vetle', password: "test2", admin: false},
  { user_id: 3, username: 'seb', password: "test3", admin: false},
];

const testLikedRecipes: LikedRecipe[] = [
  {recipe_id: 1, name: "porridge"}
]

const userLike = [
  {user_id : 1, recipe_id : 1},
  {user_id : 1, recipe_id : 3},
  {user_id : 2, recipe_id : 2},
]



// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll( () => {
  // Use separate port for testing
  webServer = app.listen(3001);
});

beforeEach((done) => {

  //Truncate/reset all the table data to make the tests consistent
    pool.query('TRUNCATE TABLE user', (error) => {
        if(error) return done(error)
    });

    pool.query('TRUNCATE TABLE user_to_recipe', (error) => {
        if(error) return done(error)
    });

    //initialize the base data to our db, by mapping
    userService.createForTest(testUsers[0].user_id, testUsers[0].password, testUsers[0].username,  testUsers[0].admin)
    .then(() => userService.createForTest(testUsers[1].user_id, testUsers[1].password, testUsers[1].username,  testUsers[1].admin))
    .then(() => userService.createForTest(testUsers[2].user_id, testUsers[2].password, testUsers[2].username,  testUsers[2].admin))
    .then(()=> done())


    userService.likeRecipe(userLike[0].user_id, userLike[0].recipe_id)
    .then(() => userService.likeRecipe(userLike[1].user_id, userLike[1].recipe_id))
    .then(() => userService.likeRecipe(userLike[2].user_id, userLike[2].recipe_id))
    .then(()=> done())

  });

// Stop web server and close connection to MySQL server
// Could truncate here aswell, however we saw it as overkill
afterAll(async() => {
  pool.end();
  webServer.close();
})




describe('Fetch Users (GET)', () => {
  test('Fetch a User (200 OK)', async () => {

    //calling service and compareing with basedata
      const response = await userService.get(testUsers[0].username)
      expect(response).toEqual(testUsers[0])
  });


  test('Fetch all Users (200 OK)', async () => {

    //calling service and compareing with basedata
    const response = await userService.getAll()
    expect(response).toEqual(testUsers)
  });

  test('Fetch all User`s likes (200 OK)', async () => {

    //calling service for an array of the users liked recipes
    const response = await userService.getLikedRecipes(testUsers[0].user_id)

    //comparing the id of our first recipe that was fetched
    //via getlikedrecipes and the one that is declared as base data
    expect(response[0].recipe_id).toEqual(testLikedRecipes[0].recipe_id)
  });

});

describe('Create new User (POST)', () => {

  test('Create new User with id (200 OK)', async() => {

    //Declared a dummy value for use in testing
    let testuser: User = { user_id: 4, username: 'lars', password: "test1", admin: false}
   
    //creating a new user with the dummy value, and comparing the id's of the two
    const response = await userService.createForTest(testuser.user_id, testuser.password, testuser.username, testuser.admin)
    expect(response).toEqual(testuser.user_id)

  });

  test('Create new User without id (200 OK)', async() => {

    //Declared a dummy value for use in testing
    let testuser: User = { user_id: 4, username: 'lars', password: "test1", admin: false}
   
    //creating a new user with the dummy value, and comparing the id's of the two
    const response = await userService.create(testuser.password, testuser.username, testuser.admin)
    expect(response).toEqual(testuser.user_id)

  });

  test('Create new User like (200 OK)', async() => {

    //adds recipe with testLikedRecipies[0] to the list of liked recipes
    //for user testusers[0]
    await userService.likeRecipe(testUsers[0].user_id, testLikedRecipes[0].recipe_id)

    //gets all of the likes for user testUsers[0]
    const results = await userService.getLikedRecipes(testUsers[0].user_id)

    //compares the last element in the liked recipes for user[0]
    //with the recipie we added, if they are alike the test passes
    let lastelement = results.length-1
    expect(results[lastelement].recipe_id).toEqual(testLikedRecipes[0].recipe_id)

  });
});

describe('Delete User (DELETE)', () => {

    test('Delete User (200 OK)', async() => {

      //removing the fist user from our dummy value user sett
      const response = await userService.delete(testUsers[0].user_id)
      const result = await userService.getAll()

      //checking to see if the user got removed
      expect(result).toEqual([testUsers[1], testUsers[2]])
    });

    
    test('Delete User`s liked recipe (200 OK)', async() => {

      //Removing the like user_id = 1 had on recipe_id 1
      await userService.removeLikedRecipe(userLike[0].user_id, userLike[0].recipe_id);
      
      //Getting the remaining likes for user_id = 1
      const result = await userService.getLikedRecipes(userLike[0].user_id)

      //checking to see if the user_id = 1 only has the
      //recipe_id 3 liked, as shown in the base 
      expect(result[0].recipe_id).toEqual(userLike[1].recipe_id)
    });
});
