import axios from 'axios';
import app from '../../src/app';
import  utilityService, {Unit} from '../../src/service-files/utility-service';

const testUnits: Unit[] = [
    {id: 1, unit : 'dl'},
    {id: 2, unit : 'kg'},
    {id: 3, unit : 'hg'},
]

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

jest.mock('../../src/service-files/utility-service');

let webServer: any;
beforeAll(() => webServer = app.listen(3001));
afterAll(() => webServer.close());

describe('Fetch units (GET)', ()=> {

    test('Fetch all units (200 OK)', async ()=> {
        utilityService.getAllUnit = jest.fn(()=> Promise.resolve(testUnits));

        const response = await axios.get('/units');
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testUnits);
    });

    test('Fetch all units (500 internal server error)', async ()=> {
        utilityService.getAllUnit = jest.fn(() => Promise.reject());

        const response = await axios.get('/units').catch((error) => {
            expect(error.response.status).toEqual(500);
        })
    })

    test('Fetch all units (404 Not Found)', async () => {
        utilityService.getAllUnit = jest.fn(() => Promise.resolve(testUnits));

        const response = await axios.get('badpath').catch((error) => {
            expect(error.response.status).toEqual(404);
            // expect(error.response.body).toEqual('Could not find units');
        })
    })

});

