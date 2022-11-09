import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import recipeService, { Recipe } from './recipe-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/**
 * Renders recipe list.
 */
export class RecipeList extends Component {
  recipes: Recipe[] = [];

  render() {
    return (
      <>
        <Card title="Recipes">
          {this.recipes.map((recipe) => (
            <Row key={recipe.id}>
              <Column>
                <NavLink to={'/recipes/' + recipe.id}>{recipe.name}</NavLink>
              </Column>
            </Row>
          ))}
        </Card>
      </>
    );
  }

  mounted() {
    recipeService
      .getAll()
      .then((recipes) => (this.recipe = recipes))
      .catch((error) => Alert.danger('Error getting recipes: ' + error.message));
  }
}

/**
 * Renders a specific recipe.
 */
export class RecipeDetails extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = { id: 0, name: '', region: '' };

  render() {
    return (
      <>
        <Card title="recipe">
          <Row>
            <Column width={2}>Title:</Column>
            <Column>{this.recipe.name}</Column>
          </Row>
          <Row>
            <Column width={2}>Description:</Column>
          </Row>
          <Row>
            <Column width={2}>Done:</Column>
            <Column>
              <Form.Checkbox checked={this.recipe.done} onChange={() => {}} disabled />
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => history.push('/recipes/' + this.props.match.params.id + '/edit')}
        >
          Edit
        </Button.Success>
      </>
    );
  }

  mounted() {
    taskService
      .get(this.props.match.params.id)
      .then((recipe) => (this.recipe = recipe))
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }
}

/**
 * Renders form to edit a specific recipe.
 */
export class TaskEdit extends Component<{ match: { params: { id: number } } }> {
  recipe: recipe = { id: 0, title: '', done: false };

  render() {
    return (
      <>
        <Card title="Edit recipe">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.recipe.title}
                onChange={(event) => (this.recipe.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea value="" onChange={() => {}} rows={10} disabled />
            </Column>
          </Row>
          <Row>
            <Column width={2}>Done:</Column>
            <Column>
              <Form.Checkbox
                checked={this.recipe.done}
                onChange={(event) => (this.recipe.done = event.currentTarget.checked)}
              />
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={() => Alert.info('Not yet implemented')}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Danger onClick={() => Alert.info('Not yet implemented')}>Delete</Button.Danger>
          </Column>
        </Row>
      </>
    );
  }

  mounted() {
    taskService
      .get(this.props.match.params.id)
      .then((recipe) => (this.recipe = recipe))
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }
}

/**
 * Renders form to create new recipe.
 */
export class TaskNew extends Component {
  title = '';

  render() {
    return (
      <>
        <Card title="New recipe">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.title}
                onChange={(event) => (this.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea value="" onChange={() => {}} rows={10} disabled />
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => {
            taskService
              .create(this.title)
              .then((id) => history.push('/recipes/' + id))
              .catch((error) => Alert.danger('Error creating recipe: ' + error.message));
          }}
        >
          Create
        </Button.Success>
      </>
    );
  }
}
