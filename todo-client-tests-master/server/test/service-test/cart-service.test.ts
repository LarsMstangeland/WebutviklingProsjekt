import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import cartService from '../../src/service-files/cart-service';

type CartItem = {
    cart_id : number;
    user_id : number;
    ingredients : string;
}
const testCartItems : CartItem[] = [
    {cart_id : 1, user_id : 1, ingredients : 'salt'},
    {cart_id : 2, user_id : 1, ingredients : 'pepper'},
    {cart_id : 3, user_id: 1, ingredients : 'pepper'}
]

axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll( () => {
  // Use separate port for testing
  webServer = app.listen(3001);
});

beforeEach(async() => {
    // Delete all tasks, and reset id auto-increment start value
  
    const deleteActions = testCartItems.map(cartItem => cartService.delete(cartItem.cart_id));
    await Promise.all(deleteActions);
  
      const createRecipeTestData = testCartItems.map((cartItem) => {
        cartService.createForTest(cartItem.cart_id, cartItem.user_id, cartItem.ingredients)
      })
      await Promise.all(createRecipeTestData)
  
    });
  
  // Stop web server and close connection to MySQL server
  afterAll(async () => {
  
    const deleteActions = testCartItems.map(cartItem => cartService.delete(cartItem.cart_id));
    await Promise.all(deleteActions);
  
    pool.end();
    webServer.close();
  })

  describe('Test all functions on cart table in database', () => {
    test('Fetch all cartitems for user', async () => {

        const response = await cartService.get(1);

        expect(response).toEqual(testCartItems);
    })

    test('Delete specific cartitem', async () => {
      await cartService.delete(3);

      const newCartItems = await cartService.get(1);

      expect(newCartItems)
      .toEqual([{cart_id : 1, user_id : 1, ingredients : 'salt'},
      {cart_id : 2, user_id : 1, ingredients : 'pepper'}])
    })
  })

