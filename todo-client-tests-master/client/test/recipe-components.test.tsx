import * as React from 'react';
import { RecipeList, RecipeDetails, RecipeEdit } from '../src/component-files/recipe-components';
import { shallow } from 'enzyme';
import { Form, Button, PreviewCard, Column, Alert } from '../src/widgets';
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
      return Promise.resolve([
        { ingredients_id: 1, name: 'water', amount: '1', unit: 'dl' },
        { ingredients_id: 2, name: 'chicken', amount: '200', unit: 'g' },
      ]);
    }

    getAllIngredients() {
      return Promise.resolve([
        { ingredients_id: 1, name: 'water' },
        { ingredients_id: 2, name: 'chicken' },
        { ingredients_id: 3, name: 'chili' },
        { ingredients_id: 4, name: 'pepper' },
      ]);
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

    getAllUnits() {
      return Promise.resolve([
        { id: 1, unit: 'dl' },
        { id: 2, unit: 'g' },
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
      .find(Form.Select)
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

  test('Type input filters correct', (done) => {
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
      .find(Form.Select)
      .at(1)
      .simulate('change', { currentTarget: { value: 'Beef' } });

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <PreviewCard id={1} url="" name="Hotdog"></PreviewCard>,
          <PreviewCard id={2} url="" name="Hamburger"></PreviewCard>,
        ])
      ).toEqual(true);
    });
    done();
  });

  test('Test to see if recipe in list push correct location', (done) => {
    const wrapper = shallow(<RecipeList />);

    setTimeout(() => {
      wrapper.find(PreviewCard).at(0).simulate('click');
    });

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes/1');
    });

    done();
  });
});

describe('RecipeDetails tests', () => {
  test('RecipeDetails draws correctly - snapshot', () => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 1 } }} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('RecipeDetails draws correctly when not logged in', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <h2>Hamburger</h2>,
          <div>
            <p>Region:</p>
            <p>Asia</p>
          </div>,
          <div>
            <p>Type:</p>
            <p>Beef</p>
          </div>,
          <div>
            <p>Description:</p>
            <p>Digg</p>
          </div>,
          <PreviewCard id={1} url="" name="Hotdog"></PreviewCard>,
          <PreviewCard id={3} url="" name="Pizza"></PreviewCard>,
        ])
      ).toEqual(true);
    });

    wrapper.find(Button.Success).at(0).simulate('click');

    expect(
      wrapper.containsMatchingElement(
        <div>
          Log in to like a recipe
          <button />
        </div>
      )
    );

    done();
  });

  test('RecipeDetails draws correctly when logged in', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 2 } }} />);

    const userData = { user_id: 1, username: 'larsy', password: 'larserkul', admin: true };
    window.sessionStorage.setItem('user', JSON.stringify(userData));

    wrapper.find(Button.Success).at(0).simulate('click');

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements(
          //@ts-ignore
          <Button.Danger>Unlike</Button.Danger>,
          //@ts-ignore
          <Button.Danger>Delete</Button.Danger>,
          //@ts-ignore
          <Button.Success>Edit</Button.Success>
        )
      );
    });

    done();
  });

  test('Sets location to edit page on click', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 2 } }} />);

    wrapper.find(Button.Success).at(2).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes/2/edit');
    });

    done();
  });

  test('Sets location to recipe list page on click', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Danger).at(0).simulate('click');
    });

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes');
    });

    done();
  });

  test('Test if amount in ingredients is responsive', () => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([<Column>1</Column>, <Column>200</Column>]));
    });

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 2 } });

    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([<Column>0.5</Column>, <Column>100</Column>]));
    });
  });

  test('Test like button', (done) => {
    const wrapper = shallow(<RecipeDetails match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Success).at(0).simulate('click');
    });

    setTimeout(() => {
      expect(
        //@ts-ignore
        wrapper.containsMatchingElement(<Button.Danger>Unlike</Button.Danger>)
      );
    });

    setTimeout(() => {
      wrapper.find(Button.Danger).at(0).simulate('click');
    });

    setTimeout(() => {
      expect(
        //@ts-ignore
        wrapper.containsMatchingElement(<Button.Success>Like</Button.Success>)
      );
    });

    done();
  });
});

describe('RecipeEdit tests', () => {
  test('RecipeEdit draws correctly - snapshot', () => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 1 } }} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('RecipeEdit draws correctly', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <h2>Hamburger</h2>,
          //@ts-ignore
          <Form.Input value="Hamburger"></Form.Input>,
          //@ts-ignore
          <Form.Select value="Asia"></Form.Select>,
          //@ts-ignore
          <Form.Select value="Beef"></Form.Select>,
          //@ts-ignore
          <Form.Textarea value="Digg"></Form.Textarea>,
          <Column>Water</Column>,
          //@ts-ignore
          <Form.Input value="1"></Form.Input>,
          //@ts-ignore
          <Form.Select value="dl"></Form.Select>,
          <Column>Chicken</Column>,
          //@ts-ignore
          <Form.Input value="200"></Form.Input>,
          //@ts-ignore
          <Form.Select value="g"></Form.Select>,
        ])
      ).toEqual(true);
    });

    done();
  });

  test('RecipeEdit add ingredient to recipe', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column>Water</Column>,
          //@ts-ignore
          <Form.Input value="1"></Form.Input>,
          //@ts-ignore
          <Form.Select value="dl"></Form.Select>,
          <Column>Chicken</Column>,
          //@ts-ignore
          <Form.Input value="200"></Form.Input>,
          //@ts-ignore
          <Form.Select value="g"></Form.Select>,
        ])
      ).toEqual(true);
    });

    wrapper
      .find(Form.Input)
      .at(2)
      .simulate('change', { currentTarget: { value: 'chi' } });

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          <datalist>
            <option value={'chicken'}>chicken</option>
            <option value={'chili'}>chili</option>
          </datalist>
        )
      ).toEqual(true);
    });

    wrapper
      .find(Form.Input)
      .at(2)
      .simulate('change', { currentTarget: { value: 'rice' } });
    wrapper
      .find(Form.Input)
      .at(3)
      .simulate('change', { currentTarget: { value: '100' } });
    wrapper
      .find(Form.Select)
      .at(2)
      .simulate('change', { currentTarget: { value: 'g' } });
    wrapper.find(Button.Light).at(0).simulate('click');

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column>Water</Column>,
          //@ts-ignore
          <Form.Input value="1"></Form.Input>,
          //@ts-ignore
          <Form.Select value="dl"></Form.Select>,
          <Column>Chicken</Column>,
          //@ts-ignore
          <Form.Input value="200"></Form.Input>,
          //@ts-ignore
          <Form.Select value="g"></Form.Select>,
          <Column>Rice</Column>,
          //@ts-ignore
          <Form.Input value="100"></Form.Input>,
          //@ts-ignore
          <Form.Select value="g"></Form.Select>,
        ])
      ).toEqual(true);
    });

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements(
          //@ts-ignore
          <Button.Danger>Unlike</Button.Danger>,
          //@ts-ignore
          <Button.Danger>Delete</Button.Danger>,
          //@ts-ignore
          <Button.Success>Edit</Button.Success>
        )
      );
    });

    done();
  });

  test('RecipeEdit sets correct location after save', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 2 } }} />);

    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/recipes/2');
    });

    done();
  });

  test('Delete and add ingredient to recipe', (done) => {
    const wrapper = shallow(<RecipeEdit match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Danger).at(0).simulate('click');
    });

    setTimeout(() => {
      expect(
        //@ts-ignore
        wrapper.containsMatchingElement(<Button.Success>Add</Button.Success>)
      );
    });

    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements(
          //@ts-ignore
          <Button.Danger>X</Button.Danger>,
          //@ts-ignore
          <Button.Danger>X</Button.Danger>
        )
      );
    });

    done();
  });
});
