import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
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
      .then((recipes) => (this.recipes = recipes))
      .catch((error) => Alert.danger('Error getting recipes: ' + error.message));
  }
}

/**
 * Renders a specific recipe.
 */
export class RecipeDetails extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = { id: 0, name: '', description: '', region: '' };

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
            <Column width={2}>Region:</Column>
          </Row>
        </Card>
      </>
    );
  }

  mounted() {
    recipeService
      .get(this.props.match.params.id)
      .then((recipe) => (this.recipe = recipe))
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
  }
}