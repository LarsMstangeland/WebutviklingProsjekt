import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type User = {
  user_id: number;
  username: string;
  password: string;
  admin: boolean;
};

class UserService {
  /**
   * Get recipe with given id.
   */
  get(username : string) {
    return axios.get<User>('/users/' + username).then((response) => response.data);
  }

  /**
   * Get all recipes.
   */
  getAll() {
    return axios.get<User[]>('/users').then((response) => response.data);
  }



  delete(id : number){
    return axios.delete<User>('/users/' + id)
    .then((response) => response.data)
    .catch((error) => console.error(error));
  }

  create(password: string, username: string, admin: boolean) {
    return axios
      .post<{ id: number }>('/users', { password : password, username : username, admin : admin })
      .then((response) => {
        response.data.id;
      })
      .catch((error) => console.log(error));
  }
}

const userService = new UserService();
export default userService;