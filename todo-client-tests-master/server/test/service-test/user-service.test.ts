import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import userService, { User } from '../../src/service-files/user-service';

const testUsers: User[] = [
  { user_id: 1, username: 'lars', password: "test1", admin: false},
  { user_id: 2, username: 'vetle', password: "test2", admin: false},
  { user_id: 3, username: 'seb', password: "test3", admin: false},
];



// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll( () => {
  // Use separate port for testing
  webServer = app.listen(3001);
});

beforeEach(async() => {
  // Delete all tasks, and reset id auto-increment start value

    const deleteUserTestData = testUsers.map((user) => {
      userService.delete(user.user_id)
    }) 
    await Promise.all(deleteUserTestData)

    const createUserTestData = testUsers.map((user) => {
      userService.create(user.password, user.username, user.admin)
    })
    await Promise.all(createUserTestData)



  });

// Stop web server and close connection to MySQL server
afterAll(async () => {
  const deleteActions = testUsers.map(user => userService.delete(user.user_id));
  await Promise.all(deleteActions);

  pool.end();
  webServer.close();
})

describe('Fetch Users (GET)', () => {
  test('Fetch all Users (200 OK)', async () => {

      const response = await userService.get(testUsers[0].username)
      expect(response).toEqual(testUsers[0])
  });
});

describe('Create new User (POST)', () => {
  test('Create new User (200 OK)', (done) => {
    axios.post('/users',testUsers[1]).then((response) => {
      expect(response.status).toEqual(200);
      //expect(response.data).toEqual({ id: testUsers[1].user_id });
      done();
    });
  });
});

describe('Delete User (DELETE)', () => {
  test('Delete User (200 OK)', (done) => {
    axios.delete('/users/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});
