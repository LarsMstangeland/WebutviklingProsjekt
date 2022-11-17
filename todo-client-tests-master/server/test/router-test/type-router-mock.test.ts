import axios from 'axios';
import app from '../../src/app';
import utilityService, {Type} from '../../src/service-files/utility-service';

const testTypes: Type[] = [
    {id: 1, name : 'Fish'},
    {id: 2, name : 'Pork'},
    {id: 3, name : 'Beef'}
    
]

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

jest.mock('../../src/service-files/utility-service');

let webServer: any;
beforeAll(() => webServer = app.listen(3001));
afterAll(() => webServer.close());



describe('Fetch types (GET)', ()=> {

    test('Fetch all types (200 OK)', async ()=> {
        utilityService.getAllType = jest.fn(()=> Promise.resolve(testTypes));

        const response = await axios.get('/types');
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testTypes);
    });

    test('Fetch all units (500 internal server error)', async ()=> {
        utilityService.getAllType = jest.fn(() => Promise.reject());

        const response = await axios.get('/types').catch((error) => {
            expect(error.response.status).toEqual(500);
        })
    })

    test('Fetch all units (404 Not Found)', async () => {
        utilityService.getAllType = jest.fn(() => Promise.resolve(testTypes));

        const response = await axios.get('badpath').catch((error) => {
            expect(error.response.status).toEqual(404);
            expect(error.response.data).toEqual('Could not find types');
        })
    })

});