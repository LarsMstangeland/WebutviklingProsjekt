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
      //fecthes all the cartitems for a specific user with user_id = 1
        const response = await cartService.get(1);

        //expecting the get-sentence to retrieve all the objects in testCartItems
        expect(response).toEqual(testCartItems);
    })

    test('Delete specific cartitem', async () => {
      //deletes the cart with cart_id = 3 (which is with user_id = 1)
      await cartService.delete(3);

      //then fetches all the carts existing with user_id = 1
      const newCartItems = await cartService.get(1);

      //expecting the newCartItems to be like testCartItems, but without the last object
      expect(newCartItems)
      .toEqual([{cart_id : 1, user_id : 1, ingredients : 'salt'},
      {cart_id : 2, user_id : 1, ingredients : 'pepper'}])
    })
  })

