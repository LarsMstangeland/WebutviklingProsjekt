import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type CartItem = {
  cart_id: number;
  ingredients: string;
};

export type Ingredient = {
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

  getAllIngredients() {  
    return axios.get<Ingredient[]>('/cart/addIngredients')
    .then((response) => response.data)
    .catch((error) => console.log(error))
  }

  deleteIngredientFromCart(id: number){
    return axios.delete('/cart/'+id)
    .then((response) => response.data)
    .catch((error) => console.error(error));
  }

}


const cartService = new CartService();
export default cartService;