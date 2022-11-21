import * as React from 'react';
import { shallow } from 'enzyme';
import { NavLink } from 'react-router-dom';
import { UserLogin, NewUser } from '../src/component-files/user-components';
import { Form, Button, NavBar, Column, Row, PreviewCard } from '../src/widgets';

jest.mock('../src/service-files/user-service', () => {
  class UserService {
    get() {
      return Promise.resolve({ user_id: 1, username: 'vetle', password: 'tevle', admin: true });
    }

    getAll() {
      return Promise.resolve([
        { user_id: 1, username: 'vetle', password: 'tevle', admin: true },
        { user_id: 2, username: 'sebastian', password: 'seb', admin: false },
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
        { recipe_id: 1, name: 'duck' },
        { recipe_id: 2, name: 'chicken' },
      ]);
    }
    removeLikedRecipe() {
      return Promise.resolve();
    }
  }
  return new UserService();
});

jest.mock('../src/service-files/cart-service', () => {
  class CartService {
    get() {
      return Promise.resolve({ cart_id: 1, ingredients: 'salt' });
    }
    getAllIngredients() {
      return Promise.resolve([
        { cart_id: 1, ingredients: 'salt' },
        { cart_id: 2, ingredients: 'pepper' },
        { cart_id: 3, ingredients: 'oil' },
      ]);
    }
    deleteIngredientFromCart() {
      return Promise.resolve();
    }
  }
  return new CartService();
});

jest.mock('../src/service-files/recipe-service', () => {
  class RecipeService {
    createIngredient() {
      return Promise.resolve();
    }
    getAllRecipeIngredients() {
      return Promise.resolve([
        {
          ingredients_id: 1,
          recipe_id: 1,
          amount: 4,
          unit: 'dl',
        },
        {
          ingredients_id: 2,
          recipe_id: 1,
          amount: 4,
          unit: 'g',
        },
        {
          ingredients_id: 1,
          recipe_id: 2,
          amount: 3,
          unit: 'l',
        },
      ]);
    }
    getAll() {
      return Promise.resolve([
        {
          recipe_id: 1,
          name: 'chicken',
          region: 'africa',
          type: 'meat',
          picture_url: '',
          description: 'very tasty',
        },
        {
          recipe_id: 2,
          name: 'beef',
          region: 'europe',
          type: 'meat',
          picture_url: '',
          description: 'very tasty yumyum',
        },
        {
          recipe_id: 3,
          name: 'corn',
          region: 'america',
          type: 'vegan',
          picture_url: '',
          description: 'it has the juice',
        },
      ]);
    }
    getIngredients() {
      return Promise.resolve([
        {
          ingredients_id: 1,
          name: 'ham',
          amount: '2',
          unit: 'kg',
        },
        {
          ingredients_id: 2,
          name: 'rice',
          amount: '2',
          unit: 'dl',
        },
        {
          ingredients_id: 3,
          name: 'pepper',
          amount: '7',
          unit: 'l',
        },
      ]);
    }
  }
  return new RecipeService();
});

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('Components draw correctly tests', () => {
  test('UserLogin draws correctly when not logged in', () => {
    const wrapper = shallow(<UserLogin />);

    expect(wrapper).toMatchSnapshot();
  });

  test('UserLogin draws correctly when logged in', () => {
    let userData = { user_id: 1, name: 'larsy', password: 'larserkul', admin: true };

    window.sessionStorage.setItem('user', JSON.stringify(userData));

    const wrapper = shallow(<UserLogin></UserLogin>);

    expect(wrapper).toMatchSnapshot();
  });

  test('NewUser draws correctly', () => {
    const wrapper = shallow(<NewUser />);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('Testing NewUser-component', () => {
  test('Input fields value changes', (done) => {
    const wrapper = shallow(<NewUser />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          //@ts-ignore
          <Form.Input value=""></Form.Input>,
          //@ts-ignore
          <Form.Input value=""></Form.Input>,
          //@ts-ignore
          <Form.Input value=""></Form.Input>,
        ])
      ).toEqual(true);
    });

    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'vetleek' } });

    expect(
      //@ts-ignore
      wrapper.containsMatchingElement(<Form.Input type="text" value="vetleek"></Form.Input>)
    ).toEqual(true);

    wrapper
      .find(Form.Input)
      .at(1)
      .simulate('change', { currentTarget: { value: 'pass' } });

    expect(
      //@ts-ignore
      wrapper.containsMatchingElement(<Form.Input type="password" value="pass"></Form.Input>)
    ).toEqual(true);

    //@ts-ignore
    wrapper
      .find(Form.Input)
      .at(2)
      .simulate('change', { currentTarget: { value: 'pass' } });
    expect(
      //@ts-ignore
      wrapper.containsMatchingElement(<Form.Input type="password" value="pass"></Form.Input>)
    ).toEqual(true);

    done();
  });

  test('Checkbox changes value of admin onclick', (done) => {
    const wrapper = shallow(<NewUser />);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          //@ts-ignore
          <Form.Checkbox checked={false}></Form.Checkbox>
        )
      );
    });

    wrapper.find(Form.Checkbox).simulate('change', { checked: true });
    //@ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Checkbox checked={true}></Form.Checkbox>));
    done();
  });

  test('Buttons correctly sets location on click', (done) => {
    const wrapper = shallow(<NewUser />);

    setTimeout(() => {
      wrapper.find(Button.Success).simulate('click');

      expect(location.hash).toEqual('#/user/login');
    });

    setTimeout(() => {
      wrapper.find(Button.Danger).simulate('click');

      expect(location.hash).toEqual('#/user/login/');
    });
    done();
  });
});

describe('Testing UserLogin-component', () => {
  test('Buttons set correct location on click', (done) => {
    const wrapper = shallow(<UserLogin />);

    setTimeout(() => {
      wrapper.find(Button.Danger).at(0).simulate('click');

      expect(location.hash).toEqual('#/user/login');
    });

    setTimeout(() => {
      wrapper.find(Button.Danger).at(1).simulate('click');
      expect(location.hash).toEqual('#/user/login/');
    });
    done();
  });

  test('Test fridge filtering', (done) => {
    const wrapper = shallow(<UserLogin />);

    setTimeout(() => {
      wrapper
        .find(Form.Input)
        .at(1)
        .simulate('change', { currentTarget: { value: 'ham' } });
      wrapper.find(Button.Light).at(1).simulate('click');
    });

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <PreviewCard id={1} url="" name="chicken"></PreviewCard>,
          <PreviewCard id={2} url="" name="beef"></PreviewCard>,
        ])
      );
    });

    setTimeout(() => {
      wrapper
        .find(Form.Input)
        .at(1)
        .simulate('change', { currentTarget: { value: 'rice' } });
      wrapper.find(Button.Light).at(1).simulate('click');
    });

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(<PreviewCard id={1} url="" name="chicken"></PreviewCard>)
      );
    });
  });
});
