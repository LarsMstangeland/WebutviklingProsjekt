import axios from 'axios';
import app from '../../src/app';
import userService, { User } from '../../src/service-files/user-service';

const testUsers: User[] = [
  { user_id: 1, username: 'lars', password: "test1", admin: false},
  { user_id: 2, username: 'vetle', password: "test2", admin: false},
  { user_id: 3, username: 'seb', password: "test3", admin: false},
];

let LikedRecipeTest = [
    {
    recipe_id: 1,
    name: "testdata"
    },
    {
        recipe_id: 2,
        name: "testdata"
    }
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

jest.mock("../../src/service-files/user-service");

let webServer: any;
beforeAll(() => webServer = app.listen(3001));
afterAll(() => webServer.close());

describe("Fetch users (GET)", () => {
  test("Fetch all users (200 OK)", async () => {

      userService.getAll = jest.fn(() => Promise.resolve(testUsers));

      const response = await axios.get("/users");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers);
  });

  test("Fetch user (200 OK)", async () => {
      //todo
      let userid = 1
      userService.get = jest.fn(() => Promise.resolve(testUsers[userid]));

      const response = await axios.get("/users/"+userid);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers[userid]);
  });

  test("Fetch user's likes (200 OK)", async () => {
    //todo
    let user_id = 1
    userService.getLikedRecipes = jest.fn(() => Promise.resolve(LikedRecipeTest));

    const response = await axios.get('users/recipes/'+user_id)
    expect(response.data).toEqual(LikedRecipeTest);
    expect(response.status).toEqual(200);

});

  test("Fetch user (500 Internal Server error)", async () => {
    //todo
        let username = testUsers[0].username
        userService.get = jest.fn(() => Promise.reject())
        const response = await axios.get("/users").catch((error) => {
        expect(error.response.status).toEqual(500)
        expect(error.response.message).toEqual(error)
        })
    });

  test("Fetch all users (500 Internal Server Error)", async () => {
      //todo
        userService.getAll = jest.fn(() => Promise.reject());

        const response = await axios.get("/users").catch((error) => {
            expect(error.response.status).toEqual(500);
        });  
    });

    test("Fetch user (404 Not Found)", async () => {
        //todo
  
        const user = testUsers[0];
        userService.get = jest.fn(() => Promise.resolve(user));
  
          const response = await axios.get("DårligSti").catch((error) => {
          expect(error.response.status).toEqual(404)
      })      
    });

  test("Fetch All users(404 Not Found)", async () => {
      //todo

      const users = testUsers;
      userService.getAll = jest.fn(() => Promise.resolve(users));

        const response = await axios.get("DårligSti").catch((error) => {
        expect(error.response.status).toEqual(404)
    })      
  });

  test("Fetch user's likes(404 Not Found)", async () => {
    //todo

    const users = testUsers;
    userService.getAll = jest.fn(() => Promise.resolve(users));

      const response = await axios.get("DårligSti").catch((error) => {
      expect(error.response.status).toEqual(404)
  })      
});

});

describe("Create new user (POST)", () => {
  test("Create new user (200 Created)", async () => {
      //todo
      const userid = 1
      const user = {
        password: "test1", 
        username: 'lars', 
        admin: false
    }
        //mocking so that the database returns the id via Auto increment
      userService.create = jest.fn(() => Promise.resolve(userid));

      const response = await axios.post("/users", user);
      expect(response.status).toEqual(200);
    });

  test("Create new user (400 Bad Request)", async () => {
    
      let user = "e"
      let userid = 1
    //mocking so that the database returns the id via Auto increment
      userService.create = jest.fn(() => Promise.resolve(userid));

      const response = await axios.post("/users", user).catch((error) => {
        expect(error.response.status).toEqual(400)
      })
  });
  test("Create new user (500 Internal Server error)", async () => {
      //todo
      let user_id = 4
      const user = {
        username: 'lars',
        password: "test1", 
        admin: false
      }
      userService.create = jest.fn(() => Promise.reject());

      const response = await axios.post("/users", user).catch((error) => {
        expect(error.response.status).toEqual(500)
      })
  });

  test('like recipe (200)', async () => {
    const testid = 1
    const user_id = 1

    userService.likeRecipe = jest.fn(() => Promise.resolve());
    const response = await axios.post('users/'+testid+'/like', {testid: testid, user_id: user_id})
    expect(response.status).toEqual(200);

})

});

describe("Delete user (DELETE)", () => {

        test("Delete user (200 OK)", async () => {
                let userid = 2
                userService.delete = jest.fn(() => Promise.resolve());
                const response = await axios.delete("/users/"+userid);
                expect(response.status).toEqual(200);
            });
        test("Delete user (404)", async () => {
            let userid = 2
            userService.delete = jest.fn(() => Promise.resolve());
            const response = await axios.delete("/usersFEILSTI/").catch((error) => {
            expect(error.response.status).toEqual(404);
            });
        });

        test("Delete user's like (200 OK)", async () => {
            let userid = 2
            userService.removeLikedRecipe = jest.fn(() => Promise.resolve());
            const response = await axios.delete("/users/"+userid+"/recipes/"+LikedRecipeTest[0].recipe_id);
            expect(response.status).toEqual(200);
        });

        test("Delete user's likes (500)", async () => {
            let userid = 2
            userService.removeLikedRecipe = jest.fn(() => Promise.reject());
            const response = await axios.delete("/users/"+userid+"/recipes/"+LikedRecipeTest[0].recipe_id).catch((error) => {
            expect(error.response.status).toEqual(500);
        });        
    });
});