import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import recipeService, { Recipe, Ingredient } from './recipe-service';
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
      {console.log(this.recipes)}
        <Card title="Recipes">
          {this.recipes.map((recipe) => (
            <Row key={recipe.recipe_id}>
              <Column>
                <NavLink to={'/recipes/' + recipe.recipe_id}>{recipe.name}</NavLink>
              
              </Column>
            </Row>))}
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
  recipe: Recipe = { recipe_id: 0, name: '', description: '', region: '', picture: '' };
  ingredients: Ingredient[] = [];

  render() {
    
    return (
      <>
        <Card title={this.recipe.name}>
          <Row>
            <picture>
              <img src={this.recipe.picture} alt={this.recipe.name} />
            </picture>
          </Row>
          <Row>
            <Column width={2}>Region:</Column>
            <Column>{this.recipe.region}</Column>
          </Row>
          <Row>
            <Column width={2}>Description:</Column>
            <Column>{this.recipe.description}</Column>
          </Row>
            <Row>
            {this.ingredients.map((ingredient) => {
              <Row key={ingredient.ingredient_id}>
                <Column>{ingredient.name}</Column>
                <Column>{ingredient.amount}</Column>
                <Column>{ingredient.unit}</Column>
              </Row>
            })}
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

      /** 
      recipeService
      .getRecipeIngredients()
      .then((ingredients) => (this.ingredients = ingredients))
      .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
      */
  }
}