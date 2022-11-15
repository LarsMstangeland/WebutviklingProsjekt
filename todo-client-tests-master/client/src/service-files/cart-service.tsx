import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type CartItem = {
  cart_id: number;
  ingredients: string;
};

class CartService {
  /**
   * Get recipe with given id.
   */
  get(id: number) {
    return axios.get<CartItem[]>('/cart/' + id).then((response) => response.data);
  }

}


const cartService = new CartService();
export default cartService;