import * as React from 'react';
import { shallow } from 'enzyme';
import { NavLink } from 'react-router-dom';
import {UserLogin, NewUser} from '../src/component-files/user-components';
import userService, {User, LikedRecipe} from '../src/service-files/user-service';

jest.mock('../src/service-files/user-service', () => {
    class UserService {
        get() {
            return Promise.resolve(
                {user_id: 1, username: 'vetle', password: 'tevle', admin: true}
            );
        }

        getAll() {
            return Promise.resolve([
                {user_id: 1, username : 'vetle', password : 'tevle', admin : true},
                {user_id : 2, username : 'sebastian', password : 'seb', admin : false}
            ]);
        }

        create() {
            return Promise.resolve({
                user_id: 3, username : 'lars', password : 'larsy', admin : true
            })
        }
    }
})

describe('Components draw correctly tests' , () => {
    test('UserLogin draws correctly' , () => {
        const wrapper = shallow(<UserLogin/>);

        expect(wrapper).toMatchSnapshot();
    });

    test('NewUser draws correctly' , () => {
        const wrapper = shallow(<NewUser/>);

        expect(wrapper).toMatchSnapshot();
    });

    
});

