import axios from 'axios';
import app from '../src/app';
import userService, { User } from '../src/service-files/user-service';

const testUsers: User[] = [
  { user_id: 1, username: 'lars', cart_id: 1, password: "test1", admin: false},
  { user_id: 2, username: 'vetle', cart_id: 2, password: "test2", admin: false},
  { user_id: 3, username: 'seb', cart_id: 3, password: "test3", admin: false},
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

jest.mock("../service-files/user-service");

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

  test("Fetch task (200 OK)", async () => {
      //todo
      let taskid = 1
      userService.get = jest.fn(() => Promise.resolve(testUsers[taskid]));

      const response = await axios.get("/users/"+taskid);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers[taskid]);
  });

  test("Fetch all users (500 Internal Server Error)", async () => {
      //todo

      userService.getAll = jest.fn(() => Promise.reject());

      try {
          const response = await axios.get("/users");

      } catch (error) {
          expect(error.response.status).toEqual(500);
      }
  });

  test("Fetch user (404 Not Found)", async () => {
      //todo


      userService.get = jest.fn(() => Promise.resolve());

      try {
          const response = await axios.get("DårligSti");

      } catch (error) {
          expect(error.response.status).toEqual(404);
      }
  });

  test("Fetch user (500 Internal Server error)", async () => {
      //todo

      let userid = 1
      userService.get = jest.fn(() => Promise.reject());

      try {
          const response = await axios.get("/users/" + userid);

      } catch (error) {
          expect(error.response.status).toEqual(500);
      }
  });
});

describe("Create new user (POST)", () => {
  test("Create new user (201 Created)", async () => {
      //todo
      const user = {
        user_id: 4, username: 'lars', cart_id: 4, password: "test1", admin: false
      }
      userService.create = jest.fn(() => Promise.resolve(user));

      const response = await axios.post("/users", user);
      expect(response.status).toEqual(201);
      expect(response.headers.location).toEqual("users/" + user.user_id);

  });

  test("Create new user (400 Bad Request)", async () => {
      //todo
      let user = "e"
      userService.create = jest.fn(() => Promise.resolve(user));

      try {
          const response = await axios.post("/users", user);

      } catch (error) {
          expect(error.response.status).toEqual(400);

      }
  });

  test("Create new user (500 Internal Server error)", async () => {
      //todo

      const user = {
        user_id: 4, username: 'lars', cart_id: 4, password: "test1", admin: false
      }
      userService.create = jest.fn(() => Promise.reject(user));

      try {
          const response = await axios.post("/users", user);

      } catch (error) {
          expect(error.response.status).toEqual(500);

      }
  });
});

describe("Delete user (DELETE)", () => {
  test("Delete user (200 OK)", async () => {

      let taskid = 2

      userService.delete = jest.fn(() => Promise.resolve(taskid));

      const response = await axios.delete("/users/2");

      expect(response.status).toEqual(200);
  });
});
