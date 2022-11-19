import axios from 'axios';
import app from '../../src/app';
import utilityService, {Region} from '../../src/service-files/utility-service';

const testRegions : Region[] = [
    {id: 1, name : 'Africa'},
    {id: 2, name : 'Europe'},
    {id: 3, name : 'North-America'}
    
]


// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

jest.mock('../../src/service-files/utility-service');

let webServer: any;
beforeAll(() => webServer = app.listen(3001));
afterAll(() => webServer.close());

describe('Fetch regions (GET)', ()=> {

    test('Fetch region (200 OK)', async () => {
        utilityService.getRegion = jest.fn(() => Promise.resolve(testRegions[0]));

        const response = await axios.get('/regions/1');
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testRegions[0]);
    })

    test('Fetch all regions (200 OK)', async ()=> {
        utilityService.getAllRegion = jest.fn(()=> Promise.resolve(testRegions));

        const response = await axios.get('/regions');
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testRegions);
    });

    test('Fetch all regions (500 internal server error)', async ()=> {
        utilityService.getAllRegion = jest.fn(() => Promise.reject());

        const response = await axios.get('/regions').catch((error) => {
            expect(error.response.status).toEqual(500);
        })
    })

    test('Fetch all regions (404 Not Found)', async () => {
        utilityService.getAllRegion = jest.fn(() => Promise.resolve(testRegions));

        const response = await axios.get('badpath').catch((error) => {
            expect(error.response.status).toEqual(404);
            //expect(error.data).toEqual('Regions not found');
        })
    })

    test('Fetch region (500 internal server error)', async ()=> {
        utilityService.getRegion = jest.fn(() => Promise.reject());

        const response = await axios.get('/regions/1').catch((error) => {
            expect(error.response.status).toEqual(500);
        })
    })

    test('Fetch region (404 Not Found)', async ()=> {
        utilityService.getRegion = jest.fn(() => Promise.resolve(testRegions[0]));

        const response = await axios.get('badpath').catch((error) => {
            expect(error.response.status).toEqual(404);
        })
    })

});
