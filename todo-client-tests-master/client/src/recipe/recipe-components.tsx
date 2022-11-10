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
          <Row>
            <Column><Button.Danger onClick={() => {
                recipeService.delete(this.recipe.recipe_id).then(() => {
                  history.push('/recipes');
            })
            }}>Delete</Button.Danger></Column>
            <Column><Button.Success onClick={() => {
              history.push('/recipes/' + this.props.match.params.id + '/edit')
            }}>Edit</Button.Success></Column>
          </Row>
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

export class RecipeEdit extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = { recipe_id: 0, name: '', description: '', region: '', picture_url: '' };
  ingredients: Ingredient[] = [];
  regions: any = ['Scandinavnia', 'America', 'Asia', 'Africa', 'Norway']

  render() {
    return (
      <>
        <Card title="Edit task">
          <Row>
            <Column width={2}>
              <Form.Label>Name:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.recipe.name}
                onChange={(event) => (this.recipe.name = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Region:</Form.Label>
            </Column>
            <Column>
              <Form.Select 
                value={this.recipe.region} 
                onChange={(event) => (this.recipe.region = event.currentTarget.value)}>

                {this.regions.map((region: String) => (
                  <option key={Math.random()*10} value={region}>
                  {region}
                </option>
                ))}
              </Form.Select>
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.recipe.description}
                onChange={(event) => {
                  this.recipe.description = event.currentTarget.value;
                }}
                rows={10}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>Image URL:</Column>
            <Column>
                <Form.Input
                  type='text'
                  value={this.recipe.picture_url}
                  onChange={(event) => (this.recipe.picture_url = event.currentTarget.value)}
                ></Form.Input>
            </Column>
          </Row>
        </Card>
        {/**
         * {this.ingredients.map((ingredient) => (
            <Row key={ingredient.ingredients_id}>
              <Column><Form.Input
                type="text"
                value={ingredient.name}
                onChange={(event) => (ingredient.name = event.currentTarget.value)}
              /></Column>
              <Column><Form.Input
                type="number"
                value={ingredient.amount}
                onChange={(event) => (ingredient.amount = Number(event.currentTarget.value))}
              /></Column>
              <Column><Form.Select 
              value={ingredient.unit} 
              onChange={(event) => (ingredient.unit = event.currentTarget.value)} 
              /></Column>
              <Column><Button.Danger small onClick={() => {
               
                let a = this.ingredients.findIndex(ing => ing.ingredients_id == ingredient.ingredients_id)
                this.ingredients.slice(a)
                console.log(this.ingredients);
                console.log(a);
                
                
             }}>X</Button.Danger></Column>
            </Row>
            ))}
         */}
        
        <Row>
          <Column>
            <Button.Success
              onClick={() =>
                recipeService.update(this.recipe).then(() => {
                  history.push('/recipes/' + this.recipe.recipe_id);
                })
              }
            >
              Save
            </Button.Success>
          </Column>
        </Row>
      </>
    );
  }

 async mounted() {
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