test.skip('', () => {
  
})

/*

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
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE user', (error) => {
    if (error) return done(error);

    // Create testUsers in order to set correct id, and call done() when finished
    userService
      .create(testUsers[0].password,testUsers[0].username, testUsers[0].admin,)
      .then(() => userService.create(testUsers[1].password,testUsers[1].username, testUsers[1].admin)) // Create testTask[1]Â after testTask[0] has been created
      .then(() => userService.create(testUsers[2].password,testUsers[2].username, testUsers[2].admin)) // Create testTask[2]Â after testTask[1] has been created
      .then(() => done()); // Call done() after testTask[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch Users (GET)', () => {
  test('Fetch all Users (200 OK)', (done) => {
    axios.get('/users').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers);
      done();
    });
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

*/

