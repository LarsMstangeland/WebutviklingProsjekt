import * as React from 'react';
import { shallow } from 'enzyme';
import { NavLink } from 'react-router-dom';
import {UserLogin, NewUser} from '../src/component-files/user-components';
import { Form , Button, NavBar, Column, Row} from '../src/widgets';

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
        likeRecipe() {
            return Promise.resolve();
        }

        getLikedRecipes() {
            return Promise.resolve([
                {recipe_id : 1, name : 'duck'},
                {recipe_id : 2, name : 'chicken'}
            ]);
        }
        removeLikedRecipe() {
            return Promise.resolve();
        }
    }
    return new UserService();
})

jest.mock('../src/service-files/cart-service', () => {
    class CartService {
        get() {
            return Promise.resolve(
                {cart_id : 1, ingredients : 'salt'}
            );
        }
        getAllIngredients(){
            return Promise.resolve([
                {cart_id : 1, ingredients : 'salt'},
                {cart_id : 2, ingredients : 'pepper'},
                {cart_id : 3, ingredients : 'oil'},
            ]);
        }
        deleteIngredientFromCart() {
            return Promise.resolve();
        }
    }
    return new CartService();
})
// jest.setTimeout(30000);

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
        wrapper.find(Form.Input).at(0).simulate('change', {currentTarget : {value : 'vetleek'}});                
        //@ts-ignore
        expect(wrapper.containsMatchingElement(<Form.Input type="text" value="vetleek"></Form.Input>)).toEqual(true);

        //@ts-ignore
        wrapper.find(Form.Input).at(1).simulate('change', {currentTarget : {value : 'pass'}});                
        //@ts-ignore
        expect(wrapper.containsMatchingElement(<Form.Input type="password" value="pass"></Form.Input>)).toEqual(true);

        //@ts-ignore
        wrapper.find(Form.Input).at(2).simulate('change', {currentTarget : {value : 'pass'}});                
        //@ts-ignore
        expect(wrapper.containsMatchingElement(<Form.Input type="password" value="pass"></Form.Input>)).toEqual(true);

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

    test('Buttons correctly sets location on click', (done) => {
        const wrapper = shallow(<NewUser></NewUser>);

        setTimeout(() => {
        wrapper.find(Button.Success).simulate('click');
        

            expect(location.hash).toEqual('#/user/login');
        });

        setTimeout(() => {
        wrapper.find(Button.Danger).simulate('click');

            expect(location.hash).toEqual('#/user/login');
        });
        done();
    });
});


describe('Testing UserLogin-component', () => {

    test('Buttons set correct location on click', (done) => {
        const wrapper = shallow(<UserLogin></UserLogin>);

        setTimeout(() => {
        wrapper.find(Button.Danger).at(0).simulate('click');

            expect(location.hash).toEqual('#/user/login');   
        });

        setTimeout(() => {
            wrapper.find(Button.Danger).at(1).simulate('click');
            expect(location.hash).toEqual('#/user/login');   
        })
        done();
    });

    test('Displays correct userinformation', (done) => {
        const wrapper = shallow(<UserLogin></UserLogin>)

        expect(wrapper.containsAllMatchingElements([
            //@ts-ignore
            <Column>vetle</Column>,
            //@ts-ignore
            <Column>Admin</Column>,
        ])).toEqual(true);
        done();
    })

    test('Displays correct likedRecipes', (done) => {
        const wrapper = shallow(<UserLogin></UserLogin>);

        expect(wrapper.containsAllMatchingElements([
            //@ts-ignore
            <Row key={1}><NavLink to="/recipes/1"><Column>duck</Column></NavLink></Row>,
            //@ts-ignore
            <Row key={2}><NavLink to="/recipes/1"><Column>chicken</Column></NavLink></Row>
        ])).toEqual(true);
        done();
    });

    
});