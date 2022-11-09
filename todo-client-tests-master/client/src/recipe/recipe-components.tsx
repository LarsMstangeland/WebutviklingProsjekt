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
  recipe: Recipe = { recipe_id: 0, name: '', description: '', region: '', picture_url: '' };
  ingredients: Ingredient[] = [];

  render() {
    
    return (
      <>
        {console.log(this.recipe)}
        <Card title={this.recipe.name}>
          <Row>
            <picture>
              <img src={this.recipe.picture_url} alt={this.recipe.name} />
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
          {this.ingredients.map((ingredient) => (
            <Row key={ingredient.ingredients_id}>
              <Column>{ingredient.name}</Column>
              <Column>{ingredient.amount}</Column>
              <Column>{ingredient.unit}</Column>
            </Row>
            ))}
        </Card>
      </>
    );
  }

  async mounted() {
    /*
    recipeService
      .get(this.props.match.params.id)
      .then((recipe) => (this.recipe = recipe)).then(()=>{
        recipeService
        .getRecipeIngredients(this.recipe.recipe_id)
        .then((ingredients) => ( this.ingredients = ingredients)).then(()=>{console.log(this.ingredients)})
        .catch((error) => Alert.danger('Error getting ingredients: ' + error.message));
      })
      .catch((error) => Alert.danger('Error getting recipe: ' + error.message));
      */
     try {
      let recipe = await recipeService.get(this.props.match.params.id)
      this.recipe = recipe;
      let ingredients = await recipeService.getRecipeIngredients(this.props.match.params.id)
      this.ingredients = ingredients;

     } catch (error: any) {
      Alert.danger('Error getting recipe or ingredients: ' + error.message)
     }
      
  }
}