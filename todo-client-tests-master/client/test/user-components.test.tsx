import * as React from 'react';
import { shallow } from 'enzyme';
import { NavLink } from 'react-router-dom';
import {UserLogin, NewUser} from '../src/component-files/user-components';
import userService, {User, LikedRecipe} from '../src/service-files/user-service';
import { Form , Button, NavBar} from '../src/widgets';

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
            return Promise.resolve(3);
        }

        delete() {
            return Promise.resolve();
        }

    }
})

// jest.setTimeout(30000);

describe('Components draw correctly tests' , () => {
    test('UserLogin draws correctly' , () => {
        const wrapper = shallow(<UserLogin/>);

        expect(wrapper).toMatchSnapshot();
    });

    // test('NewUser draws correctly' , () => {
    //     const wrapper = shallow(<NewUser/>);

    //         expect(wrapper).toMatchSnapshot();
    // });
});

describe('Testing NewUser-component', () => {
    test('Input fields value changes', (done) => {
        const wrapper = shallow(<NewUser></NewUser>);

        setTimeout(() => {
            expect(wrapper.containsAllMatchingElements([
                //@ts-ignore
                <Form.Input value=""></Form.Input>,
                //@ts-ignore
                <Form.Input value=""></Form.Input>,
                //@ts-ignore
                <Form.Input value=""></Form.Input>,
            ])).toEqual(true);
        });

        //@ts-ignore
        wrapper.find('#username').simulate('change', {currentTarget : {value : 'vetleek'}});                
        //@ts-ignore
        expect(wrapper.containsMatchingElement(<Form.Input value="vetleek"></Form.Input>)).toEqual(true);

        //@ts-ignore
        wrapper.find('#password').simulate('change', {currentTarget : {value : 'pass'}});                
        //@ts-ignore
        expect(wrapper.containsMatchingElement(<Form.Input value="pass"></Form.Input>)).toEqual(true);

        //@ts-ignore
        wrapper.find('#passwordCheck').simulate('change', {currentTarget : {value : 'pass'}});                
        //@ts-ignore
        expect(wrapper.containsMatchingElement(<Form.Input value="pass"></Form.Input>)).toEqual(true);

        done();
    });

    test('Checkbox changes value of admin onclick', (done) => {
        const wrapper = shallow(<NewUser></NewUser>);

        setTimeout(() => {
            expect(wrapper.containsMatchingElement(
                //@ts-ignore
                <Form.Checkbox checked={false}></Form.Checkbox>
            ));
        });

        wrapper.find(Form.Checkbox).simulate('change',  {checked : true});
        //@ts-ignore
        expect(wrapper.containsMatchingElement(<Form.Checkbox checked={true}></Form.Checkbox>));
        done();
    });

    test('Button correctly sets location on click', (done) => {
        const wrapper = shallow(<NewUser></NewUser>);

        wrapper.find(Button.Success).simulate('click');
        

        setTimeout(() => {
            expect(location.hash).toEqual('#/user/login');
        });
        done();
    });
});
