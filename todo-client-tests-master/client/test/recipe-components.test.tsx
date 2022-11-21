import * as React from 'react';
import { RecipeList, RecipeDetails, RecipeEdit } from '../src/component-files/recipe-components';
import { shallow } from 'enzyme';
import { Form, Button, PreviewCard } from '../src/widgets';
import { NavLink } from 'react-router-dom';

jest.mock('../src/service-files/recipe-service', () => {
  class RecipeService {
    get() {
      return Promise.resolve({
        recipe_id: 2,
        name: 'Hamburger',
        region: 'Asia',
        picture_url: '',
        description: 'Digg',
        type: 'Beef',
      });
    }

    getAll() {
      return Promise.resolve([
        {
          recipe_id: 1,
          name: 'Hotdog',
          region: 'Europe',
          picture_url: '',
          description: 'Namnam',
          type: 'Beef',
        },
        {
          recipe_id: 2,
          name: 'Hamburger',
          region: 'Asia',
          picture_url: '',
          description: 'Digg',
          type: 'Beef',
        },
        {
          recipe_id: 3,
          name: 'Pizza',
          region: 'Asia',
          picture_url: '',
          description: 'Mhmmm',
          type: 'Vegatarian',
        },
      ]);
    }

    getRecipeIngredients() {
      return Promise.resolve([]);
    }
  }
  return new RecipeService();
});

jest.mock('../src/service-files/utility-service.tsx', () => {
  class UtilityService {
    getAllRegions() {
      return Promise.resolve([
        { id: 1, name: 'Europe' },
        { id: 2, name: 'Asia' },
      ]);
    }

    getAllTypes() {
      return Promise.resolve([
        { id: 1, name: 'Beef' },
        { id: 2, name: 'Pork' },
        { id: 3, name: 'Vegatarian' },
      ]);
    }
  }
  return new UtilityService();
});

describe('RecipeList tests', () => {
  test('RecipeList draws correctly - snapshot', () => {
    const wrapper = shallow(<RecipeList />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Region input filters correct', (done) => {
    const wrapper = shallow(<RecipeList />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <PreviewCard id={1} url="" name="Hotdog"></PreviewCard>,
          <PreviewCard id={2} url="" name="Hamburger"></PreviewCard>,
          <PreviewCard id={3} url="" name="Pizza"></PreviewCard>,
        ])
      ).toEqual(true);
    });

    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'Asia' } });

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <PreviewCard id={2} url="" name="Hamburger"></PreviewCard>,
          <PreviewCard id={3} url="" name="Pizza"></PreviewCard>,
        ])
      ).toEqual(true);
    });
    done();
  });
  /*test('RecipeList draws correctly', (done) => {
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
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 1 } }} />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

    wrapper.find(Button.Success).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/4');
      done();
    });
  });*/
});

describe('RecipeDetails tests', () => {
  test('RecipeDetails draws correctly - snapshot', () => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 1 } }} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('Region input filters correct', (done) => {
    const wrapper = shallow(<RecipeList />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <PreviewCard id={1} url="" name="Hotdog"></PreviewCard>,
          <PreviewCard id={2} url="" name="Hamburger"></PreviewCard>,
          <PreviewCard id={3} url="" name="Pizza"></PreviewCard>,
        ])
      ).toEqual(true);
    });

    wrapper
      .find(Form.Input)
      .at(0)
      .simulate('change', { currentTarget: { value: 'Asia' } });

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <PreviewCard id={2} url="" name="Hamburger"></PreviewCard>,
          <PreviewCard id={3} url="" name="Pizza"></PreviewCard>,
        ])
      ).toEqual(true);
    });
    done();
  });
});

describe('RecipeEdit tests', () => {
  test('RecipeEdit draws correctly - snapshot', () => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 1 } }} />);

    expect(wrapper).toMatchSnapshot();
  });
});
