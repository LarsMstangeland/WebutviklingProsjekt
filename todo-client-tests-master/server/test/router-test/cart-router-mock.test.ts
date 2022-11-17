import axios from 'axios';
import app from '../../src/app';
import cartService, {CartItem} from '../../src/service-files/cart-service';

const testCartItems : CartItem[] = [
    {cart_id: 1, ingredients : 'ginger'},
    {cart_id: 2, ingredients : 'salmon'},
    {cart_id: 3, ingredients : 'salt'}
    
]


// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

jest.mock('../../src/service-files/cart-service');

let webServer: any;
beforeAll(() => webServer = app.listen(3001));
afterAll(() => webServer.close());

describe('Fetch carts (200 OK)', ()=> {
    test('Fetch all carts for user (200 OK)', async () => {

        const user_id : number = 1;

        cartService.get = jest.fn(()=> Promise.resolve(testCartItems));
        const response = await axios.get('/cart/'+user_id)

        expect(response.data).toEqual(testCartItems);
        expect(response.status).toEqual(200);
    })
})

describe('Delete cart (DELETE)', ()=> {
    test('Delete cart (200 OK)', async ()=> {
        cartService.delete = jest.fn(() => Promise.resolve());
        const response = await axios.delete('/cart/1');

        expect(response.status).toEqual(200);
    });
})


