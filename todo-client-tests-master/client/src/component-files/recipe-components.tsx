import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import recipeService, { Recipe, Ingredient, IngredientName } from '../service-files/recipe-service';
import regionAndUnitService, {Region, Unit} from '../service-files/regionAndUnit-service';
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
  recipeIngredients: Ingredient[] = [];
  ingredientsToDelete: Ingredient[] = [];
  regions: Region[] = [];
  units: Unit[] = [];
  newIngredient: Ingredient = {ingredients_id: 0, name: '', amount: 0, unit: ''}
  ingredients: IngredientName[] = [];

  render() {
    return (
      <>
        <Card title="Edit recipe">
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

                {this.regions.map((region) => (
                  <option key={region.id} value={region.name}>
                  {region.name}
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
          <Row>
            <Column>Ingredients name:</Column>
            <Column>Amount:</Column>
            <Column>Unit:</Column>
            <Column></Column>
          </Row>
          {this.recipeIngredients.map((ingredient) => (
            <Row key={ingredient.ingredients_id}>
              <Column>{ingredient.name}</Column>
              <Column><Form.Input
                type="number"
                max='1000'
                value={ingredient.amount}
                onChange={(event) => (ingredient.amount = Number(event.currentTarget.value))}
              /></Column>
              <Column>
                <Form.Select 
                  value={ingredient.unit} 
                  onChange={(event) => (ingredient.unit = event.currentTarget.value)} >
                
                  {this.units.map((unit) => (
                    <option key={unit.id} value={unit.unit}>
                    {unit.unit}
                    </option>
                  ))}
                </Form.Select></Column>
              <Column>
             {this.ingredientsToDelete.findIndex(ing => ing.ingredients_id == ingredient.ingredients_id) == -1 ? 
              <Button.Danger small onClick={() => {
               this.ingredientsToDelete.push(ingredient)
              }}>X</Button.Danger> : 
              <Button.Success small onClick={()=>{
                const index = this.ingredientsToDelete.indexOf(ingredient);
                  if (index > -1) { // only splice array when item is found
                this.ingredientsToDelete.splice(index, 1); // 2nd parameter means remove one item only
                }
              }}>Add</Button.Success>}</Column>
            </Row>
            ))}
            <h4>Add ingredient</h4>
            <Row>
            <Column>{
              this.ingredients ? <Form.Select 
              value={this.newIngredient.name} 
              onChange={(event) => (this.newIngredient.name = event.currentTarget.value)} >
              
              {this.ingredients.map((ingredient) => (
                <option key={ingredient.ingredients_id} value={ingredient.name}>
                {ingredient.name}
                </option>
              ))}
            </Form.Select> :
            'Couldn´t load ingredients'
            }
              
            {/*<Form.Input
                type="text"
                placeholder='Ingredient Name'
                value={this.newIngredient.name}
                onChange={(event) => (this.newIngredient.name = event.currentTarget.value)}
            />*/}</Column>
              <Column><Form.Input
                type="number"
                max='1000'
                value={this.newIngredient.amount}
                onChange={(event) => (this.newIngredient.amount = Number(event.currentTarget.value))}
              /></Column>
              <Column>
                <Form.Select 
                  value={this.newIngredient.unit} 
                  onChange={(event) => (this.newIngredient.unit = event.currentTarget.value)} >
                
                  {this.units.map((unit) => (
                    <option key={unit.id} value={unit.unit}>
                    {unit.unit}
                    </option>
                  ))}
                </Form.Select></Column>
              <Column>
                  <Button.Light small onClick={() => {
                    let id = Number(this.ingredients.find(ing => ing.name == this.newIngredient.name)?.ingredients_id)
                    this.newIngredient.ingredients_id = id;
                    this.recipeIngredients.push(this.newIngredient);
                  }}>Add</Button.Light>
              </Column>
            </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success
              onClick={() => 
                {if(this.ingredientsToDelete.length > 0){
                  this.recipeIngredients = this.recipeIngredients.filter((ingredient) => !this.ingredientsToDelete.includes(ingredient))
                  recipeService.deleteRecipeIngredients(this.ingredientsToDelete, this.recipe.recipe_id)
                }
                 recipeService.updateRecipeIngredients(this.recipeIngredients, this.recipe.recipe_id)
                  recipeService.update(this.recipe).then(() => {
                  history.push('/recipes/' + this.recipe.recipe_id);
                })}
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
      let recipeIngredients = await recipeService.getRecipeIngredients(this.props.match.params.id)
      this.recipeIngredients = recipeIngredients;
      let regions = await regionAndUnitService.getAllRegions()
      this.regions = regions;
      let units = await regionAndUnitService.getAllUnits()
      this.units = units;
      let ingredients = await recipeService.getAllIngredients(this.props.match.params.id)
      this.ingredients = ingredients;

     } catch (error: any) {
      Alert.danger('Error getting recipe or ingredients: ' + error.message)
     }
  }
}