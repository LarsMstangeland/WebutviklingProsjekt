import * as React from 'react';
import { RecipeList, RecipeDetails } from '../src/component-files/recipe-components';
import { shallow } from 'enzyme';
import { Form, Button } from '../src/widgets';
import { NavLink } from 'react-router-dom';

jest.mock('../src/recipe-service', () => {
  class RecipeService {
    getAll() {
      return Promise.resolve([
        { recipe_id: 1, name: 'Hotdog', region: 'Norway', picture_url: '', description: 'Namnam' },
        { recipe_id: 1, name: 'Hamburger', region: 'USA', picture_url: '', description: 'Digg' },
        { recipe_id: 1, name: 'Pizza', region: 'Italy', picture_url: '', description: 'Mhmmm' },
      ]);
    }

   getRecipeIngredients() {
    return Promise.resolve([
      
    ])
   }
  }
  return new RecipeService();
});

describe('Recipe component tests', () => {
  test('RecipeList draws correctly', (done) => {
    const wrapper = shallow(<RecipeList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink to="/recipe/1">Hotdog</NavLink>,
          <NavLink to="/recipe/2">Hamburger</NavLink>,
          <NavLink to="/recipe/3">Pizza</NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('TaskNew correctly sets location on create', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 1 } }}/>);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

    wrapper.find(Button.Success).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/4');
      done();
    });
  });
});
