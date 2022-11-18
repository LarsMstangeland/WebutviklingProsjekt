import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import userService, { User, LikedRecipe } from '../../src/service-files/user-service';

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
  // Delete all tasks, and reset id auto-increment start value

    pool.query('TRUNCATE TABLE user', (error) => {
        if(error) return done(error)
    });

    pool.query('TRUNCATE TABLE user_to_recipe', (error) => {
        if(error) return done(error)
    });

    // let deleteTestUsers = testUsers.map(user => userService.delete(user.user_id));
    // await Promise.all(deleteTestUsers);

    // let deleteUserLikes = userLike.map((like) => userService.removeLikedRecipe(like.user_id, like.recipe_id))
    // await Promise.all(deleteUserLikes);

    userService.createForTest(testUsers[0].user_id, testUsers[0].password, testUsers[0].username,  testUsers[0].admin)
    .then(() => userService.createForTest(testUsers[1].user_id, testUsers[1].password, testUsers[1].username,  testUsers[1].admin))
    .then(() => userService.createForTest(testUsers[2].user_id, testUsers[2].password, testUsers[2].username,  testUsers[2].admin))
    .then(()=> done())


    userService.likeRecipe(userLike[0].user_id, userLike[0].recipe_id)
    .then(() => userService.likeRecipe(userLike[1].user_id, userLike[1].recipe_id))
    .then(() => userService.likeRecipe(userLike[2].user_id, userLike[2].recipe_id))
    .then(()=> done())

    // let createUserLike = userLike.map((like) => {
    //   userService.likeRecipe(userLike[0].user_id, userLike[0].recipe_id)
    // })
    // await Promise.all(createUserLike)

  });

// Stop web server and close connection to MySQL server
afterAll(async() => {

  pool.end();
  webServer.close();
})



describe('Fetch Users (GET)', () => {
  test('Fetch User (200 OK)', async () => {
      const response = await userService.get(testUsers[0].username)
      expect(response).toEqual(testUsers[0])
  });


  test('Fetch all Users (200 OK)', async () => {
    const response = await userService.getAll()
    expect(response).toEqual(testUsers)
  });

  test('Fetch all User`s likes (200 OK)', async () => {
    const response = await userService.getLikedRecipes(testUsers[0].user_id)
    //comparing the id fetched via getlikedrecipes and the one that is declared here
    expect(response[0].recipe_id).toEqual(testLikedRecipes[0].recipe_id)
  });


});

describe('Create new User (POST)', () => {
  test('Create new User with id (200 OK)', async() => {

    let testuser: User = { user_id: 4, username: 'lars', password: "test1", admin: false}
   
    const response = await userService.createForTest(testuser.user_id, testuser.password, testuser.username, testuser.admin)
    expect(response).toEqual(testuser.user_id)

  });

  test('Create new User without id (200 OK)', async() => {

    let testuser: User = { user_id: 4, username: 'lars', password: "test1", admin: false}
   
    const response = await userService.create(testuser.password, testuser.username, testuser.admin)
    expect(response).toEqual(testuser.user_id)

  });

  test('Create new User like (200 OK)', async() => {

    //adds recipe with testLikedRecipies[0] to the list of liked recipes
    //for user testusers[0]

    await userService.likeRecipe(testUsers[0].user_id, testLikedRecipes[0].recipe_id)

    //gets all of the likes for user testUsers[0]
    const results = await userService.getLikedRecipes(testUsers[0].user_id)

    let lastelement = results.length-1

    //compares the last element in the liked recipes for user[0]
    //with the recipie we added, if they are alike the test passes
    expect(results[lastelement].recipe_id).toEqual(testLikedRecipes[0].recipe_id)

  });
});

describe('Delete User (DELETE)', () => {
  test('Delete User (200 OK)', async() => {

    let testuser: User = { user_id: 4, username: 'lars', password: "test1", admin: false}

    const response = await userService.delete(testuser.user_id)
    const result = await userService.getAll()

    expect(result).toEqual(testUsers)
    });

    test('Delete User (200 OK)', async() => {

      const response = await userService.delete(testUsers[0].user_id)
      const result = await userService.getAll()
  
      expect(result).toEqual([testUsers[1], testUsers[2]])
    });

    
    test('Delete User`s liked recipe (200 OK)', async() => {

      //fjerner den ene oppskriften til user[0]
    await userService.removeLikedRecipe(userLike[0].user_id, userLike[0].recipe_id);
      
    //henter alle oppskrifter som er liket
      const result = await userService.getLikedRecipes(userLike[0].user_id)

      //sjekker om den oppskriften er igjen er den definert lenger oppe
      expect(result[0].recipe_id).toEqual(userLike[1].recipe_id)
    });
});
