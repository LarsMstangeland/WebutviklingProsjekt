import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Cart = {
  cart_id: number;
  ingredient: string;
};

class CartService {
  /**
   * Get recipe with given id.
   */
  get(id: number) {
    return axios.get<Cart[]>('/cart/' + id).then((response) => response.data);
  }

}


const cartService = new CartService();
export default cartService;