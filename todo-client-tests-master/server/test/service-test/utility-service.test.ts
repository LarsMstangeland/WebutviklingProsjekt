import axios from 'axios';
import pool from '../../src/mysql-pool';
import app from '../../src/app';
import utilityService, {Type, Region, Unit} from '../../src/service-files/utility-service';
import UnitRouter from '../../src/router-files/unit-router';

axios.defaults.baseURL = 'http://localhost:3001/api/v2';


//we only have pool-queries that fetches data from these tables. No deleting, adding or updating. 
// Therefore we decided to add a few rows into the test-database directly and the test... arrays are containing the same objects as the test-database
//Thats why there is no beforeEach in this test-file

//same objects are in the table in the test-database
const testUnits : Unit[] = [
    {id : 1, unit : 'dl'},
    {id : 2, unit : 'kg'},
    {id : 3, unit : 'g'},
]

//same objects are in the table in the test-database
const testRegions : Region[] = [
    {id: 1, name : 'Europe'},
    {id: 2, name : 'America'},
    {id: 3, name : 'Africa'}
]

//same objects are in the table in the test-database
const testTypes : Type[] = [
    {id : 1, name : 'Fish'},
    {id : 2, name : 'Meat'},
    {id : 3, name : 'Vegan'},

]

let webServer: any;
beforeAll( () => {
  // Use separate port for testing
  webServer = app.listen(3001);
});

afterAll(async () => {
  
    pool.end();
    webServer.close();
  })

// the utilities are only used for filtering and adding value(name) in a column in another table so we only have get-sentences for these
//therefore we decided to have static data in the test-database for these tables and not remove/add them in beforeEach() or afterAll()

describe('Get all utilities from tables in database', () => {


    test('Get all units', async () => {
        const response = await utilityService.getAllUnit();

        expect(response).toEqual(testUnits);    
    })

    test('Get all regions', async () => {
        const response = await utilityService.getAllRegion();

        expect(response).toEqual(testRegions);    
    })

    test('Get all types', async () => {
        const response = await utilityService.getAllType();

        expect(response).toEqual(testTypes);    
    })

    test('Get specific region', async()=> {
        const response = await utilityService.getRegion(1);

        expect(response).toEqual(testRegions[0]);
    })

})


